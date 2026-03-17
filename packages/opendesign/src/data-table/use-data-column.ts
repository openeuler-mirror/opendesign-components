import { ref, watch, computed, ToRefs, Ref, ComputedRef } from 'vue';
import { useMounted, until } from '@vueuse/core';

import { isNil, isNumber, isClient } from '../_utils/is';
import { getElementRectByRAF } from '../_utils/dom';
import { DataTablePropsT, EffectiveDataTableColumnT } from './types';
import { getGroupColumns, isEmptyCell, getCellValue } from './utils';

type RemovedBodyCellInfo = {
  /** 当前单元格的索引 */
  index: string;
  /** 被如何合并的 */
  removedMethod: 'colspan' | 'rowspan';
  /** 由哪一列触发的合并 */
  removedBy: string;
};

const getStaticWidth = (width: string | number | undefined, containerWidth: number) => {
  if (isNil(width)) {
    return width;
  }
  if (isNumber(width)) {
    return width;
  }
  if (width.endsWith('%')) {
    return (Number.parseFloat(width) * containerWidth) / 100;
  }
  return Number.parseFloat(width);
};

export const useDataColumn = (
  options: ToRefs<DataTablePropsT> & { tableEl: Ref<HTMLTableElement | undefined>; containerWidth: Ref<number> },
): {
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  groupColumns: Ref<EffectiveDataTableColumnT[][]>;
  removedBodyCellsBySpan: ComputedRef<RemovedBodyCellInfo[]>;
  isBodyCellRemoved: (rowIndex: number, colIndex: number) => boolean;
  isLastLeftFixedCell: (rowIndex: number, colIndex: number) => boolean;
  isFirstRightFixedCell: (rowIndex: number, colIndex: number) => boolean;
  hasLeftFixedColumn: ComputedRef<boolean>;
  hasRightFixedColumn: ComputedRef<boolean>;
  handleColumnResizerMousedown: (options: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => void;
  resizingColumnKey: Ref<string, string>;
} => {
  const { tableEl, containerWidth, defaultEmptyCellText, columns, data, spanMethod } = options;

  const isMounted = useMounted();
  const dataColumnMap = new Map<string, EffectiveDataTableColumnT>();
  const dataColumns = ref<EffectiveDataTableColumnT[]>([]);
  const groupColumns = ref<EffectiveDataTableColumnT[][]>([]);

  // 渲染后固定列宽以计算列定位
  const fixColumnAfterMounted = () => {
    if (!isClient || dataColumns.value.every(({ fixed, width, minWidth, maxWidth }) => [fixed, width, minWidth, maxWidth].every((v) => isNil(v)))) {
      return;
    }
    until(() => dataColumns.value.every((column) => !!column.colRef) && data.value.length && tableEl.value && !!containerWidth.value)
      .toBeTruthy()
      .then(() => {
        return Promise.all(
          dataColumns.value.map(async (column) => {
            let width: string | number | undefined = column.colRef?.style.width;
            if (!width) {
              width = getStaticWidth(column.width, containerWidth.value);
            }
            if (!width) {
              width = await getElementRectByRAF(column.colRef!).then((rect) => rect.width);
            }
            if (column.minWidth) {
              column._minWidth = getStaticWidth(column.minWidth, containerWidth.value)!;
              width = Math.max(width as number, column._minWidth);
            }
            // col元素设置max-width无效，需要手动控制宽度
            if (column.maxWidth) {
              column._maxWidth = getStaticWidth(column.maxWidth, containerWidth.value)!;
              width = Math.min(width as number, column._maxWidth);
            }
            column.colRef!.style.width = `${width}px`;
            column.resizeWidth = await getElementRectByRAF(column.colRef!).then((rect) => rect.width);
          }),
        );
      })
      .then(() => {
        tableEl.value!.style.tableLayout = 'fixed';
        const totalWidth = dataColumns.value.reduce((_width, column) => _width + column.resizeWidth!, 0);
        if (totalWidth < containerWidth.value) {
          // 如果列宽不足以填满容器宽度，则将剩余宽度加到最后一列
          const lastCol = dataColumns.value[dataColumns.value.length - 1]!;
          lastCol.resizeWidth! += containerWidth.value - totalWidth;
          lastCol.colRef!.style.width = `${lastCol.resizeWidth}px`;
        }
      });
  };

  const parseColumns = () => {
    const res = getGroupColumns({
      isMounted: isMounted.value,
      ...options,
      columnMap: dataColumnMap,
      defaultFormatter: (_options) => {
        if (isEmptyCell(_options.cellValue)) {
          return defaultEmptyCellText.value;
        }
        return (_options.cellValue as any).toString();
      },
    });
    dataColumns.value = res.dataColumns;
    groupColumns.value = res.groupColumns;

    fixColumnAfterMounted();
  };
  watch(
    () => [columns.value, isMounted.value, data.value],
    () => parseColumns(),
    { immediate: true, deep: true },
  );
  watch(containerWidth, () => {
    fixColumnAfterMounted();
  });

  /**
   * 由于合并单元格，导致去掉的单元格的索引，格式为：${rowIndex}_${colIndex}
   */
  const removedBodyCellsBySpan = computed(() => {
    const toRemove: RemovedBodyCellInfo[] = [];
    data.value.forEach((row, rowIndex) => {
      dataColumns.value.forEach((column, colIndex) => {
        // 已被合并的单元格不会再次被合并
        if (toRemove.some((v) => v.index === `${rowIndex}_${colIndex}`)) {
          return;
        }

        const res = spanMethod.value({
          row,
          column,
          // @ts-ignore
          cellValue: getCellValue({ row, column }),
          rowIndex,
          colIndex,
        });
        // 如果有列合并，这逐列扫描
        if (res?.colSpan && res.colSpan > 1) {
          for (let i = 0; i < res.colSpan - 1; i++) {
            const targetColIndex = colIndex + i + 1;

            // 同时覆盖行，实际生效为矩形而不是L形
            if (res?.rowSpan && res.rowSpan > 1) {
              for (let j = 0; j < res.rowSpan - 1; j++) {
                toRemove.push({ index: `${rowIndex + j + 1}_${targetColIndex}`, removedMethod: 'rowspan', removedBy: column.key });
              }
            }
            toRemove.push({ index: `${rowIndex}_${targetColIndex}`, removedMethod: 'colspan', removedBy: column.key });
          }
        }
        // 覆盖只有行合并的情况
        if (res?.rowSpan && res.rowSpan > 1) {
          for (let i = 0; i < res.rowSpan - 1; i++) {
            toRemove.push({ index: `${rowIndex + i + 1}_${colIndex}`, removedMethod: 'rowspan', removedBy: column.key });
          }
        }
      });
    });
    return toRemove;
  });

  const isBodyCellRemoved = (rowIndex: number, colIndex: number): boolean => {
    return removedBodyCellsBySpan.value.some((v) => v.index === `${rowIndex}_${colIndex}`);
  };

  /** 计算是否是当前行最后一个左固定单元格 */
  const isLastLeftFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    if (column.fixed !== 'left') {
      return false;
    }

    // 向右扫描所有后续的左固定列，直到遇到非左固定列
    let nextIndex = colIndex + 1;
    while (nextIndex < dataColumns.value.length && dataColumns.value[nextIndex].fixed === 'left') {
      const nextCellRemoveInfo = removedBodyCellsBySpan.value.filter((v) => v.index === `${rowIndex}_${nextIndex}`);
      // 如果该列并没有被隐藏，说明存在可见的左固定列，当前列不是最后一个
      if (!nextCellRemoveInfo.length) {
        return false;
      }
      // 如果该单元格是被rowspan隐藏的，那固定列依然存在（来自上方行的rowspan），当前列不是最后一个
      if (nextCellRemoveInfo.some((v) => v.removedMethod === 'rowspan')) {
        return false;
      }
      // 该单元格是被colspan隐藏的，继续向右扫描
      nextIndex++;
    }
    return true;
  };

  /** 计算是否是当前行第一个右固定单元格 */
  const isFirstRightFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    if (column.fixed !== 'right') {
      return false;
    }

    // 向左扫描所有前面的右固定列，直到遇到非右固定列
    let prevIndex = colIndex - 1;
    while (prevIndex >= 0 && dataColumns.value[prevIndex].fixed === 'right') {
      const prevCellRemoveInfo = removedBodyCellsBySpan.value.filter((v) => v.index === `${rowIndex}_${prevIndex}`);
      // 如果该列并没有被隐藏，说明存在可见的右固定列，当前列不是第一个
      if (!prevCellRemoveInfo.length) {
        return false;
      }
      // 如果该单元格是被rowspan隐藏的，那固定列依然存在（来自上方行的rowspan），当前列不是第一个
      if (prevCellRemoveInfo.some((v) => v.removedMethod === 'rowspan')) {
        return false;
      }
      // 该单元格是被colspan隐藏的，继续向左扫描
      prevIndex--;
    }
    return true;
  };

  const hasLeftFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'left' || v.fixed === 'right'));
  const hasRightFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'right'));

  /** 正在调整宽度的列key，用于显示拖拽指示器 */
  const resizingColumnKey = ref('');
  /** 拖拽开始时的鼠标X坐标，用于计算拖拽偏移量 */
  let resizeStartX = 0;
  /** 拖拽开始时的列宽，与偏移量相加得到新宽度 */
  let resizeStartWidth = 0;

  /**
   * 拖拽过程中持续触发，基于鼠标偏移量计算新列宽
   * 使用 deltaX（相对位移）而非绝对坐标，避免表格 reflow 导致列位置偏移引起的宽度抖动
   */
  const handleColumnResizerMouseMoving = (event: MouseEvent) => {
    const column = dataColumnMap.get(resizingColumnKey.value);
    if (!column?.colRef) {
      return;
    }
    const deltaX = event.clientX - resizeStartX;
    let width = Math.floor(resizeStartWidth + deltaX);

    // 限制在 minWidth / maxWidth 范围内
    if (column._minWidth) {
      width = Math.max(width, column._minWidth);
    }
    if (column._maxWidth) {
      width = Math.min(width, column._maxWidth);
    }
    column.colRef.style.width = `${width}px`;
  };

  /** 拖拽结束，清除状态并移除事件监听 */
  const handleColumnResizerMouseup = () => {
    resizingColumnKey.value = '';

    window.removeEventListener('mousemove', handleColumnResizerMouseMoving);
    window.removeEventListener('mouseup', handleColumnResizerMouseup);
    window.removeEventListener('contextmenu', handleColumnResizerMouseup);
  };

  /** 拖拽开始，记录初始鼠标位置和列宽快照，并绑定拖拽事件 */
  const handleColumnResizerMousedown = ({ event, column }: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => {
    event.preventDefault();
    event.stopPropagation();

    resizingColumnKey.value = column.key;
    resizeStartX = event.clientX;
    // 使用 thRef（<th>元素）获取实际渲染宽度，colRef 是 <col> 元素，getBoundingClientRect() 不可靠
    resizeStartWidth = column.thRef?.getBoundingClientRect().width ?? 0;

    window.addEventListener('mousemove', handleColumnResizerMouseMoving);
    window.addEventListener('mouseup', handleColumnResizerMouseup);
    // 右键菜单也视为拖拽结束，防止状态残留
    window.addEventListener('contextmenu', handleColumnResizerMouseup);
  };

  return {
    dataColumnMap,
    dataColumns,
    groupColumns,
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
