import { ComputedRef, ToRefs } from 'vue';
import { isArray, isNil, isIosDevice } from '../_utils/is.ts';
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
      if (column.fixed === 'left') {
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
 * 计算固定列的左右定位样式
 */
export const getColumnPosition = (options: {
  column: EffectiveDataTableColumnT;
  dataColumns: EffectiveDataTableColumnT[];
  groupColumns: EffectiveDataTableColumnT[][];
  border?: string;
  isHeader?: boolean;
}): { left?: string; right?: string } => {
  const { column, dataColumns, groupColumns, isHeader = false } = options;
  if (!column.fixed) {
    return {};
  }
  let count = 0;
  if (column.fixed === 'left') {
    const firstCol = getFirstChildColumn(column);
    // 累加左侧列宽度
    for (let i = 0; i < dataColumns.length; i++) {
      const v = dataColumns[i];
      if (v.key === firstCol.key) {
        break;
      }
      count += v.resizeWidth ?? 0;
    }
    return {
      left: `${count}px`,
    };
  }

  const lastCol = getLastChildColumn(column);
  for (let i = dataColumns.length - 1; i > 0; i--) {
    // 累加右侧列宽度
    const v = dataColumns[i];
    if (lastCol.key === v.key) {
      break;
    }

    if (v.fixed === 'right') {
      count += v.resizeWidth ?? 0;
    }
  }
  if (isHeader && column.customColSpan && column.customColSpan > 1) {
    // 如果是表头单元格切有自定义合并单元格的情况，需要把被合并的右侧的列的宽度减除
    let columnIndex = dataColumns.findIndex((v) => v.key === column.key) + 1;
    while (dataColumns[columnIndex] && dataColumns[columnIndex].headerHidden) {
      count -= dataColumns[columnIndex].resizeWidth ?? 0;
      columnIndex++;
    }
  }
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
