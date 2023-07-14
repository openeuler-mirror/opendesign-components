<script setup lang="ts">
import { ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { OIcon } from '../icon';
import { IconCalendarPrevYear, IconCalendarNextYear } from '../_utils/icons';
import { chunk } from '../_utils/helper';
import { Labels, isSameMonth } from './date';
import { PickerDate } from './picker-date';

export interface MonthValueT {
  years?: number;
  months?: number;
}

interface CellT {
  data: {
    years: number;
    months: number;
  };
  monthLabel: string;
  isNow: boolean;
}

const props = withDefaults(
  defineProps<{
    value: MonthValueT;
  }>(),
  {
    value: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: MonthValueT): void;
  (e: 'select', value: MonthValueT): void;
}>();

const selectValue = ref<MonthValueT>(props.value);
const yearLabel = ref<number>();
const monthList = ref<CellT[][]>([]);
const viewYear = ref<number>(0);

const getMonthLabel = (monthIndex: number) => {
  return Labels.months[monthIndex];
};
const MonthList = Labels.months.map((item, idx) => {
  return {
    value: idx + 1,
    label: item,
  };
});

const updateViewMonth = (year?: number) => {
  const now = new PickerDate(new Date());

  const list = MonthList.map((item) => {
    return {
      data: {
        years: year,
        months: item.value,
      },
      isNow: isSameMonth({ months: item.value, years: selectValue.value.years }, now),
      monthLabel: getMonthLabel(item.value - 1),
    };
  });

  viewYear.value = year ?? now.years;
  monthList.value = chunk(list, 3);
  yearLabel.value = year ?? now.years;
};

updateViewMonth(props.value.years);

watch(
  () => props.value,
  (v: MonthValueT) => {
    selectValue.value = v;
    updateViewMonth(v.years);
  }
);

/**
 * head 操作
 */
const headBtnClick = (actionType: 'sub' | 'add') => {
  const sign = actionType === 'add' ? 1 : -1;
  updateViewMonth(viewYear.value + sign);
};

const selectCell = (cell: CellT) => {
  selectValue.value = cell.data;

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);
};
</script>
<template>
  <div class="o-picker-year">
    <div class="o-picker-head">
      <div class="o-picker-head-btns">
        <OIcon class="o-picker-btn" button :icon="IconCalendarPrevYear" @click="headBtnClick('sub')" />
      </div>
      <div class="o-picker-value">
        <slot name="month-head-label" :view-year="viewYear" :select-value="selectValue.months">{{ yearLabel }}</slot>
      </div>
      <div class="o-picker-head-btns">
        <OIcon class="o-picker-btn" button :icon="IconCalendarNextYear" @click="headBtnClick('add')" />
      </div>
    </div>
    <div class="o-picker-main">
      <OScroller ref="hScrollRef" class="o-py-wrap" size="small">
        <div v-for="(row, idx) in monthList" :key="idx" class="o-picker-row">
          <div
            v-for="item in row"
            :key="item.data.months"
            class="o-picker-cell o-py-cell"
            :class="{
              'o-picker-cell-selected': isSameMonth(item.data, selectValue),
              'o-picker-cell-now': item.isNow,
            }"
            @click="(e) => selectCell(item)"
          >
            <div class="o-picker-cell-val">
              <slot name="cell-year" v-bind="item">{{ item.monthLabel }}</slot>
            </div>
          </div>
        </div>
      </OScroller>
    </div>
  </div>
</template>
