import { InjectionKey, ComputedRef } from 'vue';

export const formInjectKey: InjectionKey<{
  labelWidth?: ComputedRef<string | undefined>;
}> = Symbol('provide-form');

export const formItemInjectKey: InjectionKey<{
  labelWidth?: ComputedRef<string | undefined>;
}> = Symbol('provide-form-item');
