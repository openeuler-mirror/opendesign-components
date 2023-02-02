<script setup lang="ts">
import { ref, watch } from 'vue';
import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconArrowTraingleDown } from '../icons';
import { trigger } from '../_shared/event';
import { Enter } from '../_shared/keycode';

interface InputPropT {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: string | number;
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

const currentValue = ref(props.modelValue);
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'input', evt: Event, value: string | number): void;
  (e: 'blur', evt: Event): void;
  (e: 'focus', evt: Event): void;
}>();

function updateValue(val: string | number) {
  currentValue.value = val;
  emits('change', val);
}
watch(
  () => props.modelValue,
  (val) => {
    updateValue(val);
  }
);

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  console.log('onInput', val);
  emits('input', e, val);
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
  console.log('onFocus', e);
  emits('focus', e);
};

const onBlur = (e: FocusEvent) => {
  emits('blur', e);
  const val = (e.target as HTMLInputElement)?.value;
  console.log('onBlur', val);
  if (val !== currentValue.value) {
    updateValue(val);
    emits('update:modelValue', val);
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  if (!isComposing && keyCode === Enter.key) {
    const val = (e.target as HTMLInputElement)?.value;
    console.log('onEnter', val);
    if (val !== currentValue.value) {
      updateValue(val);
      emits('update:modelValue', val);
    }
  }
};
</script>
<template>
  <label
    class="o-input"
    :class="[`o-input-size-${props.size || defaultSize}`, `o-input-shape-${props.shape || defaultShape}`, { 'is-disabled': props.disabled }]"
  >
    <input
      :value="currentValue"
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
