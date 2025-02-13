<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { inTextareaProps } from './types';
import { IconClose } from '../../_utils/icons';
import { useInput } from '../../_headless/use-input';
import { slotNames } from './slot';
import { useI18n } from '../../locale';
import { vScrollbar } from '../../scrollbar';

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

const { modelValue, inputOnOutlimit, maxLength, minLength } = toRefs(props);

const {
  displayValue,
  clearValue: clear,
  isValid,
  inputValueLength,
  isOutLengthLimit,
  handleBlur,
  handleInput,
  handleFocus,
  handleClear,
  inputEl,
} = useInput({
  emits,
  maxLength,
  minLength,
  inputOnOutlimit,
  modelValue,
  defaultValue: props.defaultValue ?? '',
  emitUpdate: (value: string) => {
    emits('update:modelValue', value);
  },
  format: props.format,
  validate: props.validate,
  onInvalidChange: props.onInvalidChange,
});

const resizeValue = computed(() => {
  if (props.autoSize || props.disabled) {
    return 'none';
  } else {
    if (props.resize === 'h') {
      return 'horizontal';
    } else if (props.resize === 'v') {
      return 'vertical';
    }
    return props.resize;
  }
});

// 是否可清除
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

const focus = () => {
  inputEl.value?.focus();
};

/**
 * 自适应高度
 */
const mirrorValue = computed(() => {
  return displayValue.value;
});
/**
 * 设置滚动条参数
 */
const scrollbarProps = computed(() => {
  if (props.scrollbar === true) {
    return {
      showType: 'auto',
      size: 'small',
    };
  }
  return props.scrollbar;
});

defineExpose({
  inputEl,
  focus,
  clear,
});
</script>
<template>
  <label
    class="o_textarea"
    :class="{
      'o_textarea-clearable': isClearable && displayValue !== '',
      'o_textarea-disabled': props.disabled,
      'o_textarea-readonly': props.readonly,
      'o_textarea-invalid': !isValid,
      'o_textarea-auto-size': props.autoSize,
      'o_textarea-limit': props.maxLength,
    }"
    :for="props.textareaId"
  >
    <div
      class="o_textarea-wrap"
      :class="{
        'o_textarea-wrap-auto-size': props.autoSize,
      }"
      :date-value="mirrorValue"
    >
      <textarea
        :id="props.textareaId"
        ref="inputEl"
        :value="displayValue"
        class="o_textarea-textarea"
        :placeholder="props.placeholder"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :rows="props.rows"
        :cols="props.cols"
        :style="{
          resize: resizeValue,
        }"
        v-scrollbar="scrollbarProps"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      ></textarea>
      <div v-if="isClearable" class="o_textarea-suffix o_textarea-clear" @click="handleClear">
        <IconClose class="o_textarea-clear-icon" />
      </div>
      <div
        v-if="props.maxLength"
        class="o_textarea-suffix o_textarea-count"
        :class="{ 'o_textarea-count-error': isOutLengthLimit }"
        v-html="t('input.limit', inputValueLength, props.maxLength)"
      ></div>
    </div>

    <div class="o_textarea-extra" @mousedown.prevent v-if="$slots[slotNames.suffix]">
      <slot :name="slotNames.suffix"></slot>
    </div>
  </label>
</template>
