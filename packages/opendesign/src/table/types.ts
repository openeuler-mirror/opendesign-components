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

export type CellSpanT = (
  rowIndex: number,
  columnIndex: number,
  rowData?: TableRowT,
  column?: TableColumnT
) => { rowspan?: number; colspan?: number } | undefined;

export const TableBorderTypes = ['all', 'row', 'column', 'frame', 'row-column', 'row-frame', 'column-frame', 'none'] as const;
export type TableBorderT = (typeof TableBorderTypes)[number];

export const tableProps = {
  /**
   * @zh-CN 表头数据
   * @en-US Table header data
   */
  columns: {
    type: Array as PropType<TableColumnT[] | string[]>,
  },
  /**
   * @zh-CN 表格数据
   * @en-US Table data
   */
  data: {
    type: Array as PropType<TableRowT[]>,
  },
  /**
   * @zh-CN 表格边框
   * @en-US Table border
   * @default 'row'
   */
  border: {
    type: String as PropType<TableBorderT>,
    default: 'row',
  },
  /**
   * @zh-CN 是否使用小尺寸
   * @en-US Use small size
   */
  small: {
    type: Boolean,
  },
  /**
   * @zh-CN 单元格合并（不含表头）
   * @en-US Cell merge (excluding header)
   */
  cellSpan: {
    type: Function as PropType<CellSpanT>,
  },
  /**
   * @zh-CN 空数据提示文本
   * @en-US Empty data prompt text
   */
  emptyLabel: {
    type: String,
  },
  /**
   * @zh-CN 是否显示加载中状态
   * @en-US Whether to show loading state
   */
  loading: {
    type: Boolean,
  },
  /**
   * @zh-CN 加载中提示文本
   * @en-US Loading prompt text
   */
  loadingLabel: {
    type: String,
  },
};

export type TablePropsT = ExtractPropTypes<typeof tableProps>;
