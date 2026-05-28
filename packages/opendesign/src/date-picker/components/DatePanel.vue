<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue';
import { until } from '@vueuse/core';
import dayjs, { Dayjs } from 'dayjs';

import { ODialog } from '../../dialog';
import { OPopup } from '../../popup';
import ClientOnly from '../../_components/client-only.ts';
import { OButton } from '../../button';
import { ODivider } from '../../divider';
import { OTab, OTabPane } from '../../tab';
import { useI18n } from '../../locale';
import { useScreen } from '../../hooks';
import { isEmptySlot } from '../../_utils/vue-utils.ts';
import TimeColumns from '../../time-picker/components/TimeColumns.vue';

import { DatePickerMode } from '../types.ts';
import { datePickerInjectKey } from '../provide.ts';
import { parseValue } from '../utils.ts';
import { useCalendar } from '../use-calendar.ts';
import DatePanelHeader from './DatePanelHeader.vue';
import DatePanelCalendar from './DatePanelCalendar.vue';
import DatePanelMonth from './DatePanelMonth.vue';
import DatePanelYear from './DatePanelYear.vue';
import DatePanelTime from './DatePanelTime.vue';
import DateColumns from './DateColumns.vue';

const props = defineProps<{
  target?: HTMLElement;
  optionTitle?: string;
}>();
const emits = defineEmits<{
  (e: 'cancel'): void;
  (e: 'change', newVal: number | undefined): void;
  (e: 'confirm', value: number | undefined): void;
  (e: 'preview', value: number | undefined): void;
}>();

const calendarPanelRef = ref<InstanceType<typeof DatePanelCalendar>>();
const monthPanelRef = ref<InstanceType<typeof DatePanelMonth>>();
const yearPanelRef = ref<InstanceType<typeof DatePanelYear>>();
const datePanelTimeRef = ref<InstanceType<typeof DatePanelTime>>();
const dateColumnsRef = ref<InstanceType<typeof DateColumns>>();
const timeColumnsRef = ref<InstanceType<typeof TimeColumns>>();

const visible = ref(false);
const setVisible = (newVal: boolean) => {
  visible.value = newVal;
  if (!newVal) {
    emits('cancel');
  }
};

const datePickerCtx = inject(datePickerInjectKey)!;
const {
  size,
  transition,
  popupPosition,
  popupWrapper,
  noResponsive,
  mode: effectiveMode,
  format,
  disabledDate,
  disabledMonth,
  disabledYear,
  minDate,
  maxDate,
} = datePickerCtx;

// dayStartOfWeek 仅在 date/datetime 模式的 props 中存在，year/month 模式下为 undefined，需提供默认值
const safeDayStartOfWeek = computed(() => datePickerCtx.dayStartOfWeek?.value ?? 1);

const timeFormat = computed(() => {
  const match = format?.value?.match(/HH:mm(?::ss)?/);
  return match ? match[0] : 'HH:mm:ss';
});

const parsedMinDate = computed(() => {
  return minDate?.value ? parseValue(minDate.value) : null;
});
const parsedMaxDate = computed(() => {
  return maxDate?.value ? parseValue(maxDate.value) : null;
});

const { t } = useI18n();
const { isPhonePad } = useScreen();

const isResponding = computed(() => {
  return !noResponsive?.value && isPhonePad.value;
});

const popupRef = ref<HTMLDivElement>();

// 移动端 datetime 模式切换状态
const mobileDateTimeTab = ref<'date' | 'time'>('date');

watch(effectiveMode, () => {
  mobileDateTimeTab.value = 'date';
});

// 面板显示状态；初始为 0，mount 后赋值，避免 SSR/CSR 时间戳不一致
const displayYear = ref(0);
const displayMonth = ref(0);

onMounted(() => {
  if (!displayYear.value) {
    displayYear.value = dayjs().year();
    displayMonth.value = dayjs().month();
  }
});
const selectedDate = ref<Dayjs | null>(null);
const pendingTimeStr = ref('00:00:00');
const currentView = ref<DatePickerMode>('date');

const { rows, weekDayHeaders } = useCalendar({
  displayYear,
  displayMonth,
  selectedDate,
  dayStartOfWeek: safeDayStartOfWeek,
  disabledDate,
  minDate: parsedMinDate,
  maxDate: parsedMaxDate,
});

const isMainPanel = computed(() => {
  if (effectiveMode.value === 'year') return currentView.value === 'year';
  if (effectiveMode.value === 'month') return currentView.value === 'month';
  return currentView.value === 'date';
});

const getValue = () => {
  if (!selectedDate.value) return undefined;
  if (effectiveMode.value === 'datetime') {
    let timeStr = '00:00:00';
    if (isResponding.value) {
      timeStr = timeColumnsRef.value?.getValue() ?? pendingTimeStr.value;
    } else {
      timeStr = datePanelTimeRef.value?.getValue() ?? '00:00:00';
    }
    const [h = 0, m = 0, s = 0] = timeStr.split(':').map(Number);
    return selectedDate.value.hour(h).minute(m).second(s).valueOf();
  }
  return selectedDate.value.valueOf();
};

const isColumnMode = computed(
  () =>
    isResponding.value &&
    (effectiveMode.value === 'date' || effectiveMode.value === 'month' || effectiveMode.value === 'year' || effectiveMode.value === 'datetime'),
);

// 设置 datetime 模式的时间部分（响应式 / 面板 / 延迟三路分发）
const applyDatetimeTime = (timeStr: string) => {
  pendingTimeStr.value = timeStr;
  if (isResponding.value) {
    until(timeColumnsRef)
      .toBeTruthy()
      .then(() => {
        timeColumnsRef.value?.setValue(timeStr);
      });
  } else if (datePanelTimeRef.value) {
    datePanelTimeRef.value.setValue(timeStr);
  } else {
    until(datePanelTimeRef)
      .toBeTruthy()
      .then(() => {
        datePanelTimeRef.value?.setValue(timeStr);
        emits('preview', getValue());
      });
  }
};

// 设置有日期值时的面板状态
const setValueWithDate = (d: Dayjs, value: number) => {
  selectedDate.value = d;
  displayYear.value = d.year();
  displayMonth.value = d.month();
  if (isColumnMode.value) {
    until(dateColumnsRef)
      .toBeTruthy()
      .then(() => {
        dateColumnsRef.value?.setValue(value);
      });
  }
  if (effectiveMode.value === 'datetime') {
    applyDatetimeTime(d.format(timeFormat.value));
  }
};

// 清空日期值时的面板状态
const setValueEmpty = () => {
  if (isColumnMode.value) {
    const d = dayjs();
    selectedDate.value = d;
    displayYear.value = d.year();
    displayMonth.value = d.month();
    until(dateColumnsRef)
      .toBeTruthy()
      .then(() => {
        dateColumnsRef.value?.setValue(undefined);
      });
  } else {
    selectedDate.value = null;
  }
  if (effectiveMode.value === 'datetime') {
    pendingTimeStr.value = dayjs().format(timeFormat.value);
    if (isResponding.value) {
      until(timeColumnsRef)
        .toBeTruthy()
        .then(() => {
          timeColumnsRef.value?.setValue(undefined);
        });
    } else {
      until(datePanelTimeRef)
        .toBeTruthy()
        .then(() => {
          datePanelTimeRef.value?.reset();
        });
    }
  }
};

const setValue = (value?: number) => {
  if (value) {
    setValueWithDate(dayjs(value), value);
  } else {
    setValueEmpty();
  }
};

const open = async (newVal?: number) => {
  visible.value = true;
  mobileDateTimeTab.value = 'date';
  // 以模式决定初始视图：year 模式直接显示年份列表，month 模式先显示月份列表
  if (effectiveMode.value === 'year') {
    currentView.value = 'year';
  } else if (effectiveMode.value === 'month') {
    currentView.value = 'month';
  } else {
    currentView.value = 'date';
  }
  setValue(newVal);
};
const close = () => {
  visible.value = false;
};

// 选择操作
const handleSelectDate = (date: Dayjs) => {
  selectedDate.value = date;
  displayYear.value = date.year();
  displayMonth.value = date.month();
  if (currentView.value === 'date' && effectiveMode.value !== 'datetime') {
    emits('change', getValue());
  } else if (effectiveMode.value === 'datetime') {
    emits('preview', getValue());
  }
};

const handleTimeChange = () => {
  if (effectiveMode.value === 'datetime') {
    emits('preview', getValue());
  }
};

const handleSelectMonth = (month: number) => {
  displayMonth.value = month;
  if (effectiveMode.value === 'month') {
    selectedDate.value = dayjs().year(displayYear.value).month(month).date(1);
    emits('change', getValue());
  } else {
    currentView.value = 'date';
  }
};

const handleSelectYear = (year: number) => {
  displayYear.value = year;
  if (effectiveMode.value === 'year') {
    selectedDate.value = dayjs().year(year).month(0).date(1);
    emits('change', getValue());
  } else if (effectiveMode.value === 'month') {
    currentView.value = 'month';
  } else {
    currentView.value = 'date';
  }
};

const handleCancel = () => {
  emits('cancel');
  close();
};
const handleConfirm = () => {
  emits('confirm', getValue());
  close();
};

const handleDateColumnsChange = (value: { year: number; month?: number; day?: number } | undefined) => {
  if (value) {
    displayYear.value = value.year;
    if (value.month !== undefined) {
      displayMonth.value = value.month;
      selectedDate.value = dayjs()
        .year(value.year)
        .month(value.month)
        .date(value.day ?? 1);
    } else {
      selectedDate.value = dayjs().year(value.year).month(0).date(1);
    }
    if (effectiveMode.value === 'datetime' || isResponding.value) {
      emits('preview', getValue());
    } else {
      emits('change', getValue());
    }
  }
};

const handleTimeColumnsChange = () => {
  if (effectiveMode.value === 'datetime') {
    emits('preview', getValue());
  }
};

defineExpose({
  getPopupEl: () => popupRef.value,
  getValue,
  setValue,
  open,
  close,
});
</script>

<template>
  <ClientOnly>
    <!-- 移动端 -->
    <ODialog
      v-if="isResponding"
      :visible="visible"
      class="o-select-dlg"
      :main-class="[
        'o-date-panel',
        `o-date-panel-${size}`,
        'o-time-panel',
        `o-time-panel-${size}`,
        { 'o-date-panel-touch': isResponding, 'o-time-panel-touch': isResponding },
      ]"
      hide-close
      size="small"
      @update:visible="setVisible"
    >
      <template #header>
        <!-- 移动端 datetime 模式：日期/时间切换 -->
        <OTab v-if="isResponding && effectiveMode === 'datetime'" v-model="mobileDateTimeTab" variant="button" round="pill">
          <OTabPane :label="t('datePicker.date')" value="date" />
          <OTabPane :label="t('datePicker.time')" value="time" />
        </OTab>
        <div v-else class="o-select-options-head">{{ props.optionTitle ?? t('datePicker.selectDate') }}</div>
      </template>
      <template #actions>
        <OButton class="o-dlg-btn" variant="text" size="large" @click="handleCancel">
          {{ t('select.cancel') }}
        </OButton>
        <OButton class="o-dlg-btn" variant="text" size="large" @click="handleConfirm">
          {{ t('select.confirm') }}
        </OButton>
      </template>

      <div :class="['o-date-panel-body', { 'o-date-panel-body-datetime': effectiveMode === 'datetime' }]">
        <template v-if="effectiveMode === 'datetime'">
          <DateColumns v-if="mobileDateTimeTab === 'date'" ref="dateColumnsRef" mode="date" @change="handleDateColumnsChange" />
          <TimeColumns v-if="mobileDateTimeTab === 'time'" ref="timeColumnsRef" @change="handleTimeColumnsChange" />
        </template>
        <!-- 移动端非 datetime 模式 -->
        <DateColumns v-else ref="dateColumnsRef" :mode="effectiveMode" @change="handleDateColumnsChange" />
      </div>
    </ODialog>

    <!-- PC端 -->
    <OPopup
      v-else
      v-model:visible="visible"
      :class="['o-date-panel', `o-date-panel-${size}`, 'o-time-panel', `o-time-panel-${size}`]"
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
        <div :class="['o-date-panel-body', { 'o-date-panel-body-datetime': effectiveMode === 'datetime' }]">
          <div class="o-date-panel-date-side">
            <div class="o-date-panel-content">
              <DatePanelHeader v-model:year="displayYear" v-model:month="displayMonth" v-model:current-view="currentView" />
              <ODivider class="o-date-panel-divider" />
              <DatePanelYear
                v-if="currentView === 'year'"
                ref="yearPanelRef"
                :year="displayYear"
                :selected-date="selectedDate"
                :disabled-year="disabledYear"
                :min-date="parsedMinDate"
                :max-date="parsedMaxDate"
                @select="handleSelectYear"
              />
              <DatePanelMonth
                v-else-if="currentView === 'month'"
                ref="monthPanelRef"
                :year="displayYear"
                :selected-date="selectedDate"
                :disabled-month="disabledMonth"
                :min-date="parsedMinDate"
                :max-date="parsedMaxDate"
                @select="handleSelectMonth"
              />
              <DatePanelCalendar v-else ref="calendarPanelRef" :rows="rows" :week-day-headers="weekDayHeaders" @select="handleSelectDate" />
            </div>
          </div>
          <template v-if="effectiveMode === 'datetime' && currentView === 'date'">
            <ODivider direction="v" class="o-date-panel-divider-v" />
            <DatePanelTime ref="datePanelTimeRef" @change="handleTimeChange" />
          </template>
        </div>
        <template v-if="(!isEmptySlot($slots.shortcut) || effectiveMode === 'datetime') && isMainPanel">
          <ODivider class="o-date-panel-divider" />
          <div class="o-date-panel-footer">
            <span class="o-date-panel-shortcut">
              <slot name="shortcut" :set-value="setValue" :emit-change="() => emits('change', getValue())" />
            </span>
            <span v-if="effectiveMode === 'datetime'">
              <OButton round="pill" @click="handleConfirm">{{ t('select.confirm') }}</OButton>
            </span>
          </div>
        </template>
      </div>
    </OPopup>
  </ClientOnly>
</template>
