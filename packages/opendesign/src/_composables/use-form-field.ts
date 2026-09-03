import { computed, inject, onMounted, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { formItemInjectKey } from '../form/provide';
import { uniqueId } from '../_utils/helper';
import type { Color2T, RoundT, SizeT } from '../_utils/types';

export type FormFieldProps = {
  color?: Color2T;
  inputId?: string;
  disabled?: boolean | undefined;
  size?: SizeT | undefined;
  round?: MaybeRefOrGetter<RoundT | undefined>;
  clearable?: boolean | undefined;
};

export interface FormFieldEmits {
  (e: 'focus', evt: FocusEvent): void;
  (e: 'blur', evt?: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter'): void;
}

/**
 * @description 兼容 Vue `defineEmits` 返回值的宽松 emit 函数类型
 *
 * `defineEmits` 返回的 `__VLS_Emit` 其事件名为联合字面量，与 `FormFieldEmits` 的重载签名
 * 天然不兼容（字面量集合不一致）。`useFormField` 的 emit 参数改用此宽松类型以消除赋值冲突，
 * `FormFieldEmits` 仍保留作为 useFormField 内部触发事件的契约文档
 */
type FormFieldEmitFn = (...args: any[]) => void;

export function useFormField(props: Partial<FormFieldProps>, emit?: FormFieldEmitFn) {
  const formItem = inject(formItemInjectKey, null);

  const effectiveColor = computed<Color2T>(() => {
    const result = formItem?.fieldResult.value;
    return result ? result.type || 'normal' : (props.color ?? 'normal');
  });

  const effectiveDisabled = computed<boolean | undefined>(() => {
    if (props.disabled !== undefined) return props.disabled;
    return toValue(formItem?.disabled);
  });

  const effectiveSize = computed<SizeT | undefined>(() => {
    if (props.size !== undefined) return props.size;
    return toValue(formItem?.size);
  });

  const effectiveRound = computed<RoundT | undefined>(() => {
    const propRound = toValue(props.round);
    if (propRound !== undefined) return propRound;
    return toValue(formItem?.round);
  });

  const effectiveClearable = computed<boolean | undefined>(() => {
    if (props.clearable !== undefined) return props.clearable;
    return toValue(formItem?.clearable);
  });

  const inputId = ref(props.inputId);
  onMounted(() => {
    if (!inputId.value) {
      inputId.value = uniqueId();
    }
  });

  const isFocus = ref(false);

  /**
   * @description 聚焦处理：emit focus 事件（携带 FocusEvent）并通知表单项触发校验
   * @param e 原生 FocusEvent
   */
  const onFocus = (e: FocusEvent) => {
    isFocus.value = true;
    emit?.('focus', e);
    formItem?.fieldHandlers.onFocus?.();
  };

  /**
   * @description 失焦处理：emit blur 事件（携带 FocusEvent）并通知表单项触发校验
   * @param e 原生 FocusEvent，可选——向后兼容不传参的调用方
   */
  const onBlur = (e?: FocusEvent) => {
    isFocus.value = false;
    emit?.('blur', e);
    formItem?.fieldHandlers.onBlur?.();
  };

  const onClear = (e?: Event) => {
    e?.stopPropagation();
    emit?.('clear', e);
  };

  const onPressEnter = () => {
    emit?.('pressEnter');
  };

  const onChange = () => {
    formItem?.fieldHandlers.onChange?.();
  };

  const onInput = () => {
    formItem?.fieldHandlers.onInput?.();
  };

  /**
   * @description 触发聚焦：onFocus 的语义别名，接受 FocusEvent
   * @param e 原生 FocusEvent
   */
  const triggerFocus = (e: FocusEvent) => {
    onFocus(e);
  };

  /**
   * @description 触发失焦：onBlur 的语义别名，接受可选 FocusEvent
   * @param e 原生 FocusEvent，透传给 emit('blur', e)
   */
  const triggerBlur = (e?: FocusEvent) => {
    onBlur(e);
  };

  const blockChildInject = () => {};

  return {
    effectiveColor,
    effectiveDisabled,
    effectiveSize,
    effectiveRound,
    effectiveClearable,
    inputId,
    isFocus,
    onFocus,
    onBlur,
    onClear,
    onPressEnter,
    onChange,
    onInput,
    triggerFocus,
    triggerBlur,
    blockChildInject,
  };
}
