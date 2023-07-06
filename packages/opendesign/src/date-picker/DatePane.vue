<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IconCalendarPrevMonth, IconCalendarPrevYear, IconCalendarNextMonth, IconCalendarNextYear } from '../_utils/icons';
import { OButton } from '../button';
import { OIcon } from '../icon';
import { Labels, getDate, getMonthLabel, getDateRangeStatus, getDayListByWeek, isSameDay, isSameMonth } from './date';
import type { DateT, DateRangeT } from './date';
import { chunk } from '../_utils/helper';
import { addYears, subYears, addMonths, subMonths, startOfMonth } from 'date-fns';

interface CellT {
  data: DateT;
  outView: boolean;
  rangeStatus: {
    in: boolean;
    start: boolean;
    end: boolean;
  } | null;
}
const props = withDefaults(
  defineProps<{
    range?: boolean;
    value?: Date;
  }>(),
  {
    range: false,
    value: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: Date): void;
  (e: 'change', value: string): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'confirm', evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const onConfirm = (e: Event) => {
  emits('confirm', e);
};

const viewMonthDate = ref<DateT>(getDate(startOfMonth(props.value || new Date())));

const currentMonthLabel = computed(() => getMonthLabel(viewMonthDate.value));

const selectDate = ref<DateT | null>(props.value ? getDate(props.value) : null);

const selectRange = ref<DateRangeT>({
  start: getDate(new Date()),
  end: getDate(new Date(viewMonthDate.value.date.getTime() + 7 * 24 * 60 * 60 * 1000)),
});

const dayList = ref(getDayListByWeek(viewMonthDate.value));
const dayListByWeek = computed(() => {
  const list: CellT[] = dayList.value.map((item) => {
    const isOutView = !isSameMonth(item, viewMonthDate.value);
    return {
      data: item,
      outView: isOutView,
      rangeStatus: props.range && !isOutView ? getDateRangeStatus(item, selectRange.value) : null,
    };
  });
  return chunk(list, 7);
});

watch(
  () => props.value,
  (v: Date | undefined) => {
    if (v) {
      selectDate.value = getDate(v);

      viewMonthDate.value = getDate(startOfMonth(v));
      dayList.value = getDayListByWeek(viewMonthDate.value);
    }
  }
);
const selectDay = (cell: CellT) => {
  if (!props.range) {
    selectDate.value = cell.data;
    emits('update:value', selectDate.value.date);
    if (cell.outView) {
      viewMonthDate.value = getDate(startOfMonth(cell.data.date));
      dayList.value = getDayListByWeek(cell.data);
    }
  } else {
    if (!selectRange.value.start || (selectRange.value.start && selectRange.value.end)) {
      selectRange.value.start = cell.data;
      // selectRange.value.end = null;
    }
  }
};
const actFn = {
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
  viewMonthDate.value = getDate(actFn[dateType][actionType](viewMonthDate.value.date, 1));
  dayList.value = getDayListByWeek(viewMonthDate.value);
};
</script>
<template>
  <div class="o-date-pane">
    <div class="o-dp-pane-head">
      <div class="o-dp-h-prev">
        <OIcon button :icon="IconCalendarPrevYear" @click="headBtnClick('year', 'sub')" />
        <OIcon button :icon="IconCalendarPrevMonth" @click="headBtnClick('month', 'sub')" />
      </div>
      <div class="o-dp-h-value">{{ currentMonthLabel }}</div>
      <div class="o-dp-h-next">
        <OIcon button :icon="IconCalendarNextMonth" @click="headBtnClick('month', 'add')" />
        <OIcon button :icon="IconCalendarNextYear" @click="headBtnClick('year', 'add')" />
      </div>
    </div>

    <div class="o-dp-pane-main">
      <div class="o-dp-week-head">
        <div v-for="item in Labels.weeks" :key="item" class="o-dp-cell">{{ item }}</div>
      </div>
      <div v-for="(week, idx) in dayListByWeek" :key="idx" class="o-dp-week-list">
        <div
          v-for="item in week"
          :key="item.data.day"
          class="o-dp-cell"
          :class="{
            'o-dp-cell-selected': !props.range && selectDate ? isSameDay(item.data, selectDate) : false,
            'o-dp-cell-range-start': item.rangeStatus?.start,
            'o-dp-cell-in-range': item.rangeStatus?.in,
            'o-dp-cell-range-end': item.rangeStatus?.end,
            'o-dp-cell-out-view': item.outView,
          }"
          @click="selectDay(item)"
        >
          <div class="o-dp-cell-val">{{ item.data.days }}</div>
        </div>
      </div>
    </div>
    <div class="o-dp-pane-foot">
      <OButton @click="onConfirm">确定</OButton>
    </div>
  </div>
</template>
