<script setup lang="ts">
import { computed, inject } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { IconCalendarPrevYear, IconCalendarNextYear, IconCalendarPrevMonth, IconCalendarNextMonth } from '../../_utils/icons.ts';
import { useI18n } from '../../locale';
import { OButton } from '../../button';

import { DatePickerMode } from '../types.ts';
import { datePickerInjectKey } from '../provide.ts';
import { YEAR_VIEW_STEP } from '../utils.ts';

const props = defineProps<{
  /** 最小时间，包含 */
  min?: Dayjs;
  /** 最大时间，包含 */
  max?: Dayjs;
  hideLeftNav?: boolean;
  hideRightNav?: boolean;
}>();

const emits = defineEmits<{
  (e: 'prev-year'): void;
  (e: 'next-year'): void;
  (e: 'prev-month'): void;
  (e: 'next-month'): void;
  (e: 'click-month'): void;
  (e: 'click-year'): void;
}>();

const currentView = defineModel<DatePickerMode>('currentView', { required: true });
const year = defineModel<number>('year', { required: true });
const month = defineModel<number>('month', { required: true });

const { t } = useI18n();

const datePickerCtx = inject(datePickerInjectKey)!;

const current = computed(() => dayjs().year(year.value).month(month.value));

const decadeStart = computed(() => Math.floor(year.value / 10) * 10);
const yearLabel = computed(() => (currentView.value === 'year' ? `${decadeStart.value}-${decadeStart.value + 10}` : `${year.value}${t('datePicker.year')}`));

const yearNavStep = computed(() => (currentView.value === 'year' ? YEAR_VIEW_STEP : 1));

const hidePrevYear = computed(() => props.min && current.value.isSame(props.min, 'year'));
const hideNextYear = computed(() => props.max && current.value.isSame(props.max, 'year'));
const hidePrevMonth = computed(() => props.min && current.value.isSame(props.min, 'month'));
const hideNextMonth = computed(() => props.max && current.value.isSame(props.max, 'month'));

const handlePrevYearClick = () => {
  if (!hidePrevYear.value) {
    year.value -= yearNavStep.value;
    emits('prev-year');
  }
};
const handleNextYearClick = () => {
  if (!hideNextYear.value) {
    year.value += yearNavStep.value;
    emits('next-year');
  }
};

const handlePrevMonthClick = () => {
  if (!hidePrevMonth.value) {
    if (month.value === 0) {
      year.value -= 1;
      month.value = 11;
    } else {
      month.value -= 1;
    }
    emits('prev-month');
  }
};
const handleNextMonthClick = () => {
  if (!hideNextMonth.value) {
    if (month.value === 11) {
      year.value += 1;
      month.value = 0;
    } else {
      month.value += 1;
    }
    emits('next-month');
  }
};

const handleClickYear = () => {
  currentView.value = 'year';
  emits('click-year');
};

const handleClickMonth = () => {
  currentView.value = 'month';
  emits('click-month');
};
</script>

<template>
  <div class="o-date-panel-header">
    <div :class="['o-date-panel-header-direction', { hidden: hideLeftNav }]">
      <OButton
        :round="datePickerCtx.round?.value"
        variant="solid"
        :class="['o-date-panel-btn', 'o-date-panel-header-btn', { hidden: hidePrevYear }]"
        :icon="IconCalendarPrevYear"
        @click="handlePrevYearClick"
      />

      <OButton
        v-if="currentView.startsWith('date')"
        :round="datePickerCtx.round?.value"
        variant="solid"
        :class="['o-date-panel-btn', 'o-date-panel-header-btn', { hidden: hidePrevMonth }]"
        :icon="IconCalendarPrevMonth"
        @click="handlePrevMonthClick"
      />
    </div>
    <div class="o-date-panel-header-label">
      <OButton
        :round="datePickerCtx.round?.value"
        variant="solid"
        class="o-date-panel-btn o-date-panel-header-btn o-date-panel-header-label-btn"
        @click="handleClickYear"
      >
        {{ yearLabel }}
      </OButton>
      <OButton
        v-if="currentView.startsWith('date')"
        :round="datePickerCtx.round?.value"
        variant="solid"
        class="o-date-panel-btn o-date-panel-header-btn o-date-panel-header-label-btn"
        @click="handleClickMonth"
      >
        {{ t(`datePicker.months.${month}`) }}
      </OButton>
    </div>
    <div :class="['o-date-panel-header-direction', { hidden: hideRightNav }]">
      <OButton
        v-if="currentView.startsWith('date')"
        :round="datePickerCtx.round?.value"
        variant="solid"
        :class="['o-date-panel-btn', 'o-date-panel-header-btn', { hidden: hideNextMonth }]"
        :icon="IconCalendarNextMonth"
        @click="handleNextMonthClick"
      />
      <OButton
        :round="datePickerCtx.round?.value"
        variant="solid"
        :class="['o-date-panel-btn', 'o-date-panel-header-btn', { hidden: hideNextYear }]"
        :icon="IconCalendarNextYear"
        @click="handleNextYearClick"
      />
    </div>
  </div>
</template>
