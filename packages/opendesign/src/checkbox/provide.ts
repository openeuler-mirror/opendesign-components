import { ComputedRef, InjectionKey } from 'vue';

export const checkboxInjectKey: InjectionKey<{
  checked: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
}> = Symbol('provide-checkbox');
