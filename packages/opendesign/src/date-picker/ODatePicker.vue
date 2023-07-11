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
import { isFunction, isValidDate } from '../_utils/is';
import { getRealDateValue, normalizeDateValue } from './date';

const props = defineProps(datePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | Date | number): void;
  (e: 'change', value: string | Date | number): void;
  (e: 'blur', value: string | Date | number, inputValue?: string, evt?: FocusEvent): void;
  (e: 'focus', value: string | Date | number, inputValue?: string, evt?: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const inputId = uniqueId('input');
const inputRef = ref<InstanceType<typeof InnerInput>>();
const inputFrameRef = ref<InstanceType<typeof InnerFrame>>();

const formatFn = isFunction(props.format) ? props.format : (d: Date) => format(d, 'yyyy-MM-dd');
const parseFn = isFunction(props.parse) ? props.parse : (str: string) => parse(str, 'yyyy-MM-dd', new Date());

const dateValue = computed(() => normalizeDateValue(props.modelValue ?? props.defaultValue, parseFn));

const inputVal = ref(dateValue.value.value ? formatFn(dateValue.value.value) : '');

const currentValue = ref<Date | null>(dateValue.value.value);

watchEffect(() => {
  if (currentValue.value) {
    inputVal.value = formatFn(currentValue.value);
  }
});

let realValue = getRealDateValue(dateValue.value.value, dateValue.value.type, formatFn);
const onChange = (value: Date | null) => {
  realValue = getRealDateValue(value, dateValue.value.type, formatFn);
  emits('change', realValue);
  emits('update:modelValue', realValue);
};

// panel
const isPicking = ref(true);
const autoHidePanel = ref(false);

// 是否聚焦状态
const isFocus = ref(false);
const onFocus = (value: string, evt: FocusEvent) => {
  isFocus.value = true;
  isPicking.value = true;
  emits('focus', realValue, value, evt);
};

const onBlur = (value: string, evt: FocusEvent) => {
  isFocus.value = false;
  emits('blur', realValue, value, evt);
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
  onChange(currentValue.value);
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
        <DatePane v-model:value="currentValue" :shortcuts="props.shortcuts" :confirm-btn="props.confirmBtn" @confirm="onConfirm">
          <template #day-cell="data">
            <slot name="day-cell" v-bind="data"></slot>
          </template>
        </DatePane>
      </div>
    </InnerPanel>
  </InnerFrame>
</template>
