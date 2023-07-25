import { InjectionKey, Ref } from 'vue';
import { SelectOptionT } from './types';

export const selectOptionInjectKey: InjectionKey<{
  /**
   * @param option 选中的选项
   * @param emit 是否为用户选择
   */
  select: (option: SelectOptionT, userSelect?: boolean) => Promise<void>;
  selectValue: Ref<Array<string | number>>;
  multiple: boolean;
}> = Symbol('provide-select-option');
