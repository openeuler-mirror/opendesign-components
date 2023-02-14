import { StyleValue } from 'vue';

export interface TableColumnT {
  key: string,
  label?: string,
  style?: StyleValue
}

export interface TableRowT {
  key?: string | number;
  [key: string]: any;
}

export type ColumnKeysT = Array<string>;

export type CellSpanT = (rowIndex: number, columnIndex: number) => { rowspan?: number; colspan?: number } | undefined;

export type TableBorderT = 'all' | 'row' | 'column' | 'frame' | 'row-column' | 'row-frame' | 'column-frame' | 'none';


export interface TablePaginationT {
  /**
  * 当前页码
  */
  currentPage?: number;
  /**
   * 每页数据条数
   */
  pageSize?: number;
  /**
   * 支持选择的每页数据条数
   */
  pageSizes?: number[];
  /**
   * 显示页面数 > 3
   */
  showPageCount?: number;
  /**
   * 简洁模式
   */
  simple?: boolean;
}