import { isArray, isNil, isIosDevice } from '../_utils/is.ts';
import { TableRowT } from '../table';
import { DataTableColumnFormatter, DataTableColumnT, DataTablePropsT, EffectiveDataTableColumnT } from './types.ts';
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

export const getGroupColumns = (options: {
  isMounted: boolean;
  props: DataTablePropsT;
  columnMap: Map<string, EffectiveDataTableColumnT>;
  defaultFormatter: DataTableColumnFormatter;
}) => {
  const { isMounted, props, columnMap, defaultFormatter } = options;
  const { columns, data, spanMethod } = props;
  const totalHeaderRows = getTotalHeaderRows(columns);

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
      if (isArray(cell.children)) {
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

  traverseColumns({ columns });

  clearIosMultiFixed(dataColumns, isMounted);

  groupColumns.forEach((group) => {
    let lastLeftFixedI: number | undefined;
    let firstRightFixedI: number | undefined;
    for (let i = 0; i < group.length; i++) {
      if (group[i].fixed === 'left') {
        lastLeftFixedI = i;
      } else if (isNil(firstRightFixedI) && group[i].fixed === 'right') {
        firstRightFixedI = i;
      }
    }
    if (!isNil(lastLeftFixedI)) {
      group[lastLeftFixedI].isLastLeftFixedCol = true;
      setParentFixed(group[lastLeftFixedI], 'left');
    }
    if (!isNil(firstRightFixedI)) {
      if (group[firstRightFixedI - 1]) {
        group[firstRightFixedI - 1].isBeforeFirstRightFixedCol = true;
      }
      group[firstRightFixedI].isFirstRightFixedCol = true;
      setParentFixed(group[firstRightFixedI], 'right');
    }
  });

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
  return column.children?.length ? getFirstChildColumn(column.children[column.children.length - 1]) : column;
};

/**
 * 计算固定列的左右定位样式
 */
export const getColumnPosition = (options: { column: EffectiveDataTableColumnT; columns: EffectiveDataTableColumnT[] }): { left?: string; right?: string } => {
  const { column, columns } = options;
  if (!column.fixed) {
    return {};
  }
  let count = 0;
  if (column.fixed === 'left') {
    const firstCol = getFirstChildColumn(column);
    for (let i = 0; i < columns.length; i++) {
      const v = columns[i];
      if (v.key === firstCol.key) {
        break;
      }
      count += v.resizeWidth ?? 0;
    }
    return { left: `${count}px` };
  }

  const lastCol = getLastChildColumn(column);
  for (let i = columns.length - 1; i > 0; i--) {
    const v = columns[i];
    if (lastCol.key === v.key) {
      break;
    }

    if (v.fixed === 'right') {
      count += v.resizeWidth ?? 0;
    }
  }
  return { right: `${count}px` };
};
