import { ref, watch, computed, ToRefs, Ref, ComputedRef } from 'vue';
import { useMounted, until } from '@vueuse/core';

import { isNil, isNumber, isClient } from '../_utils/is';
import { getElementRectByRAF } from '../_utils/dom';
import { DataTablePropsT, EffectiveDataTableColumnT } from './types';
import { getGroupColumns, isEmptyCell, getCellValue } from './utils';

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
  removedBodyCellsBySpan: ComputedRef<string[]>;
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
  const removedBodyCellsBySpan = computed<string[]>(() => {
    const toRemove: string[] = [];
    data.value.forEach((row, rowIndex) => {
      dataColumns.value.forEach((column, colIndex) => {
        // 已被合并的单元格不会再次被合并
        if (toRemove.includes(`${rowIndex}_${colIndex}`)) {
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
                toRemove.push(`${rowIndex + j + 1}_${targetColIndex}`);
              }
            }
            toRemove.push(`${rowIndex}_${targetColIndex}`);
          }
        }
        // 覆盖只有行合并的情况
        if (res?.rowSpan && res.rowSpan > 1) {
          for (let i = 0; i < res.rowSpan - 1; i++) {
            toRemove.push(`${rowIndex + i + 1}_${colIndex}`);
          }
        }
      });
    });
    return toRemove;
  });

  const isBodyCellRemoved = (rowIndex: number, colIndex: number): boolean => {
    return removedBodyCellsBySpan.value.includes(`${rowIndex}_${colIndex}`);
  };

  /** 计算是否是当前行最后一个左固定单元格 */
  const isLastLeftFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    const nextColumn = dataColumns.value[colIndex + 1];
    if (column.fixed !== 'left') {
      return false;
    }

    return (
      // 如果右边不再有固定列
      nextColumn?.fixed !== 'left' ||
      // 或是不再有被合并了的固定列(上方单元格向下合并)
      !(nextColumn?.fixed === 'left' && isBodyCellRemoved(rowIndex, colIndex + 1))
    );
  };

  /** 计算是否是当前行第一个右固定单元格 */
  const isFirstRightFixedCell = (rowIndex: number, colIndex: number): boolean => {
    const column = dataColumns.value[colIndex];
    const prevColumn = dataColumns.value[colIndex - 1];
    if (column.fixed !== 'right') {
      return false;
    }
    // 如果左边不再有固定列，或已经被合并了
    return prevColumn?.fixed !== 'right' || isBodyCellRemoved(rowIndex, colIndex - 1);
  };

  const hasLeftFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'left' || v.fixed === 'right'));
  const hasRightFixedColumn = computed(() => dataColumns.value.some((v) => v.fixed === 'right'));

  const resizingColumnKey = ref('');

  const handleColumnResizerMouseMoving = (event: MouseEvent) => {
    const thEl = dataColumnMap.get(resizingColumnKey.value)?.thRef;

    if (!thEl) {
      return;
    }
    const thRect = thEl.getBoundingClientRect();
    let width = Math.floor(event.clientX - thRect.x);

    const column = dataColumnMap.get(resizingColumnKey.value);
    if (column?._minWidth) {
      width = Math.max(width, column._minWidth);
    }
    if (column?._maxWidth) {
      width = Math.min(width, column._maxWidth);
    }
    if (column?.colRef) {
      column.colRef.style.width = `${width}px`;
    }
  };

  const handleColumnResizerMouseup = () => {
    resizingColumnKey.value = '';

    window.removeEventListener('mousemove', handleColumnResizerMouseMoving);
    window.removeEventListener('mouseup', handleColumnResizerMouseup);
    window.removeEventListener('contextmenu', handleColumnResizerMouseup);
  };

  const handleColumnResizerMousedown = ({ event, column }: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => {
    event.preventDefault();
    event.stopPropagation();

    resizingColumnKey.value = column.key;

    window.addEventListener('mousemove', handleColumnResizerMouseMoving);
    window.addEventListener('mouseup', handleColumnResizerMouseup);
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
