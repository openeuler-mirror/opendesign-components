import { InjectionKey, ComputedRef, Ref } from 'vue';
import { FieldResultT } from './types';

type FieldHandlersT = {
  onChange?: (value: any, event?: Event) => void;
  onInput?: (value: any, event?: Event) => void;
  onFocus?: (value: any, event?: FocusEvent) => void;
  onBlur?: (value: any, event?: FocusEvent) => void;
};

export const formInjectKey: InjectionKey<{
  labelWidth?: ComputedRef<string | undefined>;
}> = Symbol('provide-form');

export const formItemInjectKey: InjectionKey<{
  fieldHandlers: FieldHandlersT;
  fieldResult: Ref<FieldResultT | undefined>;
}> = Symbol('provide-form-item');
