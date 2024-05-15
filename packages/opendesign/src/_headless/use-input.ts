/* eslint-disable max-lines-per-function */
import { useComposition } from '../hooks/use-composition';
import { isFunction } from '../_utils/is';
import { Enter } from '../_utils/keycode';
import { ref, computed, Ref, watchEffect } from 'vue';

type EmitsT = {
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
};
export interface InputOptionT {
  defaultValue: string;
  emits: EmitsT;
  emitUpdate: (value: string) => void;
  validate?: Ref<((value: string) => boolean) | undefined>;
  onInvalidChange?: (inputValue: string, lastValidInputValue: string, lastValue: string) => string;
  format?: Ref<((value: string) => string) | undefined>;
}

/**
 * 输入框
 */
export function useInput(options: InputOptionT) {
  const { defaultValue, format, emits, emitUpdate, validate, onInvalidChange } = options;
  const currentValue = ref(defaultValue);
  const lastValue = ref(defaultValue);

  const formatFn = computed(() => (isFunction(format?.value) ? format.value : (v: string) => v));
  const validateFn = computed(() => (isFunction(validate?.value) ? validate.value : () => true));

  const displayValue = ref(formatFn.value(currentValue.value));

  const inputEl = ref<HTMLInputElement>();
  // 聚焦状态
  const isFocus = ref(false);

  // 值可用状态
  const isValid = ref(true);

  // 记录上一次有效输入值
  let lastValidValue: string = '';

  const doValidate = () => {
    isValid.value = currentValue.value === '' ? true : validateFn.value(currentValue.value);
    return isValid.value;
  };
  // 初始可用状态
  if (doValidate()) {
    lastValidValue = currentValue.value;
  }

  watchEffect(() => {
    if (doValidate()) {
      lastValidValue = currentValue.value;
    }

    if (!isFocus.value || !format?.value) {
      displayValue.value = formatFn.value(currentValue.value);
    }
  });

  // 正在输入中文，处理输入过程中触发input事件
  const composition = useComposition({ el: inputEl });

  const emitUpdateValue = () => {
    emitUpdate(currentValue.value);
  };

  const emitValidUpdateValue = () => {
    // 值有效性校验
    if (!doValidate()) {
      if (isFunction(onInvalidChange)) {
        currentValue.value = onInvalidChange(currentValue.value, lastValidValue, lastValue.value);
        doValidate();
      } else {
        currentValue.value = lastValidValue;
        isValid.value = true;
      }
      emitUpdateValue();
    } else {
      lastValidValue = currentValue.value;
    }
  };

  const emitChange = () => {
    if (currentValue.value !== lastValue.value) {
      emits('change', currentValue.value);
      lastValue.value = currentValue.value;
    }
  };

  const handleInput = (e: Event) => {
    if (composition.isComposing.value) {
      return;
    }

    const val = (e.target as HTMLInputElement)?.value;

    currentValue.value = val;
    displayValue.value = val;

    if (doValidate()) {
      emitUpdateValue();
      lastValidValue = val;
    }

    emits('input', e);
  };

  const handleFocus = (e: FocusEvent) => {
    if (isFocus.value) {
      return;
    }

    isFocus.value = true;
    if (format?.value) {
      displayValue.value = currentValue.value;
    }

    emits('focus', e);
  };

  // 失焦
  const handleBlur = (e: FocusEvent) => {
    isFocus.value = false;

    if (format?.value) {
      currentValue.value = displayValue.value;
      displayValue.value = formatFn.value(currentValue.value);
    }

    emitValidUpdateValue();
    emitChange();

    emits('blur', e);
  };

  // enter键
  const handlePressEnter = (e: KeyboardEvent) => {
    const keyCode = e.key || e.code;
    if (!composition.isComposing.value && keyCode === Enter.key) {
      emitValidUpdateValue();
      emitChange();

      displayValue.value = currentValue.value;

      emits('pressEnter', e);
    }
  };

  const clearValue = () => {
    currentValue.value = '';
    displayValue.value = '';

    doValidate();

    emitUpdateValue();
    emitChange();

    emits('clear');
  };

  const handleClear = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    clearValue();
  };

  return {
    currentValue,
    lastValue,
    displayValue,
    isValid,
    inputEl,
    clearValue,
    handleInput,
    handleFocus,
    handleBlur,
    handlePressEnter,
    handleClear,
  };
}
