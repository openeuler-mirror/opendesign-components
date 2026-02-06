import { ref, watch, computed, MaybeRef, toValue, ToRefs } from 'vue';
import { useMounted, until } from '@vueuse/core';

import { isNumeric } from '../_utils/is';
import { DataTablePropsT, EffectiveDataTableColumnT } from './types';
import { getGroupColumns, isEmptyCell, getCellValue } from './utils';

export const useDataColumn = (options: ToRefs<DataTablePropsT> & { tableEl: MaybeRef<HTMLTableElement | undefined> }) => {
  const { tableEl, defaultEmptyCellText, columns, data, spanMethod } = options;

  const isMounted = useMounted();
  const dataColumnMap = new Map<string, EffectiveDataTableColumnT>();
  const dataColumns = ref<EffectiveDataTableColumnT[]>([]);
  const groupColumns = ref<EffectiveDataTableColumnT[][]>([]);

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

    if (dataColumns.value.some((column) => column.fixed || column.width)) {
      until(() => dataColumns.value.every((column) => !!column.colRef) && data.value.length && toValue(tableEl))
        .toBeTruthy()
        .then(() => {
          // 固定列宽以计算列定位
          dataColumns.value.forEach((column) => {
            let width = column.colRef?.style.width;
            if (!width) {
              width = isNumeric(column.width) ? column.width + 'px' : column.width;
            }
            if (!width) {
              width = Math.ceil(column.colRef!.getBoundingClientRect().width) + 'px';
            }
            column.colRef!.style.width = width;
            column.resizeWidth = Math.ceil(column.colRef!.getBoundingClientRect().width);
          });
          toValue(tableEl)!.style.tableLayout = 'fixed';
        });
    }
  };
  watch(
    () => [columns.value, isMounted.value, data.value],
    () => parseColumns(),
    { immediate: true, deep: true },
  );
  /**
   * 由于合并单元格，导致去掉的单元格的索引，格式为：${rowIndex}_${colIndex}
   */
  const removedCellsBySpan = computed<string[]>(() => {
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

  const isCellRemoved = (rowIndex: number, colIndex: number): boolean => {
    return removedCellsBySpan.value.includes(`${rowIndex}_${colIndex}`);
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
      !(nextColumn?.fixed === 'left' && isCellRemoved(rowIndex, colIndex + 1))
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
    return prevColumn?.fixed !== 'right' || isCellRemoved(rowIndex, colIndex - 1);
  };

  const resizingColumnKey = ref('');

  const handleColumnResizerMouseMoving = (event: MouseEvent) => {
    const thEl = dataColumnMap.get(resizingColumnKey.value)?.thRef;

    if (!thEl) {
      return;
    }
    const thRect = thEl.getBoundingClientRect();
    const width = Math.ceil(event.clientX - thRect.x);

    const column = dataColumnMap.get(resizingColumnKey.value);
    if (column?.colRef) {
      column.colRef.style.width = width + 'px';
    }
  };

  const handleColumnResizerMouseup = () => {
    resizingColumnKey.value = '';

    window.removeEventListener('mousemove', handleColumnResizerMouseMoving);
    window.removeEventListener('mouseup', handleColumnResizerMouseup);
    window.removeEventListener('contextmenu', handleColumnResizerMouseup);
  };

  const handleColumnResizerMousedown = ({ event, column, colIndex }: { event: MouseEvent; column: EffectiveDataTableColumnT; colIndex: number }) => {
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
    removedCellsBySpan,
    isCellRemoved,
    isLastLeftFixedCell,
    isFirstRightFixedCell,
    handleColumnResizerMousedown,
    resizingColumnKey,
  };
};
