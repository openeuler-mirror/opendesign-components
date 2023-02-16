import { InjectionKey, Ref } from 'vue';

export const checkboxGroupInjectKey: InjectionKey<{
  realValue: Ref<Array<string | number>>;
  disabled: Ref<boolean>;
  isMinimum: Ref<boolean>;
  isMaximum: Ref<boolean>;
  updateModelValue: (val: Array<string | number>) => void;
  onChange: (val: Array<string | number>) => void;
}> = Symbol('provide-checkbox-group');
