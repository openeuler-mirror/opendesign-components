<script setup lang="ts">
import { computed, ref, toRefs, watchEffect } from 'vue';
import { inInputProps } from './types';
import { IconClose, IconEyeOn, IconEyeOff } from '../../_utils/icons';
// import { formateToString } from '../../_utils/helper';
import { useInput, type UseInputEmitsT } from '../../_headless/use-input';
import { useInputPassword } from '../../_headless/use-input-password';
import { slotNames } from './slot';
import { isFunction } from '../../_utils/is';
import { useI18n } from '../../locale';

const props = defineProps(inInputProps);

type InInputEmitsT = {
  (e: 'update:modelValue', value: string): void;
} & UseInputEmitsT;

const emits = defineEmits<InInputEmitsT>();
const { t } = useI18n();

const { disabled, type, modelValue, inputOnOutlimit, maxLength, minLength } = toRefs(props);

const {
  realValue,
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
  modelValue: modelValue,
  emits,
  defaultValue: props.defaultValue ?? '',
  emitUpdate: (value: string) => {
    emits('update:modelValue', value);
  },
  format: props.format,
  validate: props.validate,
  onInvalidChange: props.onInvalidChange,
  maxLength,
  minLength,
  calculateLength: props.getLength,
  inputOnOutlimit: inputOnOutlimit,
});

const { showPassword, onEyeMouseDown, onEyeMouseUp, onEyeClick } = useInputPassword({
  type,
  disabled,
  showPasswordEvent: props.showPasswordEvent,
});

// input类型 password|text
const inputType = ref(props.type);

const togglePassword = (visible?: boolean) => {
  inputType.value = visible ? 'text' : 'password';
};

watchEffect(() => {
  togglePassword(showPassword.value);
});

// 是否可清除
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

const focus = () => {
  inputEl.value?.focus();
};

// 计算当前长度
const currentLength = computed(() => {
  if (isFunction(props.getLength)) {
    return props.getLength(realValue.value);
  }
  return realValue.value.length ?? 0;
});
// 是否超出最大长度限制
const isOutLengthLimit = computed(() => {
  if (props.maxLength !== undefined && currentLength.value > props.maxLength) {
    return true;
  }
  if (props.minLength !== undefined && currentLength.value < props.minLength) {
    return true;
  }
  return false;
});

/**
 * 自适应宽度
 */
const autoWidth = computed(() => props.autoWidth);
const mirrorValue = computed(() => {
  if (props.type === 'password') {
    return displayValue.value.replace(/./g, '\u2022');
  }
  return displayValue.value;
});

defineExpose({
  inputEl,
  focus,
  clear,
  togglePassword,
});
</script>
<template>
  <label
    class="o_input"
    :class="{
      'o_input-clearable': isClearable && displayValue !== '',
      'o_input-disabled': props.disabled,
      'o_input-readonly': props.readonly,
      'o_input-password': props.type === 'password',
      'o_input-invalid': !isValid,
      'o_input-auto-width': autoWidth,
    }"
    :for="props.inputId"
  >
    <div v-if="$slots.prefix" class="o_input-prefix" @mousedown.prevent>
      <slot :name="slotNames.prefix"></slot>
    </div>
    <div class="o_input-wrap" :class="{ 'o_input-wrap-auto-width': autoWidth }" :date-value="mirrorValue">
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

    <div v-if="$slots.suffix || isClearable || props.type === 'password' || props.maxLength" class="o_input-suffix" @mousedown.prevent>
      <!-- 自定义图标 -->
      <span v-if="$slots.suffix" class="o_input-suffix-icon">
        <slot :name="slotNames.suffix"></slot>
      </span>
      <!--  清除图标 -->
      <div v-if="isClearable" class="o_input-clear" @click="handleClear" @mousedown.prevent>
        <IconClose class="o_input-clear-icon" />
      </div>
      <!-- 密码图标 -->
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
      <!-- 长度限制 -->
      <div
        v-if="props.maxLength"
        class="o_input-limit"
        :class="{ 'o_input-limit-error': isOutLengthLimit }"
        v-html="t('input.limit', currentLength, props.maxLength)"
      ></div>
      <span v-if="$slots.extra">
        <slot :name="slotNames.extra"></slot>
      </span>
    </div>
  </label>
</template>
