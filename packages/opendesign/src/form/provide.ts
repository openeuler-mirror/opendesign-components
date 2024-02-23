import { InjectionKey, Ref } from 'vue';
import { FieldResultT, FiledInfoT } from './types';

type FieldHandlersT = {
  onChange?: (value: any, event?: Event) => void;
  onInput?: (value: any, event?: Event) => void;
  onFocus?: (value: any, event?: FocusEvent) => void;
  onBlur?: (value: any, event?: FocusEvent) => void;
};
export interface formCtx {
  // labelWidth?: ComputedRef<string | undefined>;
  model?: object;
  addFiled: (filed: FiledInfoT) => void;
  removeFiled: (filed: string) => void;
}

export const formInjectKey: InjectionKey<formCtx> = Symbol('provide-form');
export interface formItemCtx {
  fieldHandlers: FieldHandlersT;
  fieldResult: Ref<FieldResultT | null>;
}
export const formItemInjectKey: InjectionKey<formItemCtx> = Symbol('provide-form-item');
