import { ComputedRef, InjectionKey, Ref } from 'vue';

export const checkboxInjectKey: InjectionKey<{
  checked: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
}> = Symbol('provide-checkbox');
