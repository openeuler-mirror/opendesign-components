<script setup lang="ts">
import { ref, watch } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { isNull, isUndefined } from '../_shared/is';
import { IconArrowTraingleDown } from '../icons';
import { trigger } from '../_shared/event';
import { Enter } from '../_shared/keycode';

interface InputPropT {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: string;
  /**
   * 大小
   */
  size?: SizeT;
  /**
   * 形状
   */
  shape?: ShapeT;
  /**
   * 提示文本
   */
  placeholder?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否是密码输入
   */
  type?: 'text' | 'password' | 'textarea';
}
const props = withDefaults(defineProps<InputPropT>(), {
  modelValue: '',
  size: undefined,
  shape: undefined,
  placeholder: '',
  type: 'text',
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', evt: Event): void;
  (e: 'focus', evt: Event): void;
  (e: 'pressEnter', value: string, evt: Event): void;
}>();
const currentValue = ref(props.modelValue);

function updateValue(val: string) {
  currentValue.value = val;
  emits('change', val);
  emits('update:modelValue', val);
}

watch(
  () => props.modelValue,
  (val) => {
    if (isNull(val) || isUndefined(val)) {
      currentValue.value = '';
    }
    if (currentValue.value !== val) {
      currentValue.value = val;
      emits('change', val);
    }
  }
);

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  emits('input', val, e);
  updateValue(val);
};

const onCompositionStart = () => {
  isComposing = true;
};
const onCompositionEnd = (e: Event) => {
  if (!isComposing) {
    return;
  }

  isComposing = false;
  trigger(e.target as HTMLElement, 'input');
};

const onFocus = (e: FocusEvent) => {
  emits('focus', e);
};

const onBlur = (e: FocusEvent) => {
  emits('blur', e);
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  if (!isComposing && keyCode === Enter.key) {
    emits('pressEnter', currentValue.value, e);
  }
};
</script>
<template>
  <label
    class="o-input"
    :class="[`o-input-size-${props.size || defaultSize}`, `o-input-shape-${props.shape || defaultShape}`, { 'is-disabled': props.disabled }]"
  >
    <input
      :value="props.modelValue ?? currentValue"
      :type="type"
      :placeholder="props.placeholder"
      class="o-input-input"
      password
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeyDown"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
  </label>
</template>
