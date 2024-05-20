<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { Labels, getDateRangeStatus, isSameDay, isSameMonth } from '../date';
import type { DateRangeT } from '../date';
import { chunk } from '../../_utils/helper';
import { getWeeksByDate } from '../../_utils/date';
import { isFunction } from '../../_utils/is';
import { PickerDate } from '../picker-date';
import { OScroller } from '../../scrollbar';
import { DayCellT, DisaplyDayListT } from '../types';

export interface DayValueT {
  year?: number;
  month?: number;
  day?: number;
}

interface CellT {
  data: {
    year: number;
    month: number;
    day: number;
  };
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
    value: Date;
    viewValue: Date;
    visible: boolean;
    yearSelectable?: boolean;
    monthSelectable?: boolean;
    disableCell: (cell: DayCellT) => boolean;
    displayDayList?: DisaplyDayListT;
  }>(),
  {
    value: undefined,
    yearSelectable: true,
    monthSelectable: true,
    displayDayList: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: DayValueT): void;
  (e: 'select', value: DayValueT, evt?: Event): void;
}>();

const today = new PickerDate(new Date());
const viewValue = computed(() => new PickerDate(props.viewValue));
const inValue = new PickerDate(props.value);

const selectValue = ref<DayValueT>({
  year: inValue.year,
  month: inValue.month,
  day: inValue.day,
});

const selectRange = ref<DateRangeT>({
  start: new PickerDate(new Date()),
  end: new PickerDate(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)),
});

const dayList = ref<CellT[][]>([]);
// 当前面板显示的年月
const currentViewMonth = {
  year: 0,
  month: 0,
};
const column = 7; //一周七天

function getDaysofMonth(
  year: number,
  month: number
): Array<{
  year: number;
  month: number;
  day: number;
  label: string;
}> {
  // 获取该月第一天
  const mDate = new Date(year, month, 1);
  // 以该月第一周开始，获取weekLength周的日期列表

  return getWeeksByDate(mDate, 6, {
    parse: (d: Date) => {
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        label: `${d.getDate()}`,
      };
    },
  });
}

const updateViewDays = (year: number, month: number) => {
  if ((currentViewMonth.year === year || Number.isNaN(year)) && (currentViewMonth.month === month || Number.isNaN(month))) {
    return;
  }
  currentViewMonth.year = year;
  currentViewMonth.month = month;

  const dList = isFunction(props.displayDayList)
    ? props.displayDayList(currentViewMonth.year, currentViewMonth.month)
    : getDaysofMonth(currentViewMonth.year, currentViewMonth.month);

  const list = dList.map((item) => {
    const data = {
      year: item.year,
      month: item.month,
      day: item.day,
    };
    const isOutView = !isSameMonth(data, currentViewMonth);

    const pd = new PickerDate(new Date());
    pd.set(data);

    return {
      data,
      outView: isOutView,
      isNow: isSameDay(item, today),
      // rangeStatus: !isOutView ? getDateRangeStatus(pd, selectRange.value as DateRangeT) : null,
      disabled: isOutView ? false : props.disableCell(data),
    };
  });
  dayList.value = chunk(list, column);
};

watchEffect(() => updateViewDays(viewValue.value.year, viewValue.value.month));

watch(
  () => props.value,
  (v: Date) => {
    inValue.date = v;
    selectValue.value = {
      year: inValue.year,
      month: inValue.month,
      day: inValue.day,
    };

    updateViewDays(currentViewMonth.year, currentViewMonth.month);
  }
);

const onDayCellClick = (cell: CellT, e: Event) => {
  if (cell.disabled) {
    return;
  }

  const { year, month, day } = cell.data;

  if (selectValue.value.year !== year || selectValue.value.month !== month || selectValue.value.day !== day) {
    selectValue.value = cell.data;
    emits('update:value', selectValue.value);
  }

  emits('select', cell.data, e);

  if (cell.outView) {
    updateViewDays(cell.data.year, cell.data.month);
  }
};
</script>
<template>
  <OScroller
    size="small"
    class="o-picker-date"
    show-type="hover"
    :class="{
      'o-picker-hidden': !props.visible,
    }"
  >
    <div
      class="o-picker-row"
      :style="{
        '--column': column,
      }"
    >
      <div v-for="item in Labels.weeks" :key="item" class="o-picker-cell o-pd-cell-week">{{ item }}</div>
    </div>
    <div
      v-for="(week, idx) in dayList"
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
          'o-picker-cell-selected': isSameDay(item.data, selectValue),
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
