import { ComputedRef, InjectionKey, Ref } from 'vue';

export const radioInjectKey: InjectionKey<{
  checked: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
}> = Symbol('provide-radio');
