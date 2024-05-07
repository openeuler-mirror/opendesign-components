<script setup lang="ts">
import { computed, ref, watch, onMounted, toRefs } from 'vue';
import { inTextareaProps } from './types';
import { IconClose } from '../../_utils/icons';
import { formateToString } from '../../_utils/helper';
import { useInput } from '../../_headless/use-input';
import { getResizeValue } from './textarea';
import { isFunction } from '../../_utils/is';
import { slotNames } from './slot';
import { useI18n } from '../../locale';

const props = defineProps(inTextareaProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
}>();

const { t } = useI18n();

const { format, validate } = toRefs(props);

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

const resizeValue = computed(() => {
  return props.autoSize || props.disabled ? 'none' : getResizeValue(props.resize);
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

// 计算当前长度
const currentLength = computed(() => {
  if (isFunction(props.getLength)) {
    return props.getLength(currentValue.value);
  }
  return currentValue.value.length ?? 0;
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
 * 自适应高度
 */
const mirrorValue = computed(() => {
  return displayValue.value;
});

defineExpose({
  inputEl,
  focus,
  clear,
  uId,
});
</script>
<template>
  <div
    class="o_textarea"
    :class="{
      'o_textarea-clearable': isClearable && displayValue !== '',
      'o_textarea-disabled': props.disabled,
      'o_textarea-readonly': props.readonly,
      'o_textarea-invalid': !isValid,
      'o_textarea-auto-size': props.autoSize,
    }"
  >
    <div class="o_textarea-wrap" :class="{ 'o_textarea-wrap-auto-size': props.autoSize }" :date-value="mirrorValue">
      <textarea
        :id="props.textareaId"
        ref="inputEl"
        class="o_textarea-textarea"
        :value="displayValue"
        :placeholder="props.placeholder"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :maxlength="props.inputOnOutlimit ? '' : props.maxLength"
        :minLength="props.inputOnOutlimit ? '' : props.minLength"
        :rows="props.rows"
        :cols="props.cols"
        :style="{
          resize: resizeValue,
        }"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handlePressEnter"
      ></textarea>
      <div class="o_textarea-suffix-wrap" @mousedown.prevent>
        <div v-if="isClearable" class="o_textarea-suffix o_textarea-clear" @click="handleClear" @mousedown.prevent>
          <IconClose class="o_textarea-clear-icon" />
        </div>
        <div
          v-if="props.maxLength"
          class="o_textarea-suffix o_textarea-limit"
          :class="{ 'o_textarea-limit-error': isOutLengthLimit }"
          v-html="t('input.limit', currentLength, props.maxLength)"
        ></div>
        <slot :name="slotNames.suffix"></slot>
      </div>
    </div>
  </div>
</template>
