import { InjectionKey, Ref } from 'vue';

export const radioGroupInjectKey: InjectionKey<{
  realValue: Ref<string | number | boolean>;
  disabled: Ref<boolean>;
  updateModelValue: (val: string | number | boolean) => void;
  onChange: (val: string | number | boolean, ev: Event) => void;
}> = Symbol('provide-radio-group');
