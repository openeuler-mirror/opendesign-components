<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { innerInputProps } from './types';
import { trigger } from '../../_utils/event';
import { Enter } from '../../_utils/keycode';
import { toInputString } from './input';
import { isFunction } from '../../_utils/is';
import { IconClose, IconEyeOn, IconEyeOff } from '../../_utils/icons';
import { defaultSize } from '../../_utils/global';

const props = defineProps(innerInputProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

// input类型 password|text
const inputType = ref(props.type);

// 输入框当前真实值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));

// 当前input文本值
// const inputText = ref(realValue.value);

// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    realValue.value = toInputString(val);
    // inputText.value = realValue.value;
  }
);

// 输入框显示的字符串
const displayValue = computed(() => {
  const v = isFunction(props.format) ? props.format(realValue.value) : realValue.value;
  return v;
});

let lastValue: string = realValue.value;
function updateValue(val: string) {
  const value = isFunction(props.parse) ? props.parse(val) : val;
  emits('update:modelValue', value);
  realValue.value = value;

  if (lastValue !== value) {
    emits('change', value);
    lastValue = value;
  }
  return value;
}

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;

// 开始中文输入
const onCompositionStart = () => {
  isComposing = true;
};
// 结束中文输入
const onCompositionEnd = (e: Event) => {
  if (!isComposing) {
    return;
  }

  isComposing = false;
  trigger(e.target as HTMLElement, 'input');
};

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  emits('input', val, e);

  // inputText.value = val;

  if (!props.parse) {
    emits('update:modelValue', val);
  }
};

const onFocus = (e: FocusEvent) => {
  emits('focus', realValue.value, e);
};

const onBlur = (e: FocusEvent) => {
  const val = (e.target as HTMLInputElement)?.value;
  const v = updateValue(val);
  emits('blur', v, e);
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  if (!isComposing && keyCode === Enter.key) {
    const val = (e.target as HTMLInputElement)?.value;
    const v = updateValue(val);
    emits('pressEnter', v, e);
  }
};

// 是否可清除
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);
// 清除值
const clearClick = (e: Event) => {
  updateValue('');
  emits('clear', e);
};

// 密码输入框
const isEyeOn = ref(false);
const toggleEye = (show?: boolean) => {
  if (show === undefined) {
    isEyeOn.value = !isEyeOn.value;
  } else {
    isEyeOn.value = show;
  }
  if (isEyeOn.value) {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};

const onEyeClick = () => {
  if (props.showPasswordEvent === 'click') {
    toggleEye();
  }
};

const onEyeMouseUp = () => {
  if (isEyeOn.value) {
    toggleEye(false);

    window.removeEventListener('mouseup', onEyeMouseUp);
  }
};
const onEyeMouseDown = () => {
  if (props.showPasswordEvent === 'mousedown') {
    toggleEye(true);
    window.addEventListener('mouseup', onEyeMouseUp);
  }
};
</script>
<template>
  <div
    class="o-ii"
    :class="[
      `o-ii-${props.size || defaultSize}`,
      {
        'o-ii-clearable': isClearable && realValue !== '',
      },
    ]"
  >
    <div v-if="$slots.prefix" class="o-ii-prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="o-ii-wrap">
      <input
        :id="props.inputId"
        ref="inputRef"
        :value="displayValue"
        :type="inputType"
        :placeholder="props.placeholder"
        class="o-ii-input"
        :readonly="props.readonly"
        :disabled="props.disabled"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
    </div>
    <div v-if="props.clearable || $slots.suffix || props.type === 'password'" class="o-ii-suffix">
      <div v-if="$slots.suffix" class="o-ii-suffix-wrap">
        <slot name="suffix"></slot>
      </div>
      <div v-if="isClearable" class="o-ii-clear" @click="clearClick">
        <IconClose class="o-ii-clear-icon" />
      </div>
      <div v-if="props.type === 'password'" class="o-ii-eye" @click="onEyeClick" @mousedown="onEyeMouseDown" @mouseup="onEyeMouseUp">
        <IconEyeOn v-if="isEyeOn" class="o-ii-eye-icon" />
        <IconEyeOff v-else class="o-ii-eye-icon" />
      </div>
    </div>
  </div>
</template>
