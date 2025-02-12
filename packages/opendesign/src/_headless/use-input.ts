/* eslint-disable max-lines-per-function */
import { useComposition } from '../hooks/use-composition';
import { isFunction, isUndefined } from '../_utils/is';
import { Enter } from '../_utils/keycode';
import { ref, computed, Ref, watch, nextTick } from 'vue';

type EmitsT = {
  // 仅在输入框失焦或按下回车时触发
  (e: 'change', value: string, lastValue: string): void;
  // 用户输入时触发
  (e: 'input', value: string, evt: Event): void;
  // 输入框获取焦点时触发
  (e: 'focus', evt: FocusEvent): void;
  // 输入框失去焦点时触发
  (e: 'blur', evt: FocusEvent): void;
  // 用户点击清除按钮时触发
  (e: 'clear', evt?: Event): void;
  // 用户按下回车时触发
  (e: 'pressEnter', evt: KeyboardEvent): void;
};
export interface InputOptionT {
  modelValue?: Ref<string | undefined>;
  defaultValue?: string;
  emits: EmitsT;
  emitUpdate: (value: string) => void;
  validate?: (value: string) => boolean;
  onInvalidChange?: (inputValue: string, lastValidInputValue: string) => string;
  format?: (value: string) => string;
  maxLength?: Ref<number | undefined>;
  minLength?: Ref<number | undefined>;
  calculateLength?: (value: string) => number;
  inputOnOutlimit?: Ref<boolean | undefined>;
}

/**
 * 输入框
 */
export function useInput(options: InputOptionT) {
  const { modelValue, defaultValue, format, emits, emitUpdate, validate, onInvalidChange, maxLength, minLength, calculateLength, inputOnOutlimit } = options;

  const formatFn = (v: string) => {
    return isFunction(format) ? format(v) : v;
  };

  const calculateStringLength = isFunction(calculateLength) ? calculateLength : (value: string) => value.length;

  const validateMaxLength = (value: string) => {
    const len = calculateStringLength(value);
    if (isUndefined(maxLength?.value)) {
      return true;
    }
    return len <= maxLength.value;
  };
  // 内部校验长度函数
  const validateLengthFn = (value: string) => {
    if (!validateMaxLength(value)) {
      return false;
    }
    const len = calculateStringLength(value);
    if (isUndefined(minLength?.value)) {
      return true;
    }
    return len >= minLength.value;
  };
  // 内部校验函数+用户传入的校验函数
  const mergedValidateFn = (v: string) => {
    const r = validateLengthFn(v);
    if (r && isFunction(validate)) {
      return validate(v);
    }
    return r;
  };

  const inputEl = ref<HTMLInputElement>();

  // 正在输入中文，处理输入过程中触发input事件
  const composition = useComposition({ el: inputEl });

  // 聚焦状态
  const isFocus = ref(false);

  const uncontroledValue = ref(defaultValue);
  const controledValue = modelValue;

  // 当前值
  const computedValue = computed(() => {
    const cv = controledValue?.value;
    const ucv = uncontroledValue.value ?? '';

    return cv ?? ucv;
  });

  // 输入框显示值
  const displayValue = ref(formatFn(computedValue.value));

  // 值可用状态
  const isValid = ref(true);

  /**`
   * 校验是否值有效，如果值为空，始终有效
   */
  const validateValue = (value: string) => {
    isValid.value = value === '' ? true : mergedValidateFn(value);
    return isValid.value;
  };

  // 在长度限制变化时，重新校验
  watch(
    () => [maxLength?.value, minLength?.value],
    () => {
      validateValue(computedValue.value);
    }
  );

  // 记录上一次有效输入值
  let lastValidValue: string = validateValue(computedValue.value) ? computedValue.value : '';
  let lastValue: string = computedValue.value;

  watch(
    () => computedValue.value,
    (val) => {
      if (!isUndefined(val) && validateValue(val)) {
        lastValidValue = val;
      }
      if (isFocus.value) {
        displayValue.value = val;
      } else {
        displayValue.value = formatFn(val);
      }
    }
  );

  const updateValue = (value: string) => {
    uncontroledValue.value = value;

    emitUpdate(value);
  };

  const getValidValue = () => {
    let validVal = computedValue.value;
    // 值有效性校验
    if (!isValid.value) {
      if (isFunction(onInvalidChange)) {
        // 这调用onInvalidChange回调获取对应回调值
        validVal = onInvalidChange(computedValue.value, lastValidValue);
        validateValue(validVal);
      } else {
        // 回退到上一次有效值
        validVal = lastValidValue;
        isValid.value = true;
      }
    }

    return validVal;
  };

  const emitChange = (value: string) => {
    if (value !== lastValue) {
      emits('change', computedValue.value, lastValue);
      lastValue = computedValue.value;
    }
  };

  // 控制输入框显示值
  const keepNativeDisplayValue = () => {
    if (inputEl.value && inputEl.value.value !== displayValue.value) {
      inputEl.value.value = displayValue.value;
    }
  };

  const handleInput = (e: Event) => {
    if (composition.isComposing.value) {
      return;
    }

    const value = (e.target as HTMLInputElement)?.value;

    if (inputOnOutlimit?.value && !validateMaxLength(value)) {
      nextTick(() => {
        keepNativeDisplayValue();
      });
      return;
    }

    updateValue(value);

    emits('input', value, e);

    nextTick(() => {
      keepNativeDisplayValue();
    });
  };

  const handleFocus = (e: FocusEvent) => {
    if (isFocus.value) {
      return;
    }

    isFocus.value = true;

    if (format) {
      displayValue.value = computedValue.value;
    }

    emits('focus', e);
  };

  // 失焦
  const handleBlur = (e: FocusEvent) => {
    isFocus.value = false;

    const validValue = getValidValue();
    updateValue(validValue);

    emitChange(validValue);

    displayValue.value = formatFn(computedValue.value);
    emits('blur', e);
  };

  // enter键
  const handlePressEnter = (e: KeyboardEvent) => {
    const keyCode = e.key || e.code;
    if (!composition.isComposing.value && keyCode === Enter.key) {
      const validValue = getValidValue();
      updateValue(validValue);

      emitChange(validValue);

      emits('pressEnter', e);
    }
  };

  const clearValue = () => {
    displayValue.value = '';
    isValid.value = true;

    updateValue('');

    emitChange('');

    emits('clear');
  };

  const handleClear = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    clearValue();
  };

  return {
    realValue: computed(() => computedValue.value),
    displayValue: computed(() => displayValue.value),
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
