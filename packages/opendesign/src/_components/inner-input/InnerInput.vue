<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { innerInputProps } from './types';
import { trigger } from '../../_utils/event';
import { Enter } from '../../_utils/keycode';
import { toInputString } from './input';
import { isFunction, isTouchDevice } from '../../_utils/is';
import { IconClose, IconEyeOn, IconEyeOff } from '../../_utils/icons';
import { vUid } from '../../directves';

const props = defineProps(innerInputProps);

const emits = defineEmits<{
  /**
   * 失焦或者enter键触发，如果传入parse，则在input时触发
   */
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
// input类型 password|text
const inputType = ref(props.type);

// 输入框当前真实值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));

// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    realValue.value = toInputString(val);
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
  realValue.value = value;

  if (lastValue !== value) {
    emits('update:modelValue', value);
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

  if (!props.parse) {
    emits('update:modelValue', val);
  }
};

// 是否聚焦
let isFocus = false;
const doFocus = () => {
  inputRef.value?.focus();
};

const onFocus = (e: FocusEvent) => {
  if (isFocus) {
    return;
  }

  isFocus = true;
  emits('focus', realValue.value, e);
};

const onBlur = (e: FocusEvent) => {
  isFocus = false;

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
const isClearable = computed(() => realValue.value && props.clearable && !props.disabled && !props.readonly);
// 清除值
const doClearValue = (e?: Event) => {
  updateValue('');
  emits('clear', e);
};

// 密码输入框
const isEyeOn = ref(false);
const togglePassword = (visible: boolean) => {
  if (visible) {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};
const toggleEye = (show?: boolean) => {
  if (show === undefined) {
    isEyeOn.value = !isEyeOn.value;
  } else {
    isEyeOn.value = show;
  }
  togglePassword(isEyeOn.value);
};

const onClearClick = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
  doClearValue();
};
const onEyeClick = () => {
  if (props.disabled) {
    return;
  }
  if (props.showPasswordEvent === 'click') {
    toggleEye();
  }
};

const onEyeMouseUp = () => {
  if (isEyeOn.value) {
    toggleEye(false);

    if (isTouchDevice) {
      window.removeEventListener('touchend', onEyeMouseUp);
      window.removeEventListener('touchcancel', onEyeMouseUp);
    } else {
      window.removeEventListener('mouseup', onEyeMouseUp);
    }
  }
};
const onEyeMouseDown = () => {
  if (props.disabled) {
    return;
  }
  if (props.showPasswordEvent === 'pointerdown') {
    toggleEye(true);
    if (isTouchDevice) {
      window.addEventListener('touchend', onEyeMouseUp);
      window.addEventListener('touchcancel', onEyeMouseUp);
    } else {
      window.addEventListener('mouseup', onEyeMouseUp);
    }
  }
};

const uId = ref('');
onMounted(() => {
  if (inputRef.value) {
    uId.value = inputRef.value.id;
  }
});

defineExpose({
  focus: doFocus,
  clear: doClearValue,
  togglePassword,
  uId,
});
</script>
<template>
  <div
    class="o-i-input"
    :class="{
      'o-ii-clearable': isClearable,
      'o-ii-disabled': props.disabled,
      'o-ii-readonly': props.readonly,
      'o-ii-password': props.type === 'password',
    }"
  >
    <div v-if="$slots.prefix" class="o-ii-prefix" @mousedown.prevent>
      <slot name="prefix"></slot>
    </div>
    <input
      ref="inputRef"
      v-uid
      class="o-ii-input"
      :value="displayValue"
      :type="inputType"
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      :disabled="props.disabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeyDown"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
    <div v-if="$slots.suffix || props.clearable || props.type === 'password'" class="o-ii-suffix" @mousedown.prevent>
      <span v-if="$slots.suffix" class="o-ii-suffix-icon">
        <slot name="suffix"></slot>
      </span>
      <div v-if="isClearable" class="o-ii-clear" @click="onClearClick" @mousedown.prevent>
        <IconClose class="o-ii-clear-icon" />
      </div>
      <div
        v-if="props.type === 'password'"
        class="o-ii-eye"
        @click="onEyeClick"
        @mousedown.prevent="onEyeMouseDown"
        @mouseup.prevent="onEyeMouseUp"
        @touchstart="onEyeMouseDown"
        @touchend="onEyeMouseUp"
        @touchcancel="onEyeMouseUp"
      >
        <IconEyeOn v-if="isEyeOn" class="o-ii-eye-icon" />
        <IconEyeOff v-else class="o-ii-eye-icon" />
      </div>
      <span v-if="$slots.extra">
        <slot name="extra"></slot>
      </span>
    </div>
  </div>
</template>
