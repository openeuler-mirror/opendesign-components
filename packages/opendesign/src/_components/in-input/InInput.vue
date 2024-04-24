<script setup lang="ts">
import { computed, ref, watch, onMounted, toRefs, watchEffect } from 'vue';
import { inInputProps } from './types';
import { IconClose, IconEyeOn, IconEyeOff } from '../../_utils/icons';
import { formateToString } from '../../_utils/helper';
import { useInput } from '../../_headless/use-input';
import { useInputPassword } from '../../_headless/use-input-password';
import { slotNames } from './slot';

const props = defineProps(inInputProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
}>();

const { disabled, type, format, validate } = toRefs(props);

const {
  currentValue,
  displayValue,
  clearValue: clear,
  isValid,
  handleBlur,
  handleInput,
  handleFocus,
  handlePressEnter,
  handleClear,
  inputEl,
} = useInput({
  emits,
  defaultValue: props.modelValue ?? props.defaultValue ?? '',
  emitUpdate: (value: string) => {
    emits('update:modelValue', value);
  },
  format,
  validate,
  onInvalidChange: props.onInvalidChange,
});

const { showPassword, onEyeMouseDown, onEyeMouseUp, onEyeClick } = useInputPassword({
  type,
  disabled,
  showPasswordEvent: props.showPasswordEvent,
});

const autoWidth = computed(() => props.autoWidth && props.type !== 'password');

// input类型 password|text
const inputType = ref(props.type);

const togglePassword = (visible?: boolean) => {
  inputType.value = visible ? 'text' : 'password';
};

watchEffect(() => {
  togglePassword(showPassword.value);
});

// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    const value = formateToString(val);
    if (value !== currentValue.value) {
      currentValue.value = value;
    }
  }
);

// 是否可清除
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

const focus = () => {
  inputEl.value?.focus();
};

const uId = ref('');
onMounted(() => {
  if (inputEl.value) {
    uId.value = inputEl.value.id;
  }
});

defineExpose({
  inputEl,
  focus,
  clear,
  togglePassword,
  uId,
});
</script>
<template>
  <div
    class="o_input"
    :class="{
      'o_input-clearable': isClearable && displayValue !== '',
      'o_input-disabled': props.disabled,
      'o_input-readonly': props.readonly,
      'o_input-password': props.type === 'password',
      'o_input-invalid': !isValid,
      'o_input-auto-width': autoWidth,
    }"
  >
    <div v-if="$slots.prefix" class="o_input-prefix" @mousedown.prevent>
      <slot :name="slotNames.prefix"></slot>
    </div>
    <div class="o_input-wrap" :class="{ 'o_input-wrap-auto-width': autoWidth }" :date-value="displayValue">
      <input
        :id="props.inputId"
        ref="inputEl"
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
    </div>
    <div v-if="$slots.suffix || props.clearable || props.type === 'password'" class="o_input-suffix" @mousedown.prevent>
      <span v-if="$slots.suffix" class="o_input-suffix-icon">
        <slot :name="slotNames.suffix"></slot>
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
        <IconEyeOn v-if="showPassword" class="o_input-eye-icon" />
        <IconEyeOff v-else class="o_input-eye-icon" />
      </div>
      <span v-if="$slots.extra">
        <slot :name="slotNames.extra"></slot>
      </span>
    </div>
  </div>
</template>
