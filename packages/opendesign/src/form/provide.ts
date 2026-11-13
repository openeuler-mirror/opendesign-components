import { InjectionKey, Ref, type MaybeRefOrGetter } from 'vue';
import type { SizeT, RoundT } from '../_utils/types';
import { FieldResultT, FiledInfoT, TriggerT } from './types';

type FieldHandlersT = {
  runValidate: (trigger?: TriggerT) => Promise<FieldResultT | null>;
  onChange?: () => void;
  onInput?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export interface formCtx {
  model?: MaybeRefOrGetter<Record<string, any> | undefined>;
  rules?: MaybeRefOrGetter<Record<string, any> | undefined>;
  disabled?: MaybeRefOrGetter<boolean | undefined>;
  size?: MaybeRefOrGetter<SizeT | undefined>;
  round?: MaybeRefOrGetter<RoundT | undefined>;
  clearable?: MaybeRefOrGetter<boolean | undefined>;
  requiredIcon?: MaybeRefOrGetter<boolean | undefined>;
  showMessage?: MaybeRefOrGetter<boolean | undefined>;
  labelWidth?: MaybeRefOrGetter<string | undefined>;
  addFiled: (filed: FiledInfoT) => void;
  removeFiled: (filed: string) => void;
  getFieldRules: (field: string) => any;
}

export const formInjectKey: InjectionKey<formCtx> = Symbol('provide-form');

export interface formItemCtx {
  fieldHandlers: FieldHandlersT;
  fieldResult: Ref<FieldResultT | null>;
  disabled?: MaybeRefOrGetter<boolean | undefined>;
  size?: MaybeRefOrGetter<SizeT | undefined>;
  round?: MaybeRefOrGetter<RoundT | undefined>;
  clearable?: MaybeRefOrGetter<boolean | undefined>;
  showMessage?: MaybeRefOrGetter<boolean | undefined>;
  /** 校验消息元素 id：消息实际渲染时非空，供子控件 aria-describedby 关联 */
  messageId?: MaybeRefOrGetter<string | undefined>;
}

export const formItemInjectKey: InjectionKey<formItemCtx> = Symbol('provide-form-item');
