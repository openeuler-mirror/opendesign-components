<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { chunk } from '../_utils/helper';
import { PickerDate } from './picker-date';
import { isFunction } from '../_utils/is';
import { scrollCellToView } from './date';

interface CellT {
  years: number;
  label: string;
  isNow: boolean;
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    value: PickerDate;
    displayYears?: (currentYear: number) => Array<{ value: number; label: string }>;
    column?: number;
    disableDate: (current: Date, type?: 'start' | 'end') => boolean;
  }>(),
  {
    value: undefined,
    column: 3,
    displayYears: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'select', value: number): void;
}>();

const selectValue = ref<number>(props.value.years);
const yearRangeLabel = ref<string>();
const yearList = ref<CellT[][]>([]);

const hScrollRef = ref<InstanceType<typeof OScroller>>();
const scrollIntoView = (smooth?: boolean) => {
  nextTick(() => {
    scrollCellToView(hScrollRef.value, '.o-picker-cell-selected', {
      smooth,
      align: 'center',
    });
  });
};

const getYearList = (year?: number) => {
  const nowYear = year ?? new Date().getFullYear();
  const start = nowYear - (nowYear % 100) - 100;

  const list: Array<{ value: number; label: string }> = [];
  for (let i = 0; i < 201; i++) {
    list.push({
      value: i + start,
      label: `${i + start}`,
    });
  }
  return list;
};

const updateViewYears = (year: number) => {
  const nowYear = new Date().getFullYear();

  const yl = isFunction(props.displayYears) ? props.displayYears(year) : getYearList(year);

  const list = yl.map((item) => {
    return {
      label: item.label,
      value: item,
      isNow: item.value === nowYear,
      disabled: props.disableDate(new Date(item.value, 0)),
    };
  });

  yearList.value = chunk(list, props.column);
  yearRangeLabel.value = `${list[1].label} - ${list[10].value}`;
};

updateViewYears(props.value.years);

watch(
  () => props.value,
  (v: PickerDate) => {
    if (selectValue.value !== v.years) {
      selectValue.value = v.years;
      scrollIntoView(true);
    }
  }
);

const selectCell = (cell: CellT) => {
  if (cell.disabled || cell.years === selectValue.value) {
    return;
  }

  selectValue.value = cell.years;

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);
};

onMounted(() => {
  scrollIntoView();
});
</script>
<template>
  <OScroller ref="hScrollRef" size="small" class="o-picker-year">
    <div class="more-top"></div>
    <div
      v-for="(row, idx) in yearList"
      :key="idx"
      class="o-picker-row"
      :style="{
        '--column': props.column,
      }"
    >
      <div
        v-for="item in row"
        :key="item.years"
        class="o-picker-cell o-py-cell"
        :class="{
          'o-picker-cell-selected': selectValue === item.years,
          'o-picker-cell-now': item.isNow,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => selectCell(item)"
      >
        <div class="o-picker-cell-val">
          <slot name="cell-year" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </div>
    <div class="more-bottom"></div>
  </OScroller>
</template>
