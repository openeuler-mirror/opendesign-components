import { ref, watch, computed, reactive, ToRefs, Ref, ComputedRef } from 'vue';
import { useMounted, until } from '@vueuse/core';

import { isNil, isClient } from '../_utils/is';
import { getElementRectByRAF } from '../_utils/dom';
import { DataTablePropsT, DataTableSpanMethod, EffectiveDataTableColumnT } from './types';
import { getGroupColumns, isEmptyCell, getCellValue, getStaticWidth, clampColumnWidth, resolveColumnWidth } from './utils';

type RemovedBodyCellInfo = {
  /** 当前单元格的索引 */
  index: string;
  /** 被如何合并的 */
  removedMethod: 'colspan' | 'rowspan';
  /** 由哪一列触发的合并 */
  removedBy: string;
};

/**
 * 列宽上下文：userWidths / containerWidth / size 三者经常一起传递，封装为配置对象
 */
interface ColumnWidthCtx {
  /** 用户拖拽设定的列宽 Map */
  userWidths: Map<string, number>;
  /** 容器宽度 */
  containerWidth: number;
  /** 表格尺寸标识 */
  size: string;
}

/**
 * 合并单元格信息输入
 */
interface SpanCellInput {
  /** 当前行索引 */
  rowIndex: number;
  /** 当前列索引 */
  colIndex: number;
  /** 触发合并的列 key */
  columnKey: string;
  /** spanMethod 返回的合并结果 */
  spanResult: { colSpan?: number; rowSpan?: number } | void;
}

/**
 * auto 布局清理输入
 */
interface AutoLayoutInput {
  /** 表格 DOM 元素 */
  tableEl: HTMLTableElement | undefined;
  /** 数据列列表 */
  dataColumns: EffectiveDataTableColumnT[];
  /** 用户拖拽设定的列宽 Map */
  userWidths: Map<string, number>;
  /** 末列自动吸收盈余时写入 userWidths 的 key 集合 */
  autoFillKeys: Set<string>;
}

/**
 * 列就绪检测输入
 */
interface ColumnsReadyInput {
  /** 数据列列表 */
  columns: EffectiveDataTableColumnT[];
  /** 数据长度 */
  dataLength: number;
  /** 表格 DOM 元素 */
  tableEl: HTMLTableElement | undefined;
  /** 容器宽度 */
  containerWidth: number;
}

/**
 * 末列吸收盈余输入
 */
interface FillResizeInput {
  /** 被拖拽的列 */
  draggedCol: EffectiveDataTableColumnT;
  /** 数据列列表 */
  dataColumns: EffectiveDataTableColumnT[];
  /** 用户拖拽设定的列宽 Map */
  userWidths: Map<string, number>;
  /** 末列自动吸收盈余的 key 集合 */
  autoFillKeys: Set<string>;
  /** 表格 DOM 元素 */
  tableEl: HTMLTableElement | undefined;
  /** 拖拽期间表格最小宽度 */
  minTableWidth: number;
  /** 末列拖拽前的基础宽度 */
  fillColBaseWidth: number;
  /** 锁定表格宽度函数 */
  lockTableWidth: () => void;
}

/**
 * @description 各尺寸对应的默认列最小宽度（px），未声明 minWidth 时作为下限
 */
const DEFAULT_MIN_COL_WIDTH: Record<string, number> = { small: 96, medium: 136 };

/**
 * @description 按尺寸获取默认最小列宽，未知尺寸回退到 medium
 * @param size 表格尺寸标识
 * @returns 默认最小列宽（px）
 */
const getDefaultMinWidth = (size: string): number => DEFAULT_MIN_COL_WIDTH[size] ?? DEFAULT_MIN_COL_WIDTH.medium;

/**
 * @description 钳制宽度到 _minWidth / _maxWidth 边界范围内。
 *              拖拽 mousemove 与末列吸收盈余共用此口径，保证任意时机的钳制一致。
 * @param width 待钳制的原始宽度
 * @param minWidth 列最小宽度边界（可为 nil 表示无下限）
 * @param maxWidth 列最大宽度边界（可为 nil 表示无上限）
 * @returns 钳制后的宽度
 */
const clampToBounds = (width: number, minWidth?: number, maxWidth?: number): number => {
  let result = width;
  if (!isNil(minWidth)) {
    result = Math.max(result, minWidth);
  }
  if (!isNil(maxWidth)) {
    result = Math.min(result, maxWidth);
  }
  return result;
};

/**
 * @description 根据 spanMethod 返回的合并信息，计算当前单元格因合并而被移除的单元格列表。
 *              colspan 生成被列合并移除的单元格（含 rowspan 覆盖形成矩形而非 L 形）；
 *              rowspan 生成被行合并移除的单元格（原列后续行）。
 * @param rowIndex 当前行索引
 * @param colIndex 当前列索引
 * @param columnKey 触发合并的列 key（用于 removedBy 追溯）
 * @param spanResult spanMethod 返回的合并结果
 * @returns 被移除的单元格信息数组
 */
const collectSpanRemovedCells = ({ rowIndex, colIndex, columnKey, spanResult }: SpanCellInput): RemovedBodyCellInfo[] => {
  const result: RemovedBodyCellInfo[] = [];
  const colSpan = spanResult?.colSpan ?? 0;
  const rowSpan = spanResult?.rowSpan ?? 0;

  if (colSpan > 1) {
    for (let i = 0; i < colSpan - 1; i++) {
      const targetColIndex = colIndex + i + 1;
      // 同时覆盖行，实际生效为矩形而不是 L 形
      if (rowSpan > 1) {
        for (let j = 0; j < rowSpan - 1; j++) {
          result.push({ index: `${rowIndex + j + 1}_${targetColIndex}`, removedMethod: 'rowspan', removedBy: columnKey });
        }
      }
      result.push({ index: `${rowIndex}_${targetColIndex}`, removedMethod: 'colspan', removedBy: columnKey });
    }
  }
  // 覆盖只有行合并的情况
  if (rowSpan > 1) {
    for (let i = 0; i < rowSpan - 1; i++) {
      result.push({ index: `${rowIndex + i + 1}_${colIndex}`, removedMethod: 'rowspan', removedBy: columnKey });
    }
  }
  return result;
};

/**
 * @description 判断指定位置的单元格是否因 colspan 被隐藏。
 *              未被移除 → 可见（非隐藏）；被 rowspan 移除 → 仍可见（来自上方行 rowspan）；
 *              仅被 colspan 移除 → 隐藏。
 * @param rowIndex 行索引
 * @param colIndex 列索引
 * @param removedCells 已移除单元格信息列表
 * @returns 是否因 colspan 被隐藏
 */
const isCellHiddenByColspan = (rowIndex: number, colIndex: number, removedCells: RemovedBodyCellInfo[]): boolean => {
  const cellInfo = removedCells.filter((v) => v.index === `${rowIndex}_${colIndex}`);
  if (!cellInfo.length) {
    return false;
  }
  return !cellInfo.some((v) => v.removedMethod === 'rowspan');
};

/**
 * @description 计算列的 _minWidth/_maxWidth 像素边界（基于 minWidth/maxWidth prop 与容器宽度）。
 *              minWidth 未声明时回退 DEFAULT_MIN_COL_WIDTH（按 size 取值）；
 *              maxWidth 仅在声明时计算。fixColumnAfterMounted 重算与拖拽前同步兜底共用此口径。
 * @param column 列配置（写入 _minWidth / _maxWidth）
 * @param containerWidth 容器宽度
 * @param size 表格尺寸标识
 */
const resolveColumnBounds = (column: EffectiveDataTableColumnT, containerWidth: number, size: string) => {
  column._minWidth = column.minWidth ? (getStaticWidth(column.minWidth, containerWidth) ?? getDefaultMinWidth(size)) : getDefaultMinWidth(size);
  if (column.maxWidth) {
    column._maxWidth = getStaticWidth(column.maxWidth, containerWidth);
  }
};

/**
 * @description 从声明的 width prop 解析像素宽度（经 clampColumnWidth 钳制）
 * @param col 列配置
 * @param containerWidth 容器宽度
 * @returns 解析后的像素宽度，无效时返回 0
 */
const resolveDeclaredWidth = (col: EffectiveDataTableColumnT, containerWidth: number): number => {
  if (isNil(col.width)) {
    return 0;
  }
  const px = getStaticWidth(col.width, containerWidth);
  if (isNil(px) || px <= 0) {
    return 0;
  }
  return clampColumnWidth(col, px);
};

/**
 * @description 从 DOM 测量解析像素宽度（经 clampColumnWidth 钳制）
 * @param col 列配置
 * @returns 测量并钳制后的像素宽度
 */
const resolveMeasuredWidth = (col: EffectiveDataTableColumnT): number => {
  const w = col.thRef?.getBoundingClientRect().width ?? 0;
  return clampColumnWidth(col, Math.max(w, col._minWidth ?? 0));
};

/**
 * @description 将解析后的宽度应用到列的 colRef 和 resizeWidth
 * @param col 列配置
 * @param width 待应用的像素宽度
 */
const applyResolvedWidth = (col: EffectiveDataTableColumnT, width: number) => {
  if (width > 0) {
    col.colRef!.style.width = `${width}px`;
    col.resizeWidth = width;
  }
};

/**
 * @description 拖拽前同步测量单列宽度并锁定（fix 未完成时的兜底）。
 *              确保拖拽前 _minWidth/_maxWidth 已计算，且已处于 fixed 布局。
 * @param col 列配置
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param containerWidth 容器宽度
 * @param size 表格尺寸标识
 */
const syncColumnWidthForResize = (col: EffectiveDataTableColumnT, { userWidths, containerWidth, size }: ColumnWidthCtx) => {
  if (isNil(col._minWidth)) {
    resolveColumnBounds(col, containerWidth, size);
  }
  if (!col.colRef || !isNil(userWidths.get(col.key))) {
    return;
  }
  const width = !isNil(col.width) ? resolveDeclaredWidth(col, containerWidth) : resolveMeasuredWidth(col);
  applyResolvedWidth(col, width);
};

/**
 * @description Phase 3 单列：计算 _minWidth/_maxWidth 并设置 resizeWidth。
 *              resizeWidth 优先级：userWidths > 声明 width > thRef DOM 测量。
 * @param column 列配置
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param containerWidth 容器宽度
 * @param size 表格尺寸标识
 */
const resolveColumnResizeWidth = async (column: EffectiveDataTableColumnT, { userWidths, containerWidth, size }: ColumnWidthCtx) => {
  resolveColumnBounds(column, containerWidth, size);
  const resolved = resolveColumnWidth(column, userWidths, containerWidth);
  if (!isNil(resolved)) {
    column.resizeWidth = resolved;
    return;
  }
  // 自动列：从 thRef 测量（colspan>1 时 thRef 含合并列宽度，改用 colRef）
  const hasColspan = (column.colSpan ?? 0) > 1 || (column.customColSpan ?? 0) > 1;
  const measureRef = hasColspan || !column.thRef ? column.colRef : column.thRef;
  if (!measureRef) {
    return;
  }
  const measured = await getElementRectByRAF(measureRef).then((rect) => rect.width);
  const finalWidth = clampColumnWidth(column, Math.max(measured, column._minWidth ?? 0));
  if (finalWidth > 0) {
    column.colRef!.style.width = `${finalWidth}px`;
    column.resizeWidth = finalWidth;
  }
};

/**
 * @description 同步表头分割线宽度与表格宽度一致。
 *              分割线在 OScroller 外部（left:0;right:0 撑满容器），表格缩窄后需命令式同步宽度保持视觉统一。
 *              表格比容器宽（有滚动条）时清除内联宽度，让 CSS left:0;right:0 撑满容器。
 * @param tableEl 表格 DOM 元素
 * @param width 目标宽度（表格宽度），0 或负值时清除内联宽度
 */
const syncDividerWidth = (tableEl: HTMLTableElement | undefined, width: number) => {
  if (!tableEl) {
    return;
  }
  const container = tableEl.closest('.o-data-table') as HTMLElement | null;
  const divider = container?.querySelector('.o-data-table-header-divider-h') as HTMLElement | null;
  if (!divider || !container) {
    return;
  }
  // 表格比容器宽（有滚动条）或宽度无效时，清除内联宽度让 CSS left:0;right:0 撑满容器
  if (width <= 0 || width >= container.clientWidth) {
    divider.style.width = '';
  } else {
    divider.style.width = `${width}px`;
  }
};

/**
 * @description Phase 1：切回 auto 布局，清除自动列的 colRef.style.width 和 table 内联宽度。
 *              先清除末列自动吸收的盈余值（非用户拖拽），使其重新参与自动分配。
 * @param tableEl 表格 DOM 元素
 * @param dataColumns 数据列列表
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param autoFillKeys 末列自动吸收盈余时写入 userWidths 的 key 集合
 */
const prepareAutoLayoutPhase = ({ tableEl, dataColumns, userWidths, autoFillKeys }: AutoLayoutInput) => {
  for (const key of autoFillKeys) {
    userWidths.delete(key);
  }
  autoFillKeys.clear();
  if (tableEl) {
    tableEl.style.tableLayout = '';
    tableEl.style.width = '';
    syncDividerWidth(tableEl, 0);
  }
  dataColumns.forEach((column) => {
    if (isNil(column.width) && isNil(userWidths.get(column.key)) && column.colRef) {
      column.colRef.style.width = '';
    }
  });
};

/**
 * @description 判断所有列是否均无固定/宽度声明（fix 无需执行）
 * @param columns 数据列列表
 * @returns 全部列无 fixed/width/minWidth/maxWidth 时为 true
 */
const isAllColumnsUnfixed = (columns: EffectiveDataTableColumnT[]): boolean =>
  columns.every(({ fixed, width, minWidth, maxWidth }) => [fixed, width, minWidth, maxWidth].every((v) => isNil(v)));

/**
 * @description 判断列渲染前置条件是否就绪（所有 colRef 就位、有数据、table 挂载、容器宽度非零）
 * @param columns 数据列列表
 * @param dataLength 数据长度
 * @param tableEl 表格 DOM 元素
 * @param containerWidth 容器宽度
 * @returns 前置条件全部满足时为 true
 */
const isColumnsReady = ({ columns, dataLength, tableEl, containerWidth }: ColumnsReadyInput): boolean =>
  columns.every((column) => !!column.colRef) && dataLength > 0 && !!tableEl && containerWidth > 0;

/**
 * @description 计算排除指定列后的列宽总和
 * @param cols 数据列列表
 * @param excludeKey 需排除的列 key
 * @returns 排除指定列后的 resizeWidth 总和
 */
const sumColumnWidthsExcluding = (cols: EffectiveDataTableColumnT[], excludeKey: string): number =>
  cols.reduce((sum, col) => (col.key === excludeKey ? sum : sum + (col.resizeWidth ?? 0)), 0);

/**
 * @description 获取末个非固定列（从尾部向前遍历跳过 fixed）。
 *              固定列宽度由用户拖拽或声明锁定，拖拽缩窄时由末个非固定列吸收盈余防止表格收缩。
 * @param cols 数据列列表
 * @returns 末个非固定列，不存在时返回 undefined
 */
const getFillColumn = (cols: EffectiveDataTableColumnT[]): EffectiveDataTableColumnT | undefined => {
  for (let i = cols.length - 1; i >= 0; i--) {
    if (!cols[i].fixed) {
      return cols[i];
    }
  }
  return undefined;
};

/**
 * @description 判断滚动容器是否已滚到最右侧（scrollLeft + clientWidth ≥ scrollWidth）。
 * @param tableEl 表格 DOM 元素
 * @returns 已滚到最右时为 true
 */
const isScrolledToRight = (tableEl: HTMLTableElement | undefined): boolean => {
  const scroller = tableEl?.parentElement;
  if (!scroller) {
    return false;
  }
  return scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
};

/**
 * @description 设 table.style.width = sum(resizeWidth)，使 table 宽度精确等于 sum(<col> widths)，
 *              table-layout:fixed 下浏览器无需等比缩放，每列各得其指定宽度。
 *              resizeWidth 是 auto 布局阶段测量的原始值，不能用 getBoundingClientRect()
 *              （该值可能已被浏览器缩放，用缩放值求和会触发二次缩放）。
 *              同时同步表头分割线宽度。
 * @param tableEl 表格 DOM 元素
 * @param dataColumns 数据列列表
 */
const applyTableWidth = (tableEl: HTMLTableElement | undefined, dataColumns: EffectiveDataTableColumnT[]) => {
  if (!tableEl) {
    return;
  }
  const totalWidth = dataColumns.reduce((sum, col) => sum + (col.resizeWidth ?? 0), 0);
  if (totalWidth > 0) {
    tableEl.style.width = `${totalWidth}px`;
    syncDividerWidth(tableEl, totalWidth);
  }
};

/**
 * @description 清理 userWidths / autoFillKeys 中已不存在的列 key，防止列删除后残留旧值
 * @param dataColumns 数据列列表
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param autoFillKeys 末列自动吸收盈余的 key 集合
 */
const cleanupRemovedKeys = (dataColumns: EffectiveDataTableColumnT[], userWidths: Map<string, number>, autoFillKeys: Set<string>) => {
  const currentKeys = new Set(dataColumns.map((c) => c.key));
  for (const key of userWidths.keys()) {
    if (!currentKeys.has(key)) {
      userWidths.delete(key);
    }
  }
  for (const key of autoFillKeys) {
    if (!currentKeys.has(key)) {
      autoFillKeys.delete(key);
    }
  }
};

/**
 * @description 拖拽期间末列吸收盈余或恢复基础宽度。
 *              列宽总和 < 最小表格宽度时末列吸收盈余防止表格缩窄；
 *              否则末列恢复基础宽度，表格按实际总和伸展。
 * @param draggedCol 被拖拽的列
 * @param dataColumns 数据列列表
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param autoFillKeys 末列自动吸收盈余的 key 集合
 * @param tableEl 表格 DOM 元素
 * @param minTableWidth 拖拽期间表格最小宽度
 * @param fillColBaseWidth 末列拖拽前的基础宽度
 * @param lockTableWidthFn 锁定表格宽度函数
 */
const applyFillColumnResize = ({
  draggedCol,
  dataColumns,
  userWidths,
  autoFillKeys,
  tableEl,
  minTableWidth,
  fillColBaseWidth,
  lockTableWidth: lockTableWidthFn,
}: FillResizeInput) => {
  const fillCol = getFillColumn(dataColumns);
  if (!fillCol || draggedCol.key === fillCol.key || !fillCol.colRef) {
    lockTableWidthFn();
    return;
  }

  const sumExcludingFill = sumColumnWidthsExcluding(dataColumns, fillCol.key);

  if (sumExcludingFill + fillColBaseWidth >= minTableWidth) {
    // 固定模式：末列恢复基础宽度，表格按总和伸展
    if (fillCol.resizeWidth !== fillColBaseWidth) {
      fillCol.colRef.style.width = `${fillColBaseWidth}px`;
      fillCol.resizeWidth = fillColBaseWidth;
      userWidths.set(fillCol.key, fillColBaseWidth);
      autoFillKeys.add(fillCol.key);
    }
    lockTableWidthFn();
    return;
  }

  // 填充模式：末列 = 最小表格宽度 - 其余列总和，吸收盈余防止表格缩窄
  const fillWidth = clampToBounds(minTableWidth - sumExcludingFill, fillCol._minWidth, fillCol._maxWidth);
  fillCol.colRef.style.width = `${fillWidth}px`;
  fillCol.resizeWidth = fillWidth;
  userWidths.set(fillCol.key, fillWidth);
  autoFillKeys.add(fillCol.key);
  if (tableEl) {
    tableEl.style.width = `${Math.max(sumExcludingFill + fillWidth, minTableWidth)}px`;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 子 composable：单元格合并检测
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description 因 spanMethod 合并单元格而被移除的单元格信息列表（索引格式 `${rowIndex}_${colIndex}`）。
 *              供 TableRow 渲染时跳过被合并的单元格，并供固定列边界判断扫描。
 */
const useCellSpan = (
  data: Ref<any[]>,
  dataColumns: Ref<EffectiveDataTableColumnT[]>,
  spanMethod: Ref<DataTableSpanMethod>,
): {
  removedBodyCellsBySpan: ComputedRef<RemovedBodyCellInfo[]>;
  isBodyCellRemoved: (rowIndex: number, colIndex: number) => boolean;
} => {
  const removedBodyCellsBySpan = computed(() => {
    const toRemove: RemovedBodyCellInfo[] = [];
    const removedSet = new Set<string>();

    data.value.forEach((row, rowIndex) => {
      dataColumns.value.forEach((column, colIndex) => {
        const cellIndex = `${rowIndex}_${colIndex}`;
        // 已被合并的单元格不会再次被合并
        if (removedSet.has(cellIndex)) {
          return;
        }

        const res = spanMethod.value({
          row,
          column,
          cellValue: getCellValue({ row, column }),
          rowIndex,
          colIndex,
        });
        const newCells = collectSpanRemovedCells({ rowIndex, colIndex, columnKey: column.key, spanResult: res });
        for (const cell of newCells) {
          toRemove.push(cell);
          removedSet.add(cell.index);
        }
      });
    });
    return toRemove;
  });

  const isBodyCellRemoved = (rowIndex: number, colIndex: number): boolean => removedBodyCellsBySpan.value.some((v) => v.index === `${rowIndex}_${colIndex}`);

  return { removedBodyCellsBySpan, isBodyCellRemoved };
};

// ─────────────────────────────────────────────────────────────────────────────
// 子 composable：固定列边界检测
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description 固定列边界判断：检测当前单元格是否为某侧最后一个/第一个可见的固定列。
 *              扫描时跳过被 colspan 隐藏的单元格（视为不可见的列继续延伸），
 *              但被 rowspan 隐藏的单元格仍视为可见（来自上方行 rowspan）。
 */
const useFixedColumn = (
  dataColumns: Ref<EffectiveDataTableColumnT[]>,
  removedBodyCellsBySpan: ComputedRef<RemovedBodyCellInfo[]>,
): {
  isLastLeftFixedCell: (rowIndex: number, colIndex: number) => boolean;
  isFirstRightFixedCell: (rowIndex: number, colIndex: number) => boolean;
  hasLeftFixedColumn: ComputedRef<boolean>;
  hasRightFixedColumn: ComputedRef<boolean>;
} => {
  const isLastLeftFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    if (column.fixed !== 'left') {
      return false;
    }
    // 向右扫描所有后续的左固定列，直到遇到非左固定列
    let nextIndex = colIndex + 1;
    while (nextIndex < dataColumns.value.length && dataColumns.value[nextIndex].fixed === 'left') {
      if (!isCellHiddenByColspan(rowIndex, nextIndex, removedBodyCellsBySpan.value)) {
        return false;
      }
      nextIndex++;
    }
    return true;
  };

  const isFirstRightFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    if (column.fixed !== 'right') {
      return false;
    }
    // 向左扫描所有前面的右固定列，直到遇到非右固定列
    let prevIndex = colIndex - 1;
    while (prevIndex >= 0 && dataColumns.value[prevIndex].fixed === 'right') {
      if (!isCellHiddenByColspan(rowIndex, prevIndex, removedBodyCellsBySpan.value)) {
        return false;
      }
      prevIndex--;
    }
    return true;
  };

  const hasLeftFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'left'));
  const hasRightFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'right'));

  return { isLastLeftFixedCell, isFirstRightFixedCell, hasLeftFixedColumn, hasRightFixedColumn };
};

// ─────────────────────────────────────────────────────────────────────────────
// 共享上下文类型：列宽锁定与拖拽共用的可变状态
// ─────────────────────────────────────────────────────────────────────────────

type ColumnSharedCtx = {
  tableEl: Ref<HTMLTableElement | undefined>;
  containerWidth: Ref<number>;
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  userWidths: Map<string, number>;
  autoFillKeys: Set<string>;
  size: Ref<string>;
  resizingColumnKey: Ref<string>;
  fixVersion: { value: number };
  onColumnsFixed?: () => void;
};

// ─────────────────────────────────────────────────────────────────────────────
// 子 composable：列宽锁定 / 布局
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description 渲染后锁定列宽的三阶段异步流程（无读回反馈环）。
 *              阶段 1 切 auto 布局 → 阶段 2 等一帧 → 阶段 3 设置 resizeWidth 并切回 fixed 布局。
 */
const useColumnFixing = (
  ctx: ColumnSharedCtx,
  extra: {
    /** 表头分组列 */
    groupColumns: Ref<EffectiveDataTableColumnT[][]>;
    /** 组件挂载状态 */
    isMounted: Ref<boolean>;
  },
  options: ToRefs<DataTablePropsT> & { tableEl: Ref<HTMLTableElement | undefined>; containerWidth: Ref<number>; onColumnsFixed?: () => void },
): {
  lockTableWidth: () => void;
  fixColumnAfterMounted: () => void;
  parseColumns: () => void;
} => {
  const { tableEl, containerWidth, dataColumns, dataColumnMap, userWidths, autoFillKeys, size, resizingColumnKey, fixVersion, onColumnsFixed } = ctx;

  /** 锁定表格宽度为列宽总和 */
  const lockTableWidthFn = () => applyTableWidth(tableEl.value, dataColumns.value);

  /** 阶段 2→3：等待 auto 布局完成后逐列设置 resizeWidth */
  const applyResolvedWidths = async (version: number) => {
    if (version !== fixVersion.value) {
      return;
    }
    prepareAutoLayoutPhase({ tableEl: tableEl.value, dataColumns: dataColumns.value, userWidths, autoFillKeys });
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    if (version !== fixVersion.value) {
      return;
    }
    return Promise.all(
      dataColumns.value.map((column) => resolveColumnResizeWidth(column, { userWidths, containerWidth: containerWidth.value, size: size.value })),
    );
  };

  /** 阶段 3 续：切回 fixed 布局 */
  const finalizeFixedLayout = (version: number) => {
    if (version !== fixVersion.value) {
      return;
    }
    tableEl.value!.style.tableLayout = 'fixed';
    if (userWidths.size > 0) {
      lockTableWidthFn();
    }
    onColumnsFixed?.();
  };

  /**
   * @description 渲染后锁定列宽的三阶段异步流程（无读回反馈环）。
   *   resizeWidth 优先级：userWidths > 声明 width > thRef DOM 测量
   *   声明 width / userWidth 列由 getColStyle（:style 绑定）锁定，阶段 3 无需命令式设置。
   */
  const fixColumnAfterMounted = () => {
    if (!isClient || resizingColumnKey.value || isAllColumnsUnfixed(dataColumns.value)) {
      return;
    }
    const version = ++fixVersion.value;
    until(() =>
      isColumnsReady({ columns: dataColumns.value, dataLength: options.data.value.length, tableEl: tableEl.value, containerWidth: containerWidth.value }),
    )
      .toBeTruthy()
      .then(() => applyResolvedWidths(version))
      .then(() => finalizeFixedLayout(version));
  };

  const parseColumns = () => {
    const res = getGroupColumns({
      isMounted: extra.isMounted.value,
      ...options,
      columnMap: dataColumnMap,
      defaultFormatter: (cellOptions) => {
        if (isEmptyCell(cellOptions.cellValue)) {
          return options.defaultEmptyCellText.value;
        }
        return (cellOptions.cellValue as any).toString();
      },
    });
    dataColumns.value = res.dataColumns;
    extra.groupColumns.value = res.groupColumns;
    cleanupRemovedKeys(dataColumns.value, userWidths, autoFillKeys);
    fixColumnAfterMounted();
  };

  watch(
    () => [options.columns.value, extra.isMounted.value, options.data.value],
    () => parseColumns(),
    { immediate: true, deep: true },
  );
  watch(containerWidth, () => fixColumnAfterMounted());

  return { lockTableWidth: lockTableWidthFn, fixColumnAfterMounted, parseColumns };
};

// ─────────────────────────────────────────────────────────────────────────────
// 子 composable：拖拽调整列宽
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description 拖拽调整列宽的完整交互流程：mousedown 记录快照 → mousemove 计算 → mouseup 清理。
 *              拖拽使列宽总和小于最小表格宽度时，由末个非固定列吸收盈余防止表格缩窄。
 */
const useColumnResize = (
  ctx: ColumnSharedCtx,
  deps: {
    lockTableWidth: () => void;
    hasLeftFixedColumn: ComputedRef<boolean>;
    hasRightFixedColumn: ComputedRef<boolean>;
  },
): {
  handleColumnResizerMousedown: (options: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => void;
} => {
  const { tableEl, containerWidth, dataColumns, dataColumnMap, userWidths, autoFillKeys, size, resizingColumnKey, fixVersion } = ctx;

  /** 拖拽开始时的鼠标X坐标，用于计算拖拽偏移量 */
  let resizeStartX = 0;
  /** 拖拽开始时的列宽，与偏移量相加得到新宽度 */
  let resizeStartWidth = 0;
  /** 拖拽开始时末个非固定列的基础宽度，作为盈余吸收/恢复的基准 */
  let fillColBaseWidth = 0;
  /** 拖拽期间表格的最小宽度 */
  let minTableWidth = 0;

  /**
   * @description 拖拽过程中持续触发，基于鼠标偏移量计算新列宽。
   *              使用 deltaX（相对位移）而非绝对坐标，避免表格 reflow 导致列位置偏移引起的宽度抖动。
   * @param event 鼠标移动事件
   */
  const handleColumnResizerMouseMoving = (event: MouseEvent) => {
    const column = dataColumnMap.get(resizingColumnKey.value);
    if (!column?.colRef) {
      return;
    }
    const deltaX = event.clientX - resizeStartX;
    const width = clampToBounds(Math.floor(resizeStartWidth + deltaX), column._minWidth, column._maxWidth);
    column.colRef.style.width = `${width}px`;
    column.resizeWidth = width;
    userWidths.set(column.key, width);
    applyFillColumnResize({
      draggedCol: column,
      dataColumns: dataColumns.value,
      userWidths,
      autoFillKeys,
      tableEl: tableEl.value,
      minTableWidth,
      fillColBaseWidth,
      lockTableWidth: deps.lockTableWidth,
    });
  };

  /**
   * @description 拖拽结束，清除状态并通知外部更新溢出检测。
   *              不强制恢复滚动位置——保持拖拽中用户视角，避免松手时因 scrollWidth 变化导致跳动跳到最右。
   */
  const handleColumnResizerMouseup = () => {
    resizingColumnKey.value = '';
    window.removeEventListener('mousemove', handleColumnResizerMouseMoving);
    window.removeEventListener('mouseup', handleColumnResizerMouseup);
    window.removeEventListener('contextmenu', handleColumnResizerMouseup);
    ctx.onColumnsFixed?.();
  };

  /**
   * @description 拖拽开始，记录快照并绑定事件。
   *              若 fixColumnAfterMounted 尚未完成（table-layout 非 fixed），同步测量列宽
   *              并切换到 fixed 布局——否则 auto 模式下浏览器按内容重分配会导致其他列宽突变。
   */
  const handleColumnResizerMousedown = ({ event, column }: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => {
    event.preventDefault();
    event.stopPropagation();

    // 同步迷你 fix：确保拖拽前已处于 fixed 布局
    if (tableEl.value && tableEl.value.style.tableLayout !== 'fixed') {
      for (const col of dataColumns.value) {
        syncColumnWidthForResize(col, { userWidths, containerWidth: containerWidth.value, size: size.value });
      }
      tableEl.value.style.tableLayout = 'fixed';
      // 作废正在等待的 fixColumnAfterMounted 异步链，防止其阶段 1 清除布局导致拖拽中途切回 auto
      fixVersion.value++;
    }

    resizingColumnKey.value = column.key;
    deps.lockTableWidth();
    // 记录末列基础宽度，作为拖拽期间盈余吸收/恢复的基准
    fillColBaseWidth = getFillColumn(dataColumns.value)?.resizeWidth ?? 0;
    // 固定列表格滚到最右时，最小宽度取 scrollWidth：拖拽缩窄由末列吸收盈余，保持表格不缩窄、滚动视角不变
    const wasAtRight = isScrolledToRight(tableEl.value);
    const hasFixedCols = deps.hasLeftFixedColumn.value || deps.hasRightFixedColumn.value;
    if (hasFixedCols && wasAtRight) {
      const scroller = tableEl.value?.parentElement;
      minTableWidth = scroller ? scroller.scrollWidth : containerWidth.value;
    } else {
      minTableWidth = containerWidth.value;
    }
    resizeStartX = event.clientX;
    // 注意：此处读 thRef.getBoundingClientRect 取被拖列实际渲染宽度作为拖拽基线；
    // 与 applyTableWidth 注释"求和不用 rect"不冲突——此处非求和，且 fixed 布局下 rect 即锁定宽度。
    resizeStartWidth = column.thRef?.getBoundingClientRect().width ?? 0;

    window.addEventListener('mousemove', handleColumnResizerMouseMoving);
    window.addEventListener('mouseup', handleColumnResizerMouseup);
    // 右键菜单也视为拖拽结束，防止状态残留
    window.addEventListener('contextmenu', handleColumnResizerMouseup);
  };

  return { handleColumnResizerMousedown };
};

// ─────────────────────────────────────────────────────────────────────────────
// 主 composable：装配器
// ─────────────────────────────────────────────────────────────────────────────

export const useDataColumn = (
  options: ToRefs<DataTablePropsT> & { tableEl: Ref<HTMLTableElement | undefined>; containerWidth: Ref<number>; onColumnsFixed?: () => void },
): {
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  groupColumns: Ref<EffectiveDataTableColumnT[][]>;
  userWidths: Map<string, number>;
  removedBodyCellsBySpan: ComputedRef<RemovedBodyCellInfo[]>;
  isBodyCellRemoved: (rowIndex: number, colIndex: number) => boolean;
  isLastLeftFixedCell: (rowIndex: number, colIndex: number) => boolean;
  isFirstRightFixedCell: (rowIndex: number, colIndex: number) => boolean;
  hasLeftFixedColumn: ComputedRef<boolean>;
  hasRightFixedColumn: ComputedRef<boolean>;
  handleColumnResizerMousedown: (options: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => void;
  resizingColumnKey: Ref<string, string>;
} => {
  const { tableEl, containerWidth, data, size, spanMethod, onColumnsFixed } = options;

  const isMounted = useMounted();
  const dataColumnMap = new Map<string, EffectiveDataTableColumnT>();
  const dataColumns = ref<EffectiveDataTableColumnT[]>([]);
  const groupColumns = ref<EffectiveDataTableColumnT[][]>([]);
  /** 用户拖拽设定的列宽，与自动分配状态物理隔离，防止 fixColumnAfterMounted 重算时覆盖 */
  const userWidths = reactive(new Map<string, number>());
  /**
   * 末列自动吸收盈余时写入 userWidths 的 key 集合。
   * 拖拽期间末列需写入 userWidths 以锁定 col 样式（防止布局抖动），
   * 但这些值非用户主动设定，fixColumnAfterMounted 重算时清除使其重新参与自动分配。
   */
  const autoFillKeys = new Set<string>();
  /** 版本号守卫：fixColumnAfterMounted 每次调用递增，旧 Promise 链检测到版本不匹配则中止 */
  const fixVersion = { value: 0 };
  /** 正在调整宽度的列key，用于显示拖拽指示器 */
  const resizingColumnKey = ref('');

  // 子 composable：单元格合并检测
  const { removedBodyCellsBySpan, isBodyCellRemoved } = useCellSpan(data, dataColumns, spanMethod);

  // 子 composable：固定列边界检测
  const { isLastLeftFixedCell, isFirstRightFixedCell, hasLeftFixedColumn, hasRightFixedColumn } = useFixedColumn(dataColumns, removedBodyCellsBySpan);

  // 共享上下文：列宽锁定与拖拽共用的可变状态
  const sharedCtx: ColumnSharedCtx = {
    tableEl,
    containerWidth,
    dataColumns,
    dataColumnMap,
    userWidths,
    autoFillKeys,
    size,
    resizingColumnKey,
    fixVersion,
    onColumnsFixed,
  };

  // 子 composable：列宽锁定 / 布局
  const { lockTableWidth } = useColumnFixing(sharedCtx, { groupColumns, isMounted }, options);

  // 子 composable：拖拽调整列宽
  const { handleColumnResizerMousedown } = useColumnResize(sharedCtx, {
    lockTableWidth,
    hasLeftFixedColumn,
    hasRightFixedColumn,
  });

  return {
    dataColumnMap,
    dataColumns,
    groupColumns,
    userWidths,
    removedBodyCellsBySpan,
    isBodyCellRemoved,
    isLastLeftFixedCell,
    isFirstRightFixedCell,
    hasLeftFixedColumn,
    hasRightFixedColumn,
    handleColumnResizerMousedown,
    resizingColumnKey,
  };
};
