import { ComputedRef, InjectionKey, ModelRef, Ref, ToRefs, WritableComputedRef } from 'vue';

import { TableRowT } from '../table';
import { DataTablePropsT, DataTableRowKeyValue, EffectiveDataTableColumnT } from './types';

export type DataTableRowKeyMap = Map<
  DataTableRowKeyValue,
  {
    row: TableRowT;
    rowIndex: number;
    disabled: boolean;
    /** 祖先节点的key,由深到浅排序 */
    ancestorRowKeys: DataTableRowKeyValue[];
    /** 后代节点的key */
    descendantRowKeys: DataTableRowKeyValue[];
  }
>;

export type DataTableLoadChildrenPayload = {
  row: TableRowT;
  rowIndex: number;
  rowKey: DataTableRowKeyValue;
  resolve: () => void;
  reject: (reason?: any) => void;
};

export type DataTableCtx = ToRefs<DataTablePropsT> & {
  getRowKey: (row: TableRowT, rowIndex: number) => DataTableRowKeyValue;
  containerWidth: Ref<number>;
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  groupColumns: Ref<EffectiveDataTableColumnT[][]>;

  hasExpandSlot: ComputedRef<boolean>;
  expandedRowKeys: ModelRef<DataTableRowKeyValue[]>;

  isBodyCellRemoved: (rowIndex: number, colIndex: number) => boolean;
  isLastLeftFixedCell: (rowIndex: number, colIndex: number) => boolean;
  isFirstRightFixedCell: (rowIndex: number, colIndex: number) => boolean;

  selectedKeys: ModelRef<DataTableRowKeyValue[]>;
  rowKeyMap: ComputedRef<DataTableRowKeyMap>;
  allRowKeys: ComputedRef<DataTableRowKeyValue[]>;
  toFilteredSelectable: (arr: DataTableRowKeyValue[]) => DataTableRowKeyValue[];
  handleTableSelection: (key: DataTableRowKeyValue, newVal: DataTableRowKeyValue[]) => void;

  handleLoadChildren: (payload: DataTableLoadChildrenPayload) => void;
};
export const dataTableInjectKey: InjectionKey<DataTableCtx> = Symbol('o-data-table');

export type DataTableRowCtx = {
  /** 当前层级是否可以展开 */
  isLevelExpandable: ComputedRef<{ expandable: boolean; expandableRowIndexes: number[] }>;
};
export const dataTableRowInjectKey: InjectionKey<DataTableRowCtx> = Symbol('o-data-table-row');
