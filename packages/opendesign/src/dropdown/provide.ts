import { InjectionKey } from 'vue';

export const dropdownInjectKey: InjectionKey<{
  updateVisible: (val: boolean) => void;
}> = Symbol('provide-dropdown');
