import { InjectionKey, Ref } from 'vue';

export const radioGroupInjectKey: InjectionKey<{
  modelValue: Ref<string | number | boolean>;
  disabled: Ref<boolean>;
  onChange: (val: string | number | boolean) => void;
}> = Symbol('provide-radio-group');
