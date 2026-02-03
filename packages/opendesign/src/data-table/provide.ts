import { InjectionKey, Ref } from 'vue';
import { EffectiveDataTableColumnT } from './types';

export type DataTableCtx = {
  containerWidth: Ref<number>;
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  groupColumns: Ref<EffectiveDataTableColumnT[][]>;
};
export const dataTableInjectKey: InjectionKey<DataTableCtx> = Symbol('o-data-table');
