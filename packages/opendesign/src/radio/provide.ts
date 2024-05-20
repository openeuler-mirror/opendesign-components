import { ComputedRef, InjectionKey } from 'vue';

export const radioInjectKey: InjectionKey<{
  checked: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
}> = Symbol('provide-radio');
