<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue';
import { dateRangePickerProps, TimeValueT } from './types';
import { InnerFrame } from '../_components/inner-frame';
import { InnerInput } from '../_components/inner-input';
import { InnerPanel } from '../_components/inner-panel';
import { uniqueId } from '../_utils/helper';
import { IconCalendar } from '../_utils/icons';
import PickerPane from './PickerPane.vue';
import { isArray, isFunction, isValidDate } from '../_utils/is';
import { getRealDateValue, normalizeDateValue, DefaultFormatString } from './date';
import { formatDate, parseDate } from '../_utils/date';

const props = defineProps(dateRangePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Array<Date | string | number>): void;
  (e: 'change', value: Array<Date | string | number>): void;
  (e: 'blur', value: Array<Date | string | number>, inputValue?: Array<string>, evt?: FocusEvent): void;
  (e: 'focus', value: Array<Date | string | number>, inputValue?: Array<string>, evt?: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', value: Array<string>, evt: KeyboardEvent): void;
}>();

const inputId = uniqueId('input');
const inputRef1 = ref<InstanceType<typeof InnerInput>>();
const inputRef2 = ref<InstanceType<typeof InnerInput>>();
const inputFrameRef = ref<InstanceType<typeof InnerFrame>>();
const isRange = computed(() => /-range/.test(props.mode));
const pickerMode = computed(() => props.mode.replace('-range', '') as keyof typeof DefaultFormatString);

const formateString = computed(() => props.formatString || DefaultFormatString[pickerMode.value]);

const formatFn = isFunction(props.format)
  ? props.format
  : (d: Date) => {
      try {
        return formatDate(d, formateString.value);
      } catch {
        return '';
      }
    };
const parseFn = isFunction(props.parse)
  ? props.parse
  : (str: string) => {
      try {
        return parseDate(str, formateString.value, new Date());
      } catch {
        return new Date(NaN);
      }
    };

// 外部输入值，包含类型及值
const inValue = computed(() => {
  const value = props.modelValue ?? props.defaultValue;
  const v = isArray(value) ? value[0] : value;
  return normalizeDateValue(v, parseFn);
});
const inValue2 = computed(() => {
  if (!isRange.value) {
    return '';
  }
  const value = props.modelValue ?? props.defaultValue;
  if (isArray(value)) {
    return normalizeDateValue(value[1], parseFn);
  }
  return '';
});

const inputVal = ref(inValue.value.value ? formatFn(inValue.value.value) : '');
const inputVal2 = ref(inValue2.value && inValue2.value?.value ? formatFn(inValue2.value.value) : '');

console.log(inputVal.value, inputVal2.value);

const currentValue = ref<Date>(inValue.value.value);

const isPicking = ref(false);

watch(
  () => inValue.value,
  (v) => {
    currentValue.value = v.value;
  }
);

watchEffect(() => {
  if (currentValue.value) {
    inputVal.value = formatFn(currentValue.value);

    if (isPicking.value) {
      inputRef1.value?.focus();
    }
  }
});

let realValue = getRealDateValue(inValue.value.value, inValue.value.type, formatFn);

let lastValue = 0;
const onChange = (value: Date) => {
  if (lastValue === value.getTime()) {
    return;
  }
  inputVal.value = formatFn(value);

  lastValue = value.getTime();

  realValue = getRealDateValue(value, inValue.value.type, formatFn);

  emits('change', realValue);
  emits('update:modelValue', realValue);
};

// panel
const togglePanel = (visible?: boolean) => {
  if (visible === undefined) {
    isPicking.value = !isPicking.value;
  } else {
    isPicking.value = visible;
  }
};
const onConfirm = (visible?: boolean) => {
  togglePanel(visible);
  onChange(currentValue.value);
};

const onClear = () => {
  currentValue.value = new Date(NaN);
};

// 是否聚焦状态
const isFocus = ref(false);
const onFocus = (value: string, evt: FocusEvent) => {
  if (isFocus.value) {
    return;
  }
  isFocus.value = true;
  togglePanel(true);

  emits('focus', realValue, value, evt);
};

const onBlur = (value: string, evt: FocusEvent) => {
  isFocus.value = false;
  // togglePanel(false);

  onChange(currentValue.value);

  emits('blur', realValue, value, evt);
};

const onPressEnter = () => {
  onConfirm();
};

const onUpdateModelValue = (value: string) => {
  if (inputVal.value === value) {
    return;
  }
  inputVal.value = value;

  const d = parseFn(value);
  if (isValidDate(d)) {
    // 严格匹配
    if (formatFn(d) === value) {
      currentValue.value = d;
    }
  }
};

const onTimePaneChange = (value: TimeValueT) => {
  console.log(value);
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
      ref="inputRef1"
      :model-value="inputVal"
      :input-id="inputId"
      type="text"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :clearable="props.clearable"
      @clear="onClear"
      @focus="onFocus"
      @blur="onBlur"
      @press-enter="onPressEnter"
      @update:model-value="onUpdateModelValue"
    />
    <InnerInput
      v-if="isRange"
      ref="inputRef2"
      :model-value="inputVal2"
      type="text"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :clearable="props.clearable"
      @clear="onClear"
      @focus="onFocus"
      @blur="onBlur"
      @press-enter="onPressEnter"
      @update:model-value="onUpdateModelValue"
    />
    <template #suffix>
      <div class="o-dp-icon" @mousedown.prevent>
        <IconCalendar />
      </div>
    </template>

    <InnerPanel
      v-if="!props.disabled"
      v-model:visible="isPicking"
      :target="inputFrameRef"
      class="o-date-picker-panel"
      :adjust-min-width="false"
      :adjust-width="false"
      @mousedown.prevent
    >
      <div>
        <PickerPane
          v-model:value="currentValue"
          :formate-string="formateString"
          :shortcuts="props.shortcuts"
          :confirm-btn="props.needConfirm"
          :confirm-label="props.confirmLabel"
          :mode="pickerMode"
          :range="isRange"
          :disable-cell="props.disableCell"
          :disable-time-cell="props.disableTimeCell"
          :display-year-list="props.displayYearList"
          :display-month-list="props.displayMonthList"
          :display-day-list="props.displayDayList"
          @confirm="() => onConfirm(false)"
          @clear="onClear"
        >
          <!-- <template #day-cell="data">
            <slot name="day-cell" v-bind="data"></slot>
          </template> -->
        </PickerPane>
        <!-- <TimePane view-align="top" @change="onTimePaneChange" /> -->
      </div>
    </InnerPanel>
  </InnerFrame>
</template>
