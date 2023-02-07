import { InjectionKey, Ref } from 'vue';

export const radioGroupInjectKey: InjectionKey<{
  modelValue: Ref<string | number | boolean>;
  disabled: Ref<boolean>;
  updateModelValue: (val: string | number | boolean) => void;
  onChange: (val: string | number | boolean) => void;
}> = Symbol('provide-radio-group');
