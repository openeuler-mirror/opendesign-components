import { useComposition } from '../hooks/use-composition';
import { isFunction } from '../_utils/is';
import { Enter } from '../_utils/keycode';
import { ref, computed } from 'vue';
export interface InputOptionT {
  parse?: (value: string) => string;
  format?: (value: string) => string;
  defaultValue: string;
  emits: {
    /**
     * 失焦或者enter键触发，如果传入parse，则在input时触发
     */
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
    (e: 'input', evt: Event): void;
    (e: 'blur', evt: FocusEvent): void;
    (e: 'focus', evt: FocusEvent): void;
    (e: 'clear', evt?: Event): void;
    (e: 'pressEnter', evt: KeyboardEvent): void;
  };
}

/**
 * 输入框
 */
export function useInput(options: InputOptionT) {
  const { defaultValue, parse, format, emits } = options;
  const currentValue = ref(defaultValue);
  const lastValue = ref(defaultValue);

  const displayValue = computed(() => (isFunction(format) ? format(currentValue.value) : currentValue.value));

  const inputRef = ref<HTMLInputElement>();

  // 正在输入中文，处理输入过程中触发input事件
  const composition = useComposition({ el: inputRef });

  const updateValue = (val: string) => {
    if (isFunction(parse)) {
      currentValue.value = parse(val);
    } else {
      currentValue.value = val;
    }
    if (lastValue.value !== currentValue.value) {
      emits('change', currentValue.value);
      lastValue.value = currentValue.value;
    }
  };

  const handleInput = (e: Event) => {
    if (composition.isComposing.value) {
      return;
    }

    const val = (e.target as HTMLInputElement)?.value;
    emits('input', e);

    if (!parse) {
      emits('update:modelValue', val);
    }
  };

  // 聚焦
  let isFocus = false;
  const handleFocus = (e: FocusEvent) => {
    if (isFocus) {
      return;
    }

    isFocus = true;
    emits('focus', e);
  };

  // 失焦
  const handleBlur = (e: FocusEvent) => {
    isFocus = false;

    const val = (e.target as HTMLInputElement)?.value;

    updateValue(val);

    emits('blur', e);
  };

  // enter键
  const handlePressEnter = (e: KeyboardEvent) => {
    const keyCode = e.key || e.code;
    if (!composition.isComposing.value && keyCode === Enter.key) {
      const val = (e.target as HTMLInputElement)?.value;

      updateValue(val);

      emits('pressEnter', e);
    }
  };

  const clearValue = () => {
    updateValue('');
    emits('update:modelValue', '');

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
    inputRef,
    clearValue,
    handleInput,
    handleFocus,
    handleBlur,
    handlePressEnter,
    handleClear,
  };
}
