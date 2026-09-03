import { ComputedRef, InjectionKey, MaybeRefOrGetter, Ref } from 'vue';
import type { VNodeChild } from 'vue';
import { SelectOptionT, SelectOptionData } from './types';

export const selectOptionInjectKey: InjectionKey<{
  /**
   * @param option 选中的选项
   * @param emit 是否为用户选择
   */
  select: (option: SelectOptionT) => Promise<void>;
  registerOption: (option: SelectOptionT) => void;
  /**
   * 选项卸载时从 optionInfoMap 清理，保留 cachedOptionMap
   * @since 1.2.7
   */
  unregisterOption?: (option: SelectOptionT) => void;
  selectValue: Ref<Array<string | number>>;
  multiple: MaybeRefOrGetter<boolean>;
  /**
   * 多选已达上限（limit > 0 && 已选数 >= limit），用于禁用未选项
   * @since 1.2.7
   */
  limitReached?: ComputedRef<boolean>;
  /**
   * renderLabel 函数，用于 OOption 内部 fallback 渲染
   * @since 1.2.7
   */
  renderLabelFn?: ComputedRef<((option: SelectOptionData, selected: boolean) => VNodeChild) | undefined>;
}> = Symbol('provide-select-option');
