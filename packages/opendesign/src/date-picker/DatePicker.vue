<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { Labels, getDateRangeStatus, getDaysofMonth, isSameDay, isSameMonth } from './date';
import type { DateRangeT } from './date';
import { chunk } from '../_utils/helper';
import { startOfMonth } from '../_utils/date';
import { isFunction, isValidDate } from '../_utils/is';
import { PickerDate } from './picker-date';
import { OScroller } from '../scroller';

export interface DateValueT {
  year?: number;
  month?: number;
  day?: number;
}

interface DayCellT {
  data: PickerDate;
  isNow: boolean;
  outView: boolean;
  disabled: boolean;
  rangeStatus?: {
    in: boolean;
    start: boolean;
    end: boolean;
  } | null;
}

const props = withDefaults(
  defineProps<{
    value: InstanceType<typeof PickerDate>;
    currentYears?: number;
    currentMonths?: number;
    disableDate: (current: Date, type?: 'start' | 'end') => boolean;
    displayDates?: (year: number, month: number) => Array<{ value: Date; label: string }>;
  }>(),
  {
    value: undefined,
    displayDates: undefined,
    currentYears: undefined,
    currentMonths: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: DateValueT): void;
  (e: 'select', value: DateValueT, evt?: Event): void;
}>();

const getDateByValue = (value: DateValueT) => {
  const m = typeof value.month === 'number' ? value.month - 1 : 0;
  let d = new Date(value.year || 0, m, value.day);
  if (!isValidDate(d)) {
    d = new Date();
  }
  return startOfMonth(d);
};

const todayDate = new PickerDate(new Date());

const selectValue = ref<DateValueT>({
  year: props.value.year,
  month: props.value.month,
  day: props.value.day,
});

// 当前显示的月份
const viewMonth = ref<{ year: number; month: number }>({
  year: 0,
  month: 0,
});

watchEffect(() => {
  viewMonth.value = {
    year: props.currentYears || new Date().getFullYear(),
    month: props.currentMonths || new Date().getMonth(),
  };
});

const selectRange = ref<DateRangeT>({
  start: new PickerDate(new Date()),
  end: new PickerDate(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)),
});

const column = 7; //一周七天
const dayListByWeek = computed<DayCellT[][]>(() => {
  const dayList = isFunction(props.displayDates)
    ? props.displayDates(viewMonth.value.year, viewMonth.value.month)
    : getDaysofMonth(viewMonth.value.year, viewMonth.value.month);
  console.log(dayList);

  const list: DayCellT[] = dayList.map((item) => {
    const isOutView = !isSameMonth(item, viewMonth.value);
    return {
      data: item,
      outView: isOutView,
      isNow: isSameDay(item, todayDate),
      rangeStatus: !isOutView ? getDateRangeStatus(item, selectRange.value as DateRangeT) : null,
      disabled: props.disableDate(item.date),
    };
  });
  return chunk(list, column);
});

watch(
  () => props.value,
  (v: PickerDate) => {
    if (v) {
      selectValue.value = v;
    }
  }
);

const selectDate = ref<DateValueT>(props.value);

const onDayCellClick = (cell: DayCellT, e: Event) => {
  if (cell.disabled) {
    return;
  }

  selectValue.value.day = cell.data.day;
  selectValue.value.month = cell.data.month;
  selectValue.value.year = cell.data.year;

  emits('update:value', selectValue.value);
  emits('select', selectValue.value, e);

  if (cell.outView) {
    // updateViewDates(selectValue.value);
  }
};
</script>
<template>
  <OScroller size="small" class="o-picker-date" show-type="hover">
    <div
      class="o-picker-row"
      :style="{
        '--column': column,
      }"
    >
      <div v-for="item in Labels.weeks" :key="item" class="o-picker-cell o-pd-cell-head">{{ item }}</div>
    </div>
    <div
      v-for="(week, idx) in dayListByWeek"
      :key="idx"
      class="o-picker-row"
      :style="{
        '--column': column,
      }"
    >
      <div
        v-for="item in week"
        :key="item.data.day"
        class="o-picker-cell o-pd-cell"
        :class="{
          'o-picker-cell-selected': selectDate ? isSameDay(item.data, selectValue) : false,
          'o-picker-cell-range-start': item.rangeStatus?.start,
          'o-picker-cell-in-range': item.rangeStatus?.in,
          'o-picker-cell-range-end': item.rangeStatus?.end,
          'o-picker-cell-out-view': item.outView,
          'o-picker-cell-now': item.isNow,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => onDayCellClick(item, e)"
      >
        <div class="o-picker-cell-val o-pd-cell-val">
          <slot name="day-cell" v-bind="item">{{ item.data.day }}</slot>
        </div>
      </div>
    </div>
  </OScroller>
</template>
