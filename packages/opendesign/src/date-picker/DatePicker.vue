<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IconCalendarPrevMonth, IconCalendarPrevYear, IconCalendarNextMonth, IconCalendarNextYear } from '../_utils/icons';
import { PickerTypeT } from './types';
import { OIcon } from '../icon';
import { Labels, getMonthLabel, getDateRangeStatus, getDaysofMonth, isSameDay, isSameMonth } from './date';
import type { DateRangeT } from './date';
import { chunk } from '../_utils/helper';
import { addYears, subYears, addMonths, subMonths, startOfMonth } from '../_utils/date';
import { isValidDate } from '../_utils/is';
import { PickerDate } from './picker-date';

export interface DateValueT {
  years?: number;
  months?: number;
  days?: number;
}

interface DayCellT {
  data: PickerDate;
  today: boolean;
  outView: boolean;
  rangeStatus?: {
    in: boolean;
    start: boolean;
    end: boolean;
  } | null;
}

const props = withDefaults(
  defineProps<{
    value: DateValueT;
    type?: PickerTypeT;
    range?: boolean;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    type: 'date',
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: DateValueT): void;
  (e: 'select', value: DateValueT, evt?: Event): void;
}>();

const getDateByValue = (value: DateValueT) => {
  const m = typeof value.months === 'number' ? value.months - 1 : 0;
  let d = new Date(value.years || 0, m, value.days);
  if (!isValidDate(d)) {
    d = new Date();
  }
  return startOfMonth(d);
};
const todayDate = new PickerDate(new Date());

const selectValue = ref<DateValueT>({});

const viewMonthDate = ref<PickerDate>(new PickerDate(new Date()));

const selectRange = ref<DateRangeT>({
  start: new PickerDate(new Date()),
  end: new PickerDate(new Date(viewMonthDate.value.date.getTime() + 7 * 24 * 60 * 60 * 1000)),
});

/**
 * 处理每月日期列表
 */
const updateViewMonth = (date: DateValueT | Date) => {
  if (date instanceof Date) {
    const pd = new PickerDate(date);
    if (!isSameMonth(pd, viewMonthDate.value as PickerDate)) {
      viewMonthDate.value.date = date;
    }
  } else {
    if (date.years === viewMonthDate.value.years && date.months === viewMonthDate.value.months) {
      return;
    }
    const d = getDateByValue(date);

    viewMonthDate.value.date = d;
  }
};
const dayListByWeek = computed<DayCellT[][]>(() => {
  const dayList = getDaysofMonth(viewMonthDate.value.date);
  const list: DayCellT[] = dayList.map((item) => {
    const isOutView = !isSameMonth(item, viewMonthDate.value as PickerDate);
    return {
      data: item,
      outView: isOutView,
      today: isSameDay(item, todayDate),
      rangeStatus: props.range && !isOutView ? getDateRangeStatus(item, selectRange.value as DateRangeT) : null,
    };
  });
  return chunk(list, 7);
});

watch(
  () => props.value,
  (v: DateValueT) => {
    if (v) {
      selectValue.value = v;
      updateViewMonth(v);
    }
  },
  { immediate: true }
);

const currentMonthLabel = computed(() => getMonthLabel(viewMonthDate.value as PickerDate));

const selectDate = ref<DateValueT>(props.value);

/**
 * head 操作
 */
const headActionFn = {
  year: {
    add: addYears,
    sub: subYears,
  },
  month: {
    add: addMonths,
    sub: subMonths,
  },
};
const headBtnClick = (dateType: 'year' | 'month', actionType: 'sub' | 'add') => {
  updateViewMonth(headActionFn[dateType][actionType](viewMonthDate.value.date, 1));
};

const onDayCellClick = (cell: DayCellT, e: Event) => {
  if (!props.range) {
    selectValue.value.days = cell.data.days;
    selectValue.value.months = cell.data.months;
    selectValue.value.years = cell.data.years;

    emits('update:value', selectValue.value);
    emits('select', selectValue.value, e);

    if (cell.outView) {
      updateViewMonth(selectValue.value);
    }
  } else {
    if (!selectRange.value.start || (selectRange.value.start && selectRange.value.end)) {
      selectRange.value.start = cell.data;
      // selectRange.value.end = null;
    }
  }
};
</script>
<template>
  <div class="o-picker-date">
    <div class="o-picker-head">
      <div class="o-picker-head-btns">
        <OIcon class="o-picker-btn" button :icon="IconCalendarPrevYear" @click="headBtnClick('year', 'sub')" />
        <OIcon class="o-picker-btn" button :icon="IconCalendarPrevMonth" @click="headBtnClick('month', 'sub')" />
      </div>
      <div class="o-picker-value">
        <slot name="date-value-label" v-bind="selectValue">{{ currentMonthLabel }}</slot>
      </div>
      <div class="o-picker-head-btns">
        <OIcon class="o-picker-btn" button :icon="IconCalendarNextMonth" @click="headBtnClick('month', 'add')" />
        <OIcon class="o-picker-btn" button :icon="IconCalendarNextYear" @click="headBtnClick('year', 'add')" />
      </div>
    </div>
    <div class="o-picker-main o-pd-main">
      <div class="o-pd-head">
        <div v-for="item in Labels.weeks" :key="item" class="o-picker-cell o-pd-cell">{{ item }}</div>
      </div>
      <div v-for="(week, idx) in dayListByWeek" :key="idx" class="o-pd-week-list">
        <div
          v-for="item in week"
          :key="item.data.days"
          class="o-picker-cell o-pd-cell"
          :class="{
            'o-picker-cell-selected': !props.range && selectDate ? isSameDay(item.data, selectValue) : false,
            'o-picker-cell-range-start': item.rangeStatus?.start,
            'o-picker-cell-in-range': item.rangeStatus?.in,
            'o-picker-cell-range-end': item.rangeStatus?.end,
            'o-pd-cell-out-view': item.outView,
            'o-pd-cell-today': item.today,
          }"
          @click="(e) => onDayCellClick(item, e)"
        >
          <div class="o-picker-cell-val o-pd-cell-val">
            <slot name="day-cell" v-bind="item">{{ item.data.days }}</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
