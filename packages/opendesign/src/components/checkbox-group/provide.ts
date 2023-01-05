import { InjectionKey, Ref } from 'vue';

export const checkboxGroupInjectKey: InjectionKey<{
  modelValue: Ref<Array<string | number>>;
  disabled: Ref<boolean>;
  onChange: (val: Array<string | number>) => void;
}> = Symbol('provide-checkbox-group');
