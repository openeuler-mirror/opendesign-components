import { InjectionKey, Ref } from 'vue';
import { SelectOptionT } from './types';


export const selectOptionUpdateFnInjectKey: InjectionKey<(val: SelectOptionT, emit?: boolean) => void> =
  Symbol('provide-select-option/updateFn');

export const selectOptionValueInjectKey: InjectionKey<Ref<string | number>> =
  Symbol('provide-select-option/value');
