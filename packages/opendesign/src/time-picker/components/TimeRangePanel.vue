<script setup lang="ts">
import { computed, inject, nextTick, ref, toValue } from 'vue';
import { until } from '@vueuse/core';
import dayjs from 'dayjs';

import { OPopup } from '../../popup';
import ClientOnly from '../../_components/client-only.ts';
import { OButton } from '../../button';
import { ODivider } from '../../divider';
import { useI18n } from '../../locale';
import { TimePickerRangeShortcutSlotProps } from '../types.ts';
import { timePickerInjectKey } from '../provide.ts';
import { useTimeRangeConstraints, isTimeBefore, isTimeAfter, TIME_PREFIX } from '../use-time-range-constraints.ts';
import { useTimePickerOptions } from '../use-time-picker-options.ts';
import { findNearestTime } from '../find-nearest-time.ts';
import TimeColumns from './TimeColumns.vue';

const props = defineProps<{
  target?: HTMLElement;
  optionTitle?: string;
}>();

const emits = defineEmits<{
  (e: 'change', start: string | undefined, end: string | undefined): void;
  (e: 'confirm', start: string | undefined, end: string | undefined): void;
}>();

defineSlots<{
  shortcut(props: TimePickerRangeShortcutSlotProps): any;
}>();

const timePickerCtx = inject(timePickerInjectKey)!;
const {
  size,
  transition,
  popupPosition,
  popupWrapper,
  format,
  hourStep,
  minuteStep,
  secondStep,
  minTime,
  maxTime,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
} = timePickerCtx;

const defaultOptions = useTimePickerOptions({
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime,
  maxTime,
  selectedHour: ref(null),
  selectedMinute: ref(null),
});

const { t } = useI18n();

const visible = ref(false);
const startTime = ref<string | undefined>();
const endTime = ref<string | undefined>();
const startColumnsRef = ref<InstanceType<typeof TimeColumns>>();
const endColumnsRef = ref<InstanceType<typeof TimeColumns>>();
const popupRef = ref<HTMLDivElement>();

const hasBothTimes = computed(() => !!startTime.value && !!endTime.value);

const { maxStartTime, minEndTime } = useTimeRangeConstraints({
  startTime,
  endTime,
  format,
  hourStep,
  minuteStep,
  secondStep,
});

const computeDefaultEnd = (startStr: string): string | undefined => {
  const startDayjs = dayjs(TIME_PREFIX + startStr);
  const endTarget = startDayjs.add(1, 'hour');
  return findNearestTime({
    hourOptions: defaultOptions.hourOptions.value,
    minuteOptions: defaultOptions.minuteOptions.value,
    secondOptions: defaultOptions.secondOptions.value,
    minTime: startStr,
    maxTime: toValue(maxTime),
    disabledHours: toValue(disabledHours),
    disabledMinutes: toValue(disabledMinutes),
    disabledSeconds: toValue(disabledSeconds),
    target: { hour: endTarget.hour(), minute: endTarget.minute(), second: endTarget.second() },
    format: format.value,
  });
};

const open = async (start?: string, end?: string) => {
  if (visible.value) return;
  visible.value = true;

  if (!start && !end) {
    const now = dayjs();
    const defaultStart = findNearestTime({
      hourOptions: defaultOptions.hourOptions.value,
      minuteOptions: defaultOptions.minuteOptions.value,
      secondOptions: defaultOptions.secondOptions.value,
      minTime: toValue(minTime),
      maxTime: toValue(maxTime),
      disabledHours: toValue(disabledHours),
      disabledMinutes: toValue(disabledMinutes),
      disabledSeconds: toValue(disabledSeconds),
      target: { hour: now.hour(), minute: now.minute(), second: now.second() },
      format: format.value,
    });
    startTime.value = defaultStart;
    endTime.value = defaultStart ? computeDefaultEnd(defaultStart) : undefined;
  } else {
    startTime.value = start;
    endTime.value = end;
  }

  await until(startColumnsRef).toBeTruthy();
  await nextTick();
  startColumnsRef.value?.setValue(startTime.value);
  startColumnsRef.value?.scrollAllToSelected(false);
  endColumnsRef.value?.setValue(endTime.value);
  endColumnsRef.value?.scrollAllToSelected(false);
};

const close = () => {
  visible.value = false;
};

const handleStartChange = (val: string | undefined) => {
  startTime.value = val;
  if (endTime.value && minEndTime.value && isTimeBefore(endTime.value, minEndTime.value)) {
    endTime.value = minEndTime.value;
    endColumnsRef.value?.setValue(endTime.value);
    endColumnsRef.value?.scrollAllToSelected(true);
  }
  emits('change', startTime.value, endTime.value);
};

const handleEndChange = (val: string | undefined) => {
  endTime.value = val;
  if (startTime.value && maxStartTime.value && isTimeAfter(startTime.value, maxStartTime.value)) {
    startTime.value = maxStartTime.value;
    startColumnsRef.value?.setValue(startTime.value);
    startColumnsRef.value?.scrollAllToSelected(true);
  }
  emits('change', startTime.value, endTime.value);
};

const handleConfirm = () => {
  emits('confirm', startTime.value, endTime.value);
  close();
};

const shortcutSetValue = (start?: string, end?: string) => {
  if (start !== undefined) {
    startTime.value = start;
    startColumnsRef.value?.setValue(start);
    startColumnsRef.value?.scrollAllToSelected(true);
  }
  if (end !== undefined) {
    endTime.value = end;
    endColumnsRef.value?.setValue(end);
    endColumnsRef.value?.scrollAllToSelected(true);
  }
};

const shortcutEmitChange = () => emits('change', startTime.value, endTime.value);

const setStartValue = (val: string | undefined) => {
  startTime.value = val;
  startColumnsRef.value?.setValue(val);
};

const setEndValue = (val: string | undefined) => {
  endTime.value = val;
  endColumnsRef.value?.setValue(val);
};

defineExpose({
  getPopupEl: () => popupRef.value,
  open,
  close,
  setStartValue,
  setEndValue,
});
</script>

<template>
  <ClientOnly>
    <OPopup
      v-model:visible="visible"
      :class="['o-time-panel', `o-time-panel-${size}`, 'o-time-range-panel']"
      hide-close
      :target="props.target"
      :transition="transition"
      :position="popupPosition"
      :wrapper="popupWrapper"
      trigger="none"
      :offset="4"
      :adjust-min-width="false"
      :adjust-width="false"
    >
      <div ref="popupRef">
        <div class="o-time-range-panel-body">
          <div class="o-time-range-panel-side o-time-panel-content">
            <TimeColumns ref="startColumnsRef" :max-time="maxStartTime" @change="handleStartChange" />
          </div>
          <div class="o-time-range-panel-side o-time-panel-content">
            <TimeColumns ref="endColumnsRef" :min-time="minEndTime" @change="handleEndChange" />
          </div>
        </div>
        <ODivider class="o-time-panel-divider" />
        <div class="o-time-panel-footer">
          <span class="o-time-panel-shortcut">
            <slot name="shortcut" :set-value="shortcutSetValue" :emit-change="shortcutEmitChange" />
          </span>
          <OButton round="pill" :disabled="!hasBothTimes" @click="handleConfirm">{{ t('select.confirm') }}</OButton>
        </div>
      </div>
    </OPopup>
  </ClientOnly>
</template>
