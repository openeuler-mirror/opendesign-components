import { useComposition } from '../hooks/use-composition';
import { isFunction, isNumber, isUndefined } from '../_utils/is';
import { Enter } from '../_utils/keycode';
import { ref, computed, Ref, watch, nextTick, VNode } from 'vue';

export type UseInputEmitsT = {
  // 仅在输入框失焦或按下回车时触发
  (e: 'change', value: string, lastValue: string): void;
  // 用户输入时（键盘输入、粘贴等）触发，value为当前输入的值
  (e: 'input', evt: Event, value: string): void;
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
  emits: UseInputEmitsT;
  emitUpdate: (value: string) => void;
  validate?: (value: string) => boolean;
  // 当输入值不合法时的处理方式：[true]：纠正为上一次合法的值(如果上一次合法值为空字符串，则不处理); [false|undefined]: 不处理；[function]: 使用函数的返回值
  valueOnInvalidChange?: boolean | ((inputValue: string, lastValidInputValue: string) => string);
  format?: (value: string) => string;
  maxLength?: Ref<number | undefined>;
  minLength?: Ref<number | undefined>;
  showLength?: Ref<'always' | 'auto' | 'never' | ((length: number) => string | VNode)>;
  calculateLength?: (value: string) => number;
  inputOnOutlimit?: Ref<boolean | undefined>;
  onlyNumericInput?: Ref<boolean | undefined>;
}

/**
 * 输入框
 */
// eslint-disable-next-line max-lines-per-function
export function useInput(options: InputOptionT) {
  const {
    modelValue,
    defaultValue,
    format,
    emits,
    emitUpdate,
    validate,
    valueOnInvalidChange,
    maxLength,
    minLength,
    showLength,
    calculateLength,
    inputOnOutlimit,
    onlyNumericInput,
  } = options;

  const formatFn = (v: string) => {
    return isFunction(format) ? format(v) : v;
  };
  const calculateStringLength = (v: string) => {
    return isFunction(calculateLength) ? calculateLength(v) : v?.length;
  };

  const uncontrolledValue = ref(defaultValue);
  const controlledValue = modelValue;

  // 当前值
  const computedValue = computed(() => {
    const cv = controlledValue?.value;
    const ucv = uncontrolledValue.value ?? '';

    return cv ?? ucv;
  });

  // 输入框显示值
  const displayValue = ref(formatFn(computedValue.value));

  // 计算值当前长度
  const inputValueLength = computed(() => {
    return calculateStringLength(computedValue.value);
  });

  const validateMaxLength = (length: number) => {
    if (!isNumber(maxLength?.value)) {
      return true;
    }
    return length <= maxLength.value;
  };
  const validateMinLength = (length: number) => {
    if (!isNumber(minLength?.value)) {
      return true;
    }
    return length >= minLength.value;
  };
  // 内部校验长度函数
  const validateLengthFn = (value: string) => {
    const len = calculateStringLength(value);

    return validateMaxLength(len) && validateMinLength(len);
  };

  // 是否满足长度要求
  const isOutLengthLimit = computed(() => {
    return !validateLengthFn(computedValue.value);
  });

  // 内部校验函数+用户传入的校验函数
  const mergedValidateFn = (v: string) => {
    const r = validateLengthFn(v);
    if (r && isFunction(validate)) {
      return validate(v);
    }
    return r;
  };

  const inputEl = ref<HTMLInputElement | HTMLTextAreaElement>();

  // 正在输入中文，处理输入过程中触发input事件
  const composition = useComposition({ el: inputEl });

  // 聚焦状态
  const isFocus = ref(false);

  // 值可用状态
  const isValid = ref(true);

  /**
   * 校验是否值有效，如果值为空，不校验，设为有效
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
    },
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
    },
  );

  const updateValue = (value: string) => {
    uncontrolledValue.value = value;

    // 判断值是否变化，有变化再触发事件
    if (value !== computedValue.value) {
      emitUpdate(value);
    }
  };

  const getValidValue = () => {
    let validVal = computedValue.value;
    // 值有效性校验
    if (!isValid.value) {
      if (isFunction(valueOnInvalidChange)) {
        // 调用valueOnInvalidChange回调获取对应回调值
        validVal = valueOnInvalidChange(computedValue.value, lastValidValue);
        validateValue(validVal);
      } else if (valueOnInvalidChange === true && lastValidValue !== '') {
        // 回退到上一次有效值
        validVal = lastValidValue;
        isValid.value = true;
      }
    }

    return validVal;
  };

  const emitChange = (value: string) => {
    if (value !== lastValue) {
      nextTick(() => {
        emits('change', computedValue.value, lastValue);
        lastValue = computedValue.value;
      });
    }
  };

  // 控制输入框显示值
  const keepNativeDisplayValue = () => {
    if (inputEl.value && inputEl.value.value !== displayValue.value) {
      inputEl.value.value = displayValue.value;
    }
  };

  const isAllowedToInputOnOutLimit = (value: string) => {
    // 未设置最大长度或者允许查出最大长度后可继续输入
    if (!isUndefined(maxLength?.value) && inputOnOutlimit?.value === true) {
      return true;
    }

    const len = calculateStringLength(value);
    const isLower = validateMaxLength(len);
    if (isLower) {
      return true;
    }

    // 超出长度限制，且为字符长度减少，则支持操作
    if (len < calculateStringLength(computedValue.value)) {
      return true;
    }
    return false;
  };

  const basicValidRegex = /^-?\d*\.?\d*$/;
  const invalidFormatRegex = /-{2,}|\.{2,}|^-\.$|^-\.\d+$/;

  const handleInput = (e: Event) => {
    let value = (e.target as HTMLInputElement)?.value;
    const currentValue = value;

    // 仅限制数字输入
    if ((onlyNumericInput?.value && !basicValidRegex.test(currentValue)) || invalidFormatRegex.test(currentValue)) {
      value = displayValue.value;
    }

    if (composition.isComposing.value) {
      // 解决在输入中文时，组件触发onUpdate时,显示值被刷新成输入前的值
      displayValue.value = value;
      return;
    }

    let newValue = value;

    if (!isAllowedToInputOnOutLimit(value)) {
      // 当超出长度限制不允许输入时，按照最大长度截断
      newValue = value.substring(0, maxLength?.value);
    }

    updateValue(newValue);

    /**
     * 1. 始终上报当前输入的值，可能经过校验、或截断后显示的值与输入的不一致
     * 2. 模仿原生input行为，将input事件放在update:model-value后触发
     */
    emits('input', e, value);

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

  // 是否展示内容长度
  const isShowLength = computed(() => {
    if (showLength?.value === 'never') {
      return false;
    }

    if (showLength?.value === 'always') {
      return true;
    }

    const isSetLimit = !isUndefined(maxLength?.value) || !isUndefined(minLength?.value);
    if (showLength?.value === 'auto' && isSetLimit) {
      return true;
    }

    return false;
  });

  return {
    realValue: computed(() => computedValue.value),
    displayValue: computed(() => displayValue.value),
    isValid,
    inputEl,
    clearValue,
    inputValueLength,
    isShowLength,
    isOutLengthLimit,
    handleInput,
    handleFocus,
    handleBlur,
    handlePressEnter,
    handleClear,
  };
}
