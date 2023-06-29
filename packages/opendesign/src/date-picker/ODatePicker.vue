<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { datePickerProps } from './types';
import { InnerFrame } from '../_components/inner-frame';
import { InnerInput } from '../_components/inner-input';
import { uniqueId } from '../_utils/helper';
import { IconCalendar } from '../_utils/icons';

const props = defineProps(datePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const inputId = uniqueId('input');
const inputRef = ref<InstanceType<typeof InnerInput>>();

// 是否聚焦状态
const isFocus = ref(false);
const onFocus = (value: string, e: FocusEvent) => {
  isFocus.value = true;
  emits('focus', value, e);
};

const onBlur = (value: string, e: FocusEvent) => {
  isFocus.value = false;
  emits('blur', value, e);
};

const onUpdateModelValue = (value: string) => {
  emits('update:modelValue', value);
};

const onChange = (value: string) => {
  emits('change', value);
};

const onInput = (value: string, e: Event) => {
  emits('input', value, e);
};

const onClear = (e?: Event) => {
  emits('clear', e);
};

const onPressEnter = (value: string, e: KeyboardEvent) => {
  emits('pressEnter', value, e);
};
</script>
<template>
  <InnerFrame
    class="o-date-picker"
    :variant="props.variant"
    :color="props.color"
    :disabled="props.disabled"
    :focused="isFocus"
    :size="props.size"
    :round="props.round"
    :readonly="props.readonly"
    :for="inputId"
  >
    <InnerInput
      ref="inputRef"
      :model-value="props.modelValue"
      :default-value="props.defaultValue"
      :input-id="inputId"
      type="text"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @update:model-value="onUpdateModelValue"
      @change="onChange"
      @clear="onClear"
      @press-enter="onPressEnter"
    >
      <template #prefix>p</template>
      <template #suffix>s</template>
    </InnerInput>
    <div class="o-dp-icon" @mousedown.prevent><IconCalendar /></div>
  </InnerFrame>
</template>
