<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { chunk } from '../_utils/helper';
import { Labels, isSameMonth } from './date';
import { PickerDate } from './picker-date';
import { isFunction } from '../_utils/is';
import { DisaplyMonthListT, MonthCellT } from './types';

export interface MonthValueT {
  year?: number;
  month?: number;
}

interface CellT {
  data: {
    year: number;
    month: number;
  };
  monthLabel: string;
  isNow: boolean;
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    visible: boolean;
    value: InstanceType<typeof PickerDate>;
    column?: number;
    currentYear?: number;
    yearSelectable?: boolean;
    disableCell: (cell: MonthCellT) => boolean;
    displayMonthList?: DisaplyMonthListT;
  }>(),
  {
    value: undefined,
    column: 3,
    currentYear: new Date().getFullYear(),
    displayMonthList: undefined,
    yearSelectable: true,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: MonthValueT): void;
  (e: 'select', value: MonthValueT): void;
}>();

const selectValue = ref<MonthValueT>({
  year: props.value.year,
  month: props.value.month,
});

const monthList = ref<CellT[][]>([]);
let currentViewYear = 0;

const getMonthList = (year?: number) => {
  return Labels.months.map((item, idx) => {
    return {
      year,
      month: idx,
      label: item,
    };
  });
};

const today = new PickerDate(new Date());

const updateViewMonths = (year: number) => {
  if (currentViewYear === year) {
    return;
  }
  currentViewYear = year;

  const mlist = isFunction(props.displayMonthList) ? props.displayMonthList(currentViewYear) : getMonthList(currentViewYear);

  const list = mlist.map((item) => {
    const data = {
      year: item.year,
      month: item.month,
    };
    return {
      data,
      isNow: isSameMonth(data, today),
      monthLabel: item.label,
      disabled: props.disableCell(data),
    };
  });

  monthList.value = chunk(list, props.column);
};

updateViewMonths(props.value.year || props.currentYear);

watch(
  () => props.currentYear,
  (v) => {
    updateViewMonths(v);
  }
);
watch(
  () => props.value,
  (v: PickerDate) => {
    selectValue.value = {
      year: v.year,
      month: v.month,
    };

    if (currentViewYear !== v.year) {
      updateViewMonths(v.year);
    }
  }
);

const selectCell = (cell: CellT) => {
  if (cell.disabled) {
    return;
  }
  if (props.yearSelectable) {
    selectValue.value = cell.data;
  } else {
    selectValue.value = { month: cell.data.month };
  }

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);
};
</script>
<template>
  <OScroller
    size="small"
    class="o-picker-month"
    show-type="hover"
    :class="{
      'o-picker-hidden': !props.visible,
    }"
  >
    <div
      v-for="(row, idx) in monthList"
      :key="idx"
      class="o-picker-row"
      :style="{
        '--column': props.column,
      }"
    >
      <div
        v-for="item in row"
        :key="item.data.month"
        class="o-picker-cell o-pm-cell"
        :class="{
          'o-picker-cell-selected': isSameMonth(item.data, selectValue),
          'o-picker-cell-now': item.isNow,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => selectCell(item)"
      >
        <div class="o-picker-cell-val">
          <slot name="cell-month" v-bind="item">{{ item.monthLabel }}</slot>
        </div>
      </div>
    </div>
  </OScroller>
</template>
