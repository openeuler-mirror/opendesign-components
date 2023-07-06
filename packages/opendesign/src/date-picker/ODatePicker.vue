<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { datePickerProps } from './types';
import { InnerFrame } from '../_components/inner-frame';
import { InnerInput } from '../_components/inner-input';
import { InnerPanel } from '../_components/inner-panel';
import { uniqueId } from '../_utils/helper';
import { IconCalendar } from '../_utils/icons';
import DatePane from './DatePane.vue';
import { format, parse } from 'date-fns';
import zh from 'date-fns/locale/zh-CN';
import { isFunction } from '../_utils/is';
import { isValidDate } from './date';

const props = defineProps(datePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Number): void;
  (e: 'change', value: string): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const inputId = uniqueId('input');
const inputRef = ref<InstanceType<typeof InnerInput>>();
const inputFrameRef = ref<InstanceType<typeof InnerFrame>>();

const formatFn = isFunction(props.format) ? props.format : (d: Date) => format(d, 'yyyy-MM-dd');
const parseFn = isFunction(props.parse) ? props.parse : (str: string) => parse(str, 'yyyy-MM-dd', new Date());

const inputVal = ref(props.modelValue ? formatFn(props.modelValue) : '');
const inputDefVal = ref(props.defaultValue ? formatFn(props.defaultValue) : '');

const currentValue = ref(props.modelValue ?? props.defaultValue);

watchEffect(() => {
  if (currentValue.value) {
    inputVal.value = formatFn(currentValue.value);
  }
});
// panel
const isPicking = ref(true);
const autoHidePanel = ref(false);

// 是否聚焦状态
const isFocus = ref(false);
const onFocus = () => {
  isFocus.value = true;
  isPicking.value = true;
  // emits('focus', value, e);
};

const onBlur = () => {
  isFocus.value = false;
  // emits('blur', value, e);
};

const onChange = (value: string) => {
  emits('change', value);
  emits('update:modelValue', Number(value));
};

const onUpdateModelValue = (value: string) => {
  const d = parseFn(value);
  if (isValidDate(d)) {
    // 严格匹配
    if (formatFn(d) === value) {
      currentValue.value = d;
    }
  }
};

// panel
const togglePanel = (visible: boolean) => {
  isPicking.value = visible;
};
const onConfirm = () => {
  togglePanel(false);
};
</script>
<template>
  <InnerFrame
    ref="inputFrameRef"
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
      :model-value="inputVal"
      :default-value="inputDefVal"
      :input-id="inputId"
      type="text"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      @focus="onFocus"
      @blur="onBlur"
      @update:model-value="onUpdateModelValue"
    />
    <template #suffix>
      <div class="o-dp-icon" @mousedown.prevent>
        <IconCalendar />
      </div>
    </template>
    <InnerPanel v-if="!props.disabled" v-model:visible="isPicking" :target="inputFrameRef" :auto-hide="autoHidePanel" class="o-date-picker-panel">
      <div>
        <DatePane v-model:value="currentValue" @confirm="onConfirm" />
      </div>
    </InnerPanel>
  </InnerFrame>
</template>
