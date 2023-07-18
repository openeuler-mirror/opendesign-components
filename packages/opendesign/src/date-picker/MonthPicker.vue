<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { chunk } from '../_utils/helper';
import { Labels, isSameMonth } from './date';
import { PickerDate } from './picker-date';
import { isFunction } from '../_utils/is';

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
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    value: InstanceType<typeof PickerDate>;
    column?: number;
    currentYears?: number;
    selectYear?: boolean;
    disableDate: (current: Date, type?: 'start' | 'end') => boolean;
    displayMonths?: (currentYear: number) => Array<{ value: number; label: string }>;
  }>(),
  {
    value: undefined,
    column: 3,
    displayMonths: undefined,
    selectYear: true,
    currentYears: new Date().getFullYear(),
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: MonthValueT): void;
  (e: 'select', value: MonthValueT): void;
  (e: 'select-year'): void;
}>();

const selectValue = ref<MonthValueT>({
  years: props.value.years,
  months: props.value.months,
});

const monthList = ref<CellT[][]>([]);
const viewYear = ref<number>(0);
const selectYear = computed(() => props.selectYear);

const getMonthList = () => {
  return Labels.months.map((item, idx) => {
    return {
      value: idx,
      label: item,
    };
  });
};

const updateViewMonth = (year?: number) => {
  const now = new PickerDate(new Date());
  viewYear.value = year ?? now.years;

  const mlist = isFunction(props.displayMonths) ? props.displayMonths(viewYear.value) : getMonthList();

  const list = mlist.map((item) => {
    const data = {
      years: year,
      months: item.value + 1,
    };
    return {
      data,
      isNow: isSameMonth(data, now),
      monthLabel: item.label,
      disabled: props.disableDate(new Date(viewYear.value, item.value - 1)),
    };
  });

  monthList.value = chunk(list, props.column);
};

updateViewMonth(props.value.years || props.currentYears);

watch(
  () => props.currentYears,
  (v) => {
    updateViewMonth(v);
  }
);
watch(
  () => props.value,
  (v: PickerDate) => {
    selectValue.value = {
      years: v.years,
      months: v.months,
    };

    if (viewYear.value !== v.years) {
      updateViewMonth(v.years);
    }
  }
);

const selectCell = (cell: CellT) => {
  if (cell.disabled) {
    return;
  }
  if (selectYear.value) {
    selectValue.value = cell.data;
  } else {
    selectValue.value = { months: cell.data.months };
  }

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);
};
</script>
<template>
  <OScroller size="small" class="o-picker-month">
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
        :key="item.data.months"
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
