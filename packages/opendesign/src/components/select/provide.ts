import { InjectionKey, Ref } from 'vue';
import { SelectOptionT } from './types';


export const selectOptionInjectKey: InjectionKey<{ update: (val: SelectOptionT, emit?: boolean) => void, value: Ref<string | number> }> =
  Symbol('provide-select-option');

