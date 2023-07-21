<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { datePickerProps, TimeValueT } from './types';
import { InnerFrame } from '../_components/inner-frame';
import { InnerInput } from '../_components/inner-input';
import { InnerPanel } from '../_components/inner-panel';
import { uniqueId } from '../_utils/helper';
import { IconCalendar } from '../_utils/icons';
import PickerPane from './PickerPane.vue';
import { format, parse } from 'date-fns';
import { isFunction, isValidDate } from '../_utils/is';
import { getRealDateValue, normalizeDateValue, DefaultFormatString } from './date';

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

const formateString = computed(() => {
  if (props.formatString) {
    return props.formatString;
  }
  type FST = keyof typeof DefaultFormatString;

  let key: FST = props.mode as FST;
  if (props.mode === 'month' && !props.yearSelectable) {
    key = 'monthOnly';
  }
  return DefaultFormatString[key];
});

const formatFn = isFunction(props.format)
  ? props.format
  : (d: Date) => {
      try {
        return format(d, formateString.value);
      } catch {
        return '';
      }
    };
const parseFn = isFunction(props.parse)
  ? props.parse
  : (str: string) => {
      try {
        return parse(str, formateString.value, new Date());
      } catch {
        return new Date(NaN);
      }
    };

// 外部输入值，包含类型及值
const inValue = computed(() => normalizeDateValue(props.modelValue ?? props.defaultValue, parseFn));
console.log('inValue', inValue.value);

const inputVal = ref(inValue.value.value ? formatFn(inValue.value.value) : '');

const currentValue = ref<Date>(inValue.value.value);

const isPicking = ref(false);

watchEffect(() => {
  if (currentValue.value) {
    inputVal.value = formatFn(currentValue.value);

    if (isPicking.value) {
      inputRef.value?.focus();
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
  togglePanel(false);

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
  if (d && isValidDate(d)) {
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
      ref="inputRef"
      :model-value="inputVal"
      :input-id="inputId"
      type="text"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
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
      :auto-hide="false"
      class="o-date-picker-panel"
      :adjust-min-width="false"
      :adjust-width="false"
      @mousedown.prevent
    >
      <div>
        <PickerPane
          v-model:value="currentValue"
          :shortcuts="props.shortcuts"
          :confirm-btn="props.needConfirm"
          :confirm-label="props.confirmLabel"
          :mode="props.mode"
          :year-selectable="props.yearSelectable"
          :disable-cell="props.disableCell"
          :display-year-list="props.displayYearList"
          :display-month-list="props.displayMonthList"
          :display-day-list="props.displayDayList"
          :formate-string="formateString"
          @confirm="() => onConfirm(false)"
        >
          <template #day-cell="data">
            <slot name="day-cell" v-bind="data"></slot>
          </template>
        </PickerPane>
        <!-- <TimePane view-align="top" @change="onTimePaneChange" /> -->
      </div>
    </InnerPanel>
  </InnerFrame>
</template>
