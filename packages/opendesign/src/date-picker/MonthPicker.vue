<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
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
    value: Date;
    viewValue: Date;
    column?: number;
    yearSelectable?: boolean;
    disableCell: (cell: MonthCellT) => boolean;
    displayMonthList?: DisaplyMonthListT;
  }>(),
  {
    value: undefined,
    column: 3,
    yearSelectable: true,
    displayMonthList: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: MonthValueT): void;
  (e: 'select', value: MonthValueT): void;
}>();

const today = new PickerDate(new Date());

const viewValue = computed(() => new PickerDate(props.viewValue));
const inValue = new PickerDate(props.value);
const selectValue = ref<MonthValueT>({
  year: inValue.year,
  month: inValue.month,
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

const updateViewMonths = (year: number) => {
  if (currentViewYear === year || Number.isNaN(year)) {
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

watchEffect(() => updateViewMonths(viewValue.value.year));

watch(
  () => props.value,
  (v: Date) => {
    inValue.date = v;

    selectValue.value = {
      year: inValue.year,
      month: inValue.month,
    };

    updateViewMonths(inValue.year);
  }
);

const selectCell = (cell: CellT) => {
  if (cell.disabled) {
    return;
  }

  const { year, month } = cell.data;

  if (selectValue.value.year !== year || selectValue.value.month !== month) {
    selectValue.value = cell.data;
    emits('update:value', selectValue.value);
  }

  emits('select', cell.data);
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
