<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { innerInputProps } from './types';
import { Enter } from '../../_utils/keycode';
import { isTouchDevice } from '../../_utils/is';
import { IconClose, IconEyeOn, IconEyeOff } from '../../_utils/icons';
import { vUid } from '../../directves';
import { formateToString } from '../../_utils/helper';
import { useComposition } from '../../hooks/use-composition';
import { useInput } from '../../_headless/use-input';

const props = defineProps(innerInputProps);

const emits = defineEmits<{
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
}>();

const { currentValue, displayValue, clearValue, handleBlur, handleInput, handleFocus, handlePressEnter, handleClear, inputRef } = useInput({
  emits: emits,
  defaultValue: props.modelValue ?? props.defaultValue ?? '',
  parse: props.parse,
  format: props.format,
});

// input类型 password|text
const inputType = ref(props.type);

// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    currentValue.value = formateToString(val);
  }
);

// 是否可清除
const isClearable = computed(() => currentValue.value && props.clearable && !props.disabled && !props.readonly);

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
  focus: () => {
    inputRef.value?.focus();
  },
  clear: clearValue,
  togglePassword,
  uId,
});
</script>
<template>
  <div
    class="o_input"
    :class="{
      'o_input-clearable': isClearable,
      'o_input-disabled': props.disabled,
      'o_input-readonly': props.readonly,
      'o_input-password': props.type === 'password',
    }"
  >
    <div v-if="$slots.prefix" class="o_input-prefix" @mousedown.prevent>
      <slot name="prefix"></slot>
    </div>
    <input
      ref="inputRef"
      v-uid
      class="o_input-input"
      :value="displayValue"
      :type="inputType"
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      :disabled="props.disabled"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keydown="handlePressEnter"
    />
    <div v-if="$slots.suffix || props.clearable || props.type === 'password'" class="o_input-suffix" @mousedown.prevent>
      <span v-if="$slots.suffix" class="o_input-suffix-icon">
        <slot name="suffix"></slot>
      </span>
      <div v-if="isClearable" class="o_input-clear" @click="handleClear" @mousedown.prevent>
        <IconClose class="o_input-clear-icon" />
      </div>
      <div
        v-if="props.type === 'password'"
        class="o_input-eye"
        @click="onEyeClick"
        @mousedown.prevent="onEyeMouseDown"
        @mouseup.prevent="onEyeMouseUp"
        @touchstart="onEyeMouseDown"
        @touchend="onEyeMouseUp"
        @touchcancel="onEyeMouseUp"
      >
        <IconEyeOn v-if="isEyeOn" class="o_input-eye-icon" />
        <IconEyeOff v-else class="o_input-eye-icon" />
      </div>
      <span v-if="$slots.extra">
        <slot name="extra"></slot>
      </span>
    </div>
  </div>
</template>
