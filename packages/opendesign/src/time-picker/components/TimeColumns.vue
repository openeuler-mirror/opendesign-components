<script setup lang="ts">
import { ref, computed, nextTick, inject } from 'vue';

import { ODivider } from '../../divider';
import { getRoundClass } from '../../_utils/style-class.ts';
import { dateTimeNumberToString, stringToDateTimeNumber } from '../../_utils/time.ts';
import { useScreen } from '../../hooks';
import { type DatePickerColumnOption } from '../types.ts';

import { timePickerInjectKey } from '../provide.ts';
import TimeColumn from './TimeColumn.vue';
import { useTimePickerOptions } from '../use-time-picker-options.ts';

const props = defineProps<{
  minTime?: string;
  maxTime?: string;
}>();

const timePickerCtx = inject(timePickerInjectKey)!;
const {
  format,
  hourStep,
  minuteStep,
  secondStep,
  noResponsive,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime: contextMinTime,
  maxTime: contextMaxTime,
} = timePickerCtx;

const effectiveMinTime = computed(() => props.minTime ?? contextMinTime?.value);
const effectiveMaxTime = computed(() => props.maxTime ?? contextMaxTime?.value);

const emits = defineEmits<{
  (e: 'change', newVal: string | undefined): void;
}>();

const { isPhonePad } = useScreen();
const isResponding = computed(() => !noResponsive?.value && isPhonePad.value);

const round = getRoundClass({ round: timePickerCtx.round?.value }, 'time-picker-columns');

const showSecond = computed(() => format.value.toLowerCase().includes('s'));

const selectedHour = ref<number | null>(null);
const selectedMinute = ref<number | null>(null);
const selectedSecond = ref<number | null>(null);

// 当无 minTime/maxTime 局部覆盖时，直接使用父组件预计算的共享选项，避免重复计算
const hasLocalConstraints = computed(() => !!props.minTime || !!props.maxTime);
const injectedOptions = computed(() => (!hasLocalConstraints.value ? timePickerCtx.computedOptions : undefined));

const localOptions = useTimePickerOptions({
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime: effectiveMinTime,
  maxTime: effectiveMaxTime,
  selectedHour,
  selectedMinute,
});

const hourOptions = computed(() => injectedOptions.value?.hourOptions.value ?? localOptions.hourOptions.value);
const minuteOptions = computed(() => injectedOptions.value?.minuteOptions.value ?? localOptions.minuteOptions.value);
const secondOptions = computed(() => injectedOptions.value?.secondOptions.value ?? localOptions.secondOptions.value);
const disabledHourOptions = computed(() => injectedOptions.value?.disabledHourOptions.value ?? localOptions.disabledHourOptions.value);
const { disabledMinuteOptions, disabledSecondOptions } = localOptions;

const hourIndex = computed(() => {
  if (selectedHour.value === null) return -1;
  return hourOptions.value.findIndex((opt) => opt.value === selectedHour.value);
});
const minuteIndex = computed(() => {
  if (selectedMinute.value === null) return -1;
  return minuteOptions.value.findIndex((opt) => opt.value === selectedMinute.value);
});
const secondIndex = computed(() => {
  if (selectedSecond.value === null) return -1;
  return secondOptions.value.findIndex((opt) => opt.value === selectedSecond.value);
});

const hourColumnRef = ref<InstanceType<typeof TimeColumn>>();
const minuteColumnRef = ref<InstanceType<typeof TimeColumn>>();
const secondColumnRef = ref<InstanceType<typeof TimeColumn>>();

// 滚动所有列到选中值的位置
const scrollAllToSelected = async (smooth = false) => {
  await nextTick();
  if (hourIndex.value >= 0) {
    hourColumnRef.value?.scrollToItem(smooth);
  }
  if (minuteIndex.value >= 0) {
    minuteColumnRef.value?.scrollToItem(smooth);
  }
  if (secondIndex.value >= 0) {
    secondColumnRef.value?.scrollToItem(smooth);
  }
};
// 若传入值不在可用选项中（step 裁剪或被禁用），则就近吸附到最近的可用项，确保 `.active` 始终有效。
// disabledMinuteOptions 依赖 selectedHour、disabledSecondOptions 依赖 selectedHour + selectedMinute，
// 因此三列须按顺序依次 snap，Vue 3 computed 惰性求值会在每次访问时用最新的 selected 值重算。
const snapToOption = (options: DatePickerColumnOption[], disabledOptions: number[], value: number): number => {
  const enabled = options.filter((opt) => !disabledOptions.includes(opt.value));
  const pool = enabled.length > 0 ? enabled : options;
  if (pool.some((opt) => opt.value === value)) return value;
  return pool.reduce((nearest, opt) => (Math.abs(opt.value - value) < Math.abs(nearest - value) ? opt.value : nearest), pool[0].value);
};

const setValue = (value?: Date | string) => {
  if (value instanceof Date) {
    selectedHour.value = snapToOption(hourOptions.value, disabledHourOptions.value, value.getHours());
    selectedMinute.value = snapToOption(minuteOptions.value, disabledMinuteOptions.value, value.getMinutes());
    selectedSecond.value = snapToOption(secondOptions.value, disabledSecondOptions.value, value.getSeconds());
  } else if (value) {
    const { hour, minute, second } = stringToDateTimeNumber(value, { timeOnly: true }) || { hour: null, minute: null, second: null };
    selectedHour.value = hour !== null ? snapToOption(hourOptions.value, disabledHourOptions.value, hour) : null;
    selectedMinute.value = minute !== null ? snapToOption(minuteOptions.value, disabledMinuteOptions.value, minute) : null;
    selectedSecond.value = second !== null ? snapToOption(secondOptions.value, disabledSecondOptions.value, second) : null;
  } else {
    selectedHour.value = null;
    selectedMinute.value = null;
    selectedSecond.value = null;
  }
  scrollAllToSelected(false);
};
const getValue = () => {
  return dateTimeNumberToString(
    { hour: selectedHour.value ?? 0, minute: selectedMinute.value ?? 0, second: selectedSecond.value ?? 0 },
    { timeOnly: true, format: format.value },
  );
};

const handleChange = () => {
  emits('change', getValue());
};
const handleHourChange = () => {
  if (selectedMinute.value === null) {
    selectedMinute.value = 0;
    minuteColumnRef.value?.scrollToItem(true);
  }
  if (showSecond.value && selectedSecond.value === null) {
    selectedSecond.value = 0;
    secondColumnRef.value?.scrollToItem(true);
  }
  handleChange();
};
const handleMinuteChange = () => {
  if (selectedHour.value === null) {
    selectedHour.value = 0;
    hourColumnRef.value?.scrollToItem(true);
  }
  if (showSecond.value && selectedSecond.value === null) {
    selectedSecond.value = 0;
    secondColumnRef.value?.scrollToItem(true);
  }
  handleChange();
};
const handleSecondChange = () => {
  if (selectedHour.value === null) {
    selectedHour.value = 0;
    hourColumnRef.value?.scrollToItem(true);
  }
  if (selectedMinute.value === null) {
    selectedMinute.value = 0;
    minuteColumnRef.value?.scrollToItem(true);
  }
  handleChange();
};

defineExpose({
  scrollAllToSelected,
  setValue,
  getValue,
});
</script>

<template>
  <div :class="['o-time-panel-columns', round.class.value]" :style="round.style.value">
    <div v-if="isResponding" class="o-time-panel-mask" />
    <TimeColumn
      ref="hourColumnRef"
      v-model="selectedHour"
      :options="hourOptions"
      :disabled-options="disabledHourOptions"
      :no-responsive="noResponsive"
      @change="handleHourChange"
    />
    <ODivider v-if="!isResponding" direction="v" class="o-time-panel-column-divider" />
    <TimeColumn
      ref="minuteColumnRef"
      v-model="selectedMinute"
      :options="minuteOptions"
      :disabled-options="disabledMinuteOptions"
      :no-responsive="noResponsive"
      @change="handleMinuteChange"
    />
    <template v-if="showSecond">
      <ODivider v-if="!isResponding" direction="v" class="o-time-panel-column-divider" />
      <TimeColumn
        ref="secondColumnRef"
        v-model="selectedSecond"
        :options="secondOptions"
        :disabled-options="disabledSecondOptions"
        :no-responsive="noResponsive"
        @change="handleSecondChange"
      />
    </template>
  </div>
</template>
