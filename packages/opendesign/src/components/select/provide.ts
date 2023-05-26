import { InjectionKey, Ref } from 'vue';
import { SelectOptionT } from './types';

export const selectOptionInjectKey: InjectionKey<{
  /**
   * @param val 选项
   * @param emit 是否为用户选择
   */
  update: (val: SelectOptionT, userSelect?: boolean) => Promise<void>;
  value: Ref<string | number>;
}> = Symbol('provide-select-option');
