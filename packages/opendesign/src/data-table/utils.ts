import { ComputedRef, ToRefs } from 'vue';
import { isArray, isNil, isNumber, isIosDevice } from '../_utils/is.ts';
import { TableRowT } from '../table';
import { DataTableColumnFormatter, DataTableColumnT, DataTableExpandMethod, DataTablePropsT, EffectiveDataTableColumnT } from './types.ts';
import { getValueByPath } from '../_utils/helper.ts';

export const getCellValue = ({ row, column }: { row: TableRowT; column: EffectiveDataTableColumnT }) => {
  return getValueByPath(row, column.key);
};

export const isEmptyCell = (cellValue: string | number | unknown) => {
  return isNil(cellValue) || cellValue.toString() === '';
};

/**
 * 计算表头行数
 */
export const getTotalHeaderRows = (columns: DataTableColumnT[]): number => {
  // 边界条件：非数组或空数组直接返回 0
  if (!isArray(columns) || columns.length === 0) {
    return 0;
  }

  // 使用 reduce 遍历列，计算所有子节点的最大深度
  const maxChildDepth = columns.reduce((maxDepth, item) => {
    // 如果当前列有子节点，递归计算子节点的深度
    const childDepth = item.children ? getTotalHeaderRows(item.children) : 0;
    // 保留遍历过程中的最大深度
    return Math.max(maxDepth, childDepth);
  }, 0);

  // 最终总行数 = 基础行（1行） + 子节点的最大深度
  return 1 + maxChildDepth;
};

/**
 * 计算表格列数
 */
export const getColumnCount = (columns: DataTableColumnT[]) => {
  let count = 0;
  const traverseColumns = (_columns: DataTableColumnT[]) => {
    if (!isArray(_columns) || !_columns.length) {
      return;
    }
    _columns.forEach((column) => {
      if (!column.children) {
        count += 1;
      } else {
        traverseColumns(column.children);
      }
    });
  };
  traverseColumns(columns);

  return count;
};

const setParentFixed = (column: EffectiveDataTableColumnT, fixed: 'left' | 'right') => {
  let { parent } = column;
  while (parent) {
    if (parent.fixed === fixed) {
      if (fixed === 'left') {
        parent.isLastLeftFixedCol = true;
      } else {
        parent.isFirstRightFixedCol = true;
      }
    }
    parent = parent.parent;
  }
};

/**
 * 去除ios多列fixed配置，由于兼容性原因，只支持一列(左和右)的固定
 */
const clearIosMultiFixed = (dataColumns: EffectiveDataTableColumnT[], isMounted: boolean) => {
  if (isMounted && isIosDevice) {
    dataColumns.forEach((column, i) => {
      if (i === 0) {
        return;
      }
      if (i === dataColumns.length - 1 && column.fixed === 'right') {
        return;
      }

      column.fixed = undefined;
    });
  }
};

/**
 * 标记由于表头自定义合并单元格而被合并的表头单元格
 * 只支持相邻同级合并
 */
const markHeaderHidden = (groupColumns: EffectiveDataTableColumnT[][]) => {
  groupColumns.forEach((groupColumn) => {
    for (let colIndex = 0; colIndex < groupColumn.length; colIndex++) {
      const column = groupColumn[colIndex];
      if (isNil(column.customColSpan) || column.customColSpan < 2) {
        continue;
      }

      for (let j = colIndex + 1; j < colIndex + column.customColSpan; j++) {
        groupColumn[j].headerHidden = true;
      }
    }
  });
};

/**
 * 标记两端的最内侧的固定列
 */
const markEdgeFixedColumns = (dataColumns: EffectiveDataTableColumnT[], groupColumns: EffectiveDataTableColumnT[][]) => {
  groupColumns.forEach((group) => {
    let lastLeftFixedI: number | undefined;
    let firstRightFixedI: number | undefined;
    for (let i = 0; i < group.length; i++) {
      const column = group[i];
      if (column.fixed === 'left' && !column.headerHidden) {
        lastLeftFixedI = i;
        continue;
      }
      const columnIndexInDataColumns = dataColumns.findIndex((v) => v.key === column.key);
      const prevColumn = dataColumns[columnIndexInDataColumns - 1];
      if (
        isNil(firstRightFixedI) &&
        column.fixed === 'right' &&
        // 且前一列不是右固定列
        (!prevColumn || prevColumn.fixed !== 'right')
      ) {
        firstRightFixedI = i;
      }
    }
    if (!isNil(lastLeftFixedI)) {
      group[lastLeftFixedI].isLastLeftFixedCol = true;
      setParentFixed(group[lastLeftFixedI], 'left');
    }
    if (!isNil(firstRightFixedI)) {
      group[firstRightFixedI].isFirstRightFixedCol = true;
      setParentFixed(group[firstRightFixedI], 'right');
    }
  });
};

/**
 * 标记最左和最右的列
 */
const markEdgeColumns = (groupColumns: EffectiveDataTableColumnT[][]) => {
  let firstColumn: EffectiveDataTableColumnT | undefined = groupColumns[0]?.[0];
  while (firstColumn) {
    firstColumn.isFirstCol = true;
    firstColumn = firstColumn.children?.[0];
  }
  let lastColumn: EffectiveDataTableColumnT | undefined = groupColumns[0]?.[groupColumns[0].length - 1];
  while (lastColumn) {
    lastColumn.isLastCol = true;
    lastColumn = lastColumn.children?.[lastColumn.children?.length - 1];
  }
};

export const getGroupColumns = (
  options: ToRefs<DataTablePropsT> & {
    isMounted: boolean;
    columnMap: Map<string, EffectiveDataTableColumnT>;
    defaultFormatter: DataTableColumnFormatter;
  },
) => {
  const { isMounted, columns, columnMap, defaultFormatter } = options;
  const totalHeaderRows = getTotalHeaderRows(columns.value);

  columnMap.clear();
  const dataColumns: EffectiveDataTableColumnT[] = [];
  const groupColumns: EffectiveDataTableColumnT[][] = new Array(totalHeaderRows).fill(0).map(() => []);

  const traverseColumns = (traverseOptions: { columns: DataTableColumnT[]; level?: number; parent?: EffectiveDataTableColumnT }) => {
    const { level = 0, parent } = traverseOptions;
    traverseOptions.columns.forEach((column) => {
      const cell: EffectiveDataTableColumnT = {
        ...(column as EffectiveDataTableColumnT),
        fixed: column.fixed === true ? 'left' : column.fixed || traverseOptions.parent?.fixed,
        formatter: column.formatter || defaultFormatter,
        parent: traverseOptions.parent,
      };
      if (isArray(cell.children) && cell.children.length) {
        const childrenColCount = getColumnCount(cell.children);
        cell.colSpan = childrenColCount > 1 ? childrenColCount : undefined;
        groupColumns[level].push(cell);
        traverseColumns({
          columns: cell.children,
          level: level + 1,
          parent: cell,
        });
      } else {
        const rowSpan = totalHeaderRows - level;
        cell.rowSpan = rowSpan > 1 ? rowSpan : undefined;
        cell.fixed = cell.fixed ?? parent?.fixed;

        columnMap.set(cell.key, cell);
        dataColumns.push(cell);
        groupColumns[level].push(cell);
      }
    });
  };

  traverseColumns({ columns: columns.value });

  clearIosMultiFixed(dataColumns, isMounted);

  markHeaderHidden(groupColumns);

  markEdgeFixedColumns(dataColumns, groupColumns);

  markEdgeColumns(groupColumns);

  return { dataColumns, groupColumns };
};

/**
 * 获取嵌套列配置下的第一个渲染列
 */
const getFirstChildColumn = (column: EffectiveDataTableColumnT): EffectiveDataTableColumnT => {
  return column.children?.length ? getFirstChildColumn(column.children[0]) : column;
};

/**
 * 获取嵌套列配置下的最后一个渲染列
 */
const getLastChildColumn = (column: EffectiveDataTableColumnT): EffectiveDataTableColumnT => {
  return column.children?.length ? getLastChildColumn(column.children[column.children.length - 1]) : column;
};

/**
 * 计算左固定列的偏移量
 */
const getLeftFixedCount = (column: EffectiveDataTableColumnT, dataColumns: EffectiveDataTableColumnT[]): number => {
  const firstCol = getFirstChildColumn(column);
  let count = 0;
  for (let i = 0; i < dataColumns.length; i++) {
    const v = dataColumns[i];
    if (v.key === firstCol.key) {
      break;
    }
    count += v.resizeWidth ?? 0;
  }
  return count;
};

/**
 * 计算右固定列的偏移量
 */
const getRightFixedCount = (column: EffectiveDataTableColumnT, dataColumns: EffectiveDataTableColumnT[]): number => {
  const lastCol = getLastChildColumn(column);
  let count = 0;
  for (let i = dataColumns.length - 1; i > 0; i--) {
    const v = dataColumns[i];
    if (lastCol.key === v.key) {
      break;
    }
    if (v.fixed === 'right') {
      count += v.resizeWidth ?? 0;
    }
  }
  return count;
};

/**
 * 减除被合并的右侧固定列的宽度
 */
const adjustCountForMergedColumns = (options: {
  count: number;
  column: EffectiveDataTableColumnT;
  dataColumns: EffectiveDataTableColumnT[];
  isHeader: boolean;
  colSpan?: number;
}): number => {
  const { column, dataColumns, isHeader, colSpan } = options;
  let count = options.count;
  if (isHeader && column.customColSpan && column.customColSpan > 1) {
    let columnIndex = dataColumns.findIndex((v) => v.key === column.key) + 1;
    while (dataColumns[columnIndex] && dataColumns[columnIndex].headerHidden) {
      count -= dataColumns[columnIndex].resizeWidth ?? 0;
      columnIndex++;
    }
  }
  if (!isHeader && colSpan && colSpan > 1) {
    const columnIndex = dataColumns.findIndex((v) => v.key === column.key);
    for (let i = 1; i < colSpan; i++) {
      const mergedCol = dataColumns[columnIndex + i];
      if (mergedCol && mergedCol.fixed === 'right') {
        count -= mergedCol.resizeWidth ?? 0;
      }
    }
  }
  return count;
};

/**
 * 计算固定列的左右定位样式
 */
export const getColumnPosition = (options: {
  column: EffectiveDataTableColumnT;
  dataColumns: EffectiveDataTableColumnT[];
  groupColumns: EffectiveDataTableColumnT[][];
  border?: string;
  isHeader?: boolean;
  colSpan?: number;
}): { left?: string; right?: string } => {
  const { column, dataColumns, isHeader = false, colSpan } = options;
  if (!column.fixed) {
    return {};
  }
  if (column.fixed === 'left') {
    return { left: `${getLeftFixedCount(column, dataColumns)}px` };
  }
  const count = adjustCountForMergedColumns({
    count: getRightFixedCount(column, dataColumns),
    column,
    dataColumns,
    isHeader,
    colSpan,
  });
  return { right: `${count}px` };
};

/**
 * 判断当前层级是否有任何的可展开项，用于缩进对齐
 */
export const getIsLevelExpandable = ({
  list,
  hasExpandSlot,
  expandMethod,
}: {
  list?: TableRowT[];
  hasExpandSlot: ComputedRef<boolean>;
  expandMethod?: DataTableExpandMethod;
}) => {
  if (!isArray(list) || !list.length) {
    return { expandable: false, expandableRowIndexes: [] };
  }
  if (hasExpandSlot.value) {
    return { expandable: true, expandableRowIndexes: list.map((_, i) => i) || [] };
  }

  if (!isNil(expandMethod)) {
    let _expandable = false;
    const _expandableRowIndexes: number[] = [];
    list.forEach((_child, _childIndex) => {
      if (expandMethod(_child, _childIndex)) {
        _expandable = true;
        _expandableRowIndexes.push(_childIndex);
      }
    });
    return { expandable: _expandable, expandableRowIndexes: _expandableRowIndexes };
  }

  let expandable = false;
  const expandableRowIndexes: number[] = [];
  list.forEach((child, childIndex) => {
    if ((isArray(child.children) && !!child.children.length) || child.hasChildren) {
      expandable = true;
      expandableRowIndexes.push(childIndex);
    }
  });
  return { expandable, expandableRowIndexes };
};

/**
 * @description 将声明的列宽（数字 / 百分比字符串 / 数值字符串）转换为像素值
 * @param width 声明的列宽
 * @param containerWidth 容器宽度（用于百分比换算）
 * @returns 像素值；传入 nil 或无法解析时返回 undefined
 */
export const getStaticWidth = (width: string | number | undefined, containerWidth: number): number | undefined => {
  if (isNil(width)) {
    return undefined;
  }
  if (isNumber(width)) {
    return width;
  }
  let px: number;
  if (width.endsWith('%')) {
    px = (Number.parseFloat(width) * containerWidth) / 100;
  } else {
    px = Number.parseFloat(width);
  }
  return Number.isNaN(px) ? undefined : px;
};

/**
 * @description 将列宽钳制到 [_minWidth, _maxWidth] 区间
 * @param column 列配置（读取 _minWidth / _maxWidth）
 * @param width 待钳制的原始宽度
 * @returns 钳制后的宽度；_minWidth / _maxWidth 为 nil 时跳过对应方向
 */
export const clampColumnWidth = (column: EffectiveDataTableColumnT, width: number): number => {
  let w = width;
  if (!isNil(column._minWidth)) {
    w = Math.max(w, column._minWidth!);
  }
  if (!isNil(column._maxWidth)) {
    w = Math.min(w, column._maxWidth!);
  }
  return w;
};

/**
 * @description 按优先级解析列宽（不涉及 DOM 测量）：
 *              userWidths > 声明 width > undefined（需 DOM 测量）
 *              userWidths 不钳制（拖拽处理器已钳制，填充逻辑需保留原始值防止 :style 覆盖命令式宽度导致跳动）；
 *              声明 width 钳制到 [_minWidth, _maxWidth]（修复 P1：resizeWidth 与 getColStyle 口径一致）。
 * @param column 列配置
 * @param userWidths 用户拖拽设定的列宽 Map
 * @param containerWidth 容器宽度（用于百分比换算）
 * @returns 解析后的像素宽度；需 DOM 测量时返回 undefined
 */
export const resolveColumnWidth = (column: EffectiveDataTableColumnT, userWidths: Map<string, number>, containerWidth: number): number | undefined => {
  const userWidth = userWidths.get(column.key);
  if (!isNil(userWidth)) {
    return userWidth;
  }
  if (!isNil(column.width)) {
    const px = getStaticWidth(column.width, containerWidth);
    if (!isNil(px)) {
      return clampColumnWidth(column, px);
    }
  }
  return undefined;
};
