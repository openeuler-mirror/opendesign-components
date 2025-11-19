<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { inTextareaProps } from './types';
import { IconClose } from '../../_utils/icons';
import { useInput, type UseInputEmitsT } from '../../_headless/use-input';
import { useI18n } from '../../locale';
import { vScrollbar, type BaseScrollerPropsT } from '../../scrollbar';
import { isUndefined } from '../../_utils/is';

const props = defineProps(inTextareaProps);

type InInputEmitsT = {
  (e: 'update:modelValue', value: string): void;
} & UseInputEmitsT;

const emits = defineEmits<InInputEmitsT>();

const slots = defineSlots<{
  suffix(): any;
  prefix(): any;
  length(props: {length: number}): any;
}>();

const { t } = useI18n();

const { modelValue, inputOnOutlimit, maxLength, minLength, showLength } = toRefs(props);

const {
  displayValue,
  clearValue: clear,
  isValid,
  inputValueLength,
  isShowLength,
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
  showLength,
  inputOnOutlimit,
  modelValue,
  defaultValue: props.defaultValue ?? '',
  emitUpdate: (value: string) => {
    emits('update:modelValue', value);
  },
  format: props.format,
  validate: props.validate,
  valueOnInvalidChange: props.valueOnInvalidChange,
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

// 是否显示长度插槽
const showLengthInfo = computed(() => {
  if (props.showLength === 'never') {
    return false;
  }

  if (props.showLength === 'always') {
    return true;
  }

  if (props.showLength === 'auto') {
    return !isUndefined(props.maxLength) || !isUndefined(props.minLength);
  }

  return false;
});

// 是否可清除
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

const focus = () => {
  inputEl.value?.focus();
};

const blur = () => {
  inputEl.value?.blur();
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
      showType: 'hover' as BaseScrollerPropsT['showType'],
      size: 'small' as BaseScrollerPropsT['size'],
    };
  }
  return props.scrollbar;
});

defineExpose({
  inputEl,
  focus,
  blur,
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
    <div class="o_textarea-prefix" @mousedown.prevent v-if="slots.prefix?.()">
      <slot name="prefix"></slot>
    </div>
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
      <div v-if="isClearable" class="o_textarea-icon o_textarea-clear" @click="handleClear" @mousedown.prevent>
        <IconClose class="o_textarea-clear-icon" />
      </div>
      <div
        v-if="isShowLength"
        class="o_textarea-icon o_textarea-count"
        :class="{ 'o_textarea-count-error': isOutLengthLimit }"
      >
      <slot name="length" :length="inputValueLength">
          <span v-if="props.maxLength ?? props.minLength" v-html="t('input.limit', inputValueLength, props.maxLength ?? props.minLength)"></span>
          <span v-else>{{ inputValueLength }}</span>
        </slot>
    </div>
    </div>

    <div class="o_textarea-suffix" @mousedown.prevent v-if="slots.suffix?.()">
      <slot name="suffix"></slot>
    </div>
  </label>
</template>
