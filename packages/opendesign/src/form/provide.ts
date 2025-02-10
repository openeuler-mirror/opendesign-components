import { InjectionKey, Ref, ComputedRef } from 'vue';
import { FieldResultT, FiledInfoT, TriggerT } from './types';

type FieldHandlersT = {
  runValidate: (trigger?: TriggerT) => Promise<FieldResultT | null>;
  onChange?: () => void;
  onInput?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
export interface formCtx {
  model?: ComputedRef<Record<string, any> | undefined>;
  addFiled: (filed: FiledInfoT) => void;
  removeFiled: (filed: string) => void;
}

export const formInjectKey: InjectionKey<formCtx> = Symbol('provide-form');
export interface formItemCtx {
  fieldHandlers: FieldHandlersT;
  fieldResult: Ref<FieldResultT | null>;
}
export const formItemInjectKey: InjectionKey<formItemCtx> = Symbol('provide-form-item');
