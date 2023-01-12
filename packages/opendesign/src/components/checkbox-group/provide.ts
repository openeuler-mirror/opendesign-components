import { InjectionKey, Ref } from 'vue';

export const checkboxGroupInjectKey: InjectionKey<{
  modelValue: Ref<Array<string | number>>;
  disabled: Ref<boolean>;
  onModelValueUpdate: (val: Array<string | number>) => void;
  onChange: (val: Array<string | number>) => void;
}> = Symbol('provide-checkbox-group');
