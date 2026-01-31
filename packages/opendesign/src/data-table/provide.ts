import { InjectionKey, Ref, ComputedRef } from 'vue';
import { EffectiveDataTableColumnT } from './types';

export type DataTableCtx = {
  containerWidth: Ref<number>;
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  columnWidthMap: Record<string, number>;
};
export const dataTableInjectKey: InjectionKey<DataTableCtx> = Symbol('o-data-table');
