import { StyleValue, ExtractPropTypes, PropType } from 'vue';

export interface TableColumnT {
  key: string;
  label?: string;
  style?: StyleValue;
}

export interface TableRowT {
  key?: string | number;
  [key: string]: any;
}

export interface TableCellT {
  value: any;
  key: string | number;
  colspan?: number;
  rowspan?: number;
  last?: boolean;
}

export type ColumnKeysT = Array<string>;

export type CellSpanT = (rowIndex: number, columnIndex: number) => { rowspan?: number; colspan?: number } | undefined;

export const TableBorderTypes = ['all', 'row', 'column', 'frame', 'row-column', 'row-frame', 'column-frame', 'none'] as const;
export type TableBorderT = typeof TableBorderTypes[number];

export const tableProps = {
  /**
   * 表头内容 TableColumnT[] | string[]
   */
  columns: {
    type: Array as PropType<TableColumnT[] | string[]>,
  },
  /**
   * 表头内容 ColumnKeysT
   */
  columnKeys: {
    type: Array as PropType<ColumnKeysT>,
  },
  /**
   * 表格数据 TableRowT[]
   */
  data: {
    type: Array as PropType<TableRowT[]>,
  },
  /**
   * 是否显示边框 TableBorderT
   */
  border: {
    type: String as PropType<TableBorderT>,
    default: 'row',
  },
  /**
   * 是否小表格
   */
  small: {
    type: Boolean,
  },
  /**
   * 处理单元格合并(表体部分，不包含表头) CellSpanT
   */
  cellSpan: {
    type: Function as PropType<CellSpanT>,
  },
  /**
   * 空数据提示文本
   */
  emptyLabel: {
    type: String,
  },
  /**
   * 是否正在加载
   */
  loading: {
    type: Boolean,
  },
  /**
   * 加载提示文本
   */
  loadingLabel: {
    type: String,
  },
};

export type TablePropsT = ExtractPropTypes<typeof tableProps>;
