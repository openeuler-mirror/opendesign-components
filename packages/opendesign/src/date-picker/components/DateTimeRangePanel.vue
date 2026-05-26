<script setup lang="ts">
import { computed, inject, nextTick, provide, ref, type Ref } from 'vue';
import { until } from '@vueuse/core';

import { OPopup, type PopupPositionT } from '../../popup';
import ClientOnly from '../../_components/client-only.ts';
import { OButton } from '../../button';
import { OLink } from '../../link';
import { ODivider } from '../../divider';
import { useI18n } from '../../locale';
import { timePickerInjectKey } from '../../time-picker/provide.ts';
import { useTimeRangeConstraints, isTimeBefore, isTimeAfter } from '../../time-picker/use-time-range-constraints.ts';
import TimeColumns from '../../time-picker/components/TimeColumns.vue';

import { datePickerInjectKey } from '../provide.ts';
import { parseValue } from '../utils.ts';
import { DatePickerMode } from '../types.ts';
import DateRangePanelContent from './DateRangePanelContent.vue';

const props = defineProps<{
  target?: HTMLElement;
  optionTitle?: string;
}>();

const emits = defineEmits<{
  (e: 'change', start: number | undefined, end: number | undefined): void;
  (e: 'confirm', start: number | undefined, end: number | undefined): void;
}>();

const visible = ref(false);

const datePickerCtx = inject(datePickerInjectKey)!;
// dateTimeRangePicker provides extra time-constraint fields at runtime
const ctx = datePickerCtx as typeof datePickerCtx & Record<string, any>;
const { size, transition, popupPosition, popupWrapper } = datePickerCtx;

const { t } = useI18n();

const timeFormat = computed(() => {
  const fmt = datePickerCtx.format?.value ?? 'YYYY-MM-DD HH:mm:ss';
  const match = fmt.match(/HH:mm(?::ss)?/);
  return match ? match[0] : 'HH:mm:ss';
});

const hourStep = ctx.hourStep ?? ref(1);
const minuteStep = ctx.minuteStep ?? ref(1);
const secondStep = ctx.secondStep ?? ref(1);

// Provide timePickerInjectKey for TimeColumns
provide(timePickerInjectKey, {
  disabled: datePickerCtx.disabled as Ref<boolean>,
  readonly: datePickerCtx.readonly as Ref<boolean>,
  size: datePickerCtx.size,
  round: datePickerCtx.round,
  noResponsive: datePickerCtx.noResponsive as Ref<boolean>,
  popupPosition: popupPosition as Ref<PopupPositionT>,
  popupWrapper: popupWrapper as Ref<string | HTMLElement | null>,
  transition: datePickerCtx.transition,
  format: timeFormat,
  hourStep,
  minuteStep,
  secondStep,
  disabledHours: ctx.disabledHours ?? ref(undefined),
  disabledMinutes: ctx.disabledMinutes ?? ref(undefined),
  disabledSeconds: ctx.disabledSeconds ?? ref(undefined),
  minTime: computed(() => ctx.minTime?.value ?? (datePickerCtx.minDate?.value ? parseValue(datePickerCtx.minDate.value)?.format('HH:mm:ss') : undefined)),
  maxTime: computed(() => ctx.maxTime?.value ?? (datePickerCtx.maxDate?.value ? parseValue(datePickerCtx.maxDate.value)?.format('HH:mm:ss') : undefined)),
});

// Internal state
// 外层区块：当前是否处于时间选择区（true=TimeColumns，false=DateRangePanelContent）
const isTimeView = ref(false);
// 内层子视图：镜像 DateRangePanelContent 当前的子视图（date/month/year 导航层级）
const currentView = ref<DatePickerMode>('date');
// 当前是否处于主面板（非 month/year 导航层），用于控制底部快捷选项的显隐
const isMainPanel = computed(() => {
  if (isTimeView.value) return false;
  return currentView.value === 'date';
});

const hasBothDates = ref(false);
const popupRef = ref<HTMLDivElement>();
const contentRef = ref<InstanceType<typeof DateRangePanelContent>>();
const startColumnsRef = ref<InstanceType<typeof TimeColumns>>();
const endColumnsRef = ref<InstanceType<typeof TimeColumns>>();

const startTime = ref('00:00:00');
const endTime = ref('23:59:59');

// Cache date timestamps so getMergedStart/End works when contentRef is unmounted (time view)
const cachedStartDate = ref<number | undefined>();
const cachedEndDate = ref<number | undefined>();

// Same-day constraint: when both dates are the same day, apply cross time constraints
const isSameDay = computed(() => {
  if (!cachedStartDate.value || !cachedEndDate.value) return false;
  const s = new Date(cachedStartDate.value);
  const e = new Date(cachedEndDate.value);
  return s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate();
});

const { maxStartTime: sameDayMaxStart, minEndTime: sameDayMinEnd } = useTimeRangeConstraints({
  startTime,
  endTime,
  format: timeFormat,
  hourStep,
  minuteStep,
  secondStep,
  enabled: isSameDay,
});

// --- Merge date + time ---
const getMergedStart = (): number | undefined => {
  const dateTs = contentRef.value?.getValue().start ?? cachedStartDate.value;
  if (!dateTs) return undefined;
  const timeStr = startColumnsRef.value?.getValue() ?? startTime.value;
  const [h = 0, m = 0, s = 0] = timeStr.split(':').map(Number);
  return new Date(dateTs).setHours(h, m, s, 0);
};

const getMergedEnd = (): number | undefined => {
  const dateTs = contentRef.value?.getValue().end ?? cachedEndDate.value;
  if (!dateTs) return undefined;
  const timeStr = endColumnsRef.value?.getValue() ?? endTime.value;
  const [h = 23, m = 59, s = 59] = timeStr.split(':').map(Number);
  return new Date(dateTs).setHours(h, m, s, 999);
};

const initTimeFromTs = (ts: number | undefined, fallback: string): string => {
  if (!ts) return fallback;
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

// --- Open / Close ---
const open = async (start?: number, end?: number) => {
  if (visible.value) return;
  visible.value = true;
  isTimeView.value = false;
  hasBothDates.value = start !== undefined && end !== undefined;
  cachedStartDate.value = start;
  cachedEndDate.value = end;
  await until(contentRef).toBeTruthy();
  contentRef.value!.init(start, end);
  startTime.value = initTimeFromTs(start, '00:00:00');
  endTime.value = initTimeFromTs(end, '23:59:59');
};

const close = () => {
  visible.value = false;
};

const setValueFromShortcut = (start: number | undefined, end: number | undefined) => {
  contentRef.value?.setValue(start, end);
  hasBothDates.value = start !== undefined && end !== undefined;
  cachedStartDate.value = start;
  cachedEndDate.value = end;
  startTime.value = initTimeFromTs(start, '00:00:00');
  endTime.value = initTimeFromTs(end, '23:59:59');
  if (isTimeView.value) {
    nextTick(() => {
      startColumnsRef.value?.setValue(startTime.value);
      endColumnsRef.value?.setValue(endTime.value);
    });
  }
};

// --- Event handlers ---
const handleDateChange = (start: number | undefined, end: number | undefined) => {
  hasBothDates.value = start !== undefined && end !== undefined;
  cachedStartDate.value = start;
  cachedEndDate.value = end;
  if (hasBothDates.value) {
    emits('change', getMergedStart(), getMergedEnd());
  }
};

const handleTimeStartChange = (val: string | undefined) => {
  if (!val) return;
  startTime.value = val;
  if (endTime.value && sameDayMinEnd.value && isTimeBefore(endTime.value, sameDayMinEnd.value)) {
    endTime.value = sameDayMinEnd.value;
    endColumnsRef.value?.setValue(endTime.value);
    endColumnsRef.value?.scrollAllToSelected(true);
  }
};

const handleTimeEndChange = (val: string | undefined) => {
  if (!val) return;
  endTime.value = val;
  if (startTime.value && sameDayMaxStart.value && isTimeAfter(startTime.value, sameDayMaxStart.value)) {
    startTime.value = sameDayMaxStart.value;
    startColumnsRef.value?.setValue(startTime.value);
    startColumnsRef.value?.scrollAllToSelected(true);
  }
};

const handleConfirm = () => {
  emits('confirm', getMergedStart(), getMergedEnd());
  close();
};

// When switching to time view, save dates and initialize TimeColumns
const handleSwitchToTime = () => {
  cachedStartDate.value = contentRef.value?.getValue().start ?? cachedStartDate.value;
  cachedEndDate.value = contentRef.value?.getValue().end ?? cachedEndDate.value;
  isTimeView.value = true;
  nextTick(() => {
    startColumnsRef.value?.setValue(startTime.value);
    startColumnsRef.value?.scrollAllToSelected(false);
    endColumnsRef.value?.setValue(endTime.value);
    endColumnsRef.value?.scrollAllToSelected(false);
  });
};

// When switching back to date view, save current time selections
const handleSwitchToDate = () => {
  const sv = startColumnsRef.value?.getValue();
  if (sv) startTime.value = sv;
  const ev = endColumnsRef.value?.getValue();
  if (ev) endTime.value = ev;
  isTimeView.value = false;
};

const toggleView = () => {
  if (!isTimeView.value) {
    handleSwitchToTime();
  } else {
    handleSwitchToDate();
  }
};

defineExpose({
  getPopupEl: () => popupRef.value,
  open,
  close,
  setValue: setValueFromShortcut,
});
</script>

<template>
  <ClientOnly>
    <OPopup
      v-model:visible="visible"
      :class="['o-date-panel', `o-date-panel-${size}`, 'o-time-panel', `o-time-panel-${size}`, 'o-date-range-panel', 'o-datetime-range-panel']"
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
        <!-- Date view -->
        <template v-if="!isTimeView">
          <DateRangePanelContent ref="contentRef" v-model:current-view="currentView" @change="handleDateChange" />
        </template>

        <!-- Time view -->
        <template v-else>
          <div class="o-date-range-panel-body">
            <div class="o-date-range-panel-side o-time-panel-content">
              <TimeColumns ref="startColumnsRef" :max-time="sameDayMaxStart" @change="handleTimeStartChange" />
            </div>
            <div class="o-date-range-panel-side o-time-panel-content">
              <TimeColumns ref="endColumnsRef" :min-time="sameDayMinEnd" @change="handleTimeEndChange" />
            </div>
          </div>
        </template>
        <template v-if="currentView === 'date'">
          <ODivider class="o-date-panel-divider" />
          <div class="o-date-panel-footer">
            <span :class="['o-date-panel-shortcut', { hidden: !isMainPanel }]">
              <slot name="shortcut" :set-value="setValueFromShortcut" :emit-change="() => emits('change', getMergedStart(), getMergedEnd())" />
            </span>
            <span>
              <OLink color="primary" :hover-underline="false" :disabled="!hasBothDates" @click="toggleView">
                {{ !isTimeView ? t('datePicker.selectTime') : t('datePicker.selectDate') }}
              </OLink>
              <OButton round="pill" :disabled="!hasBothDates" @click="handleConfirm">{{ t('select.confirm') }}</OButton>
            </span>
          </div>
        </template>
      </div>
    </OPopup>
  </ClientOnly>
</template>
