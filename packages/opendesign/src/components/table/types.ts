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