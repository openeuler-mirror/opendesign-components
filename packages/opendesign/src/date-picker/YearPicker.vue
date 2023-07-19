<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { chunk } from '../_utils/helper';
import { PickerDate } from './picker-date';
import { isFunction } from '../_utils/is';
import { scrollSelectOrNowCellInToView } from './date';
import { DisaplyYearListT, YearCellT } from './types';

interface CellT {
  data: {
    year: number;
  };
  label: string;
  isNow: boolean;
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    visible: boolean;
    value: PickerDate;
    column?: number;
    disableCell: (cell: YearCellT) => boolean;
    displayYearList?: DisaplyYearListT;
  }>(),
  {
    value: undefined,
    column: 3,
    displayYearList: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'select', value: number): void;
}>();

const selectValue = ref<number>(props.value.year);
const yearList = ref<CellT[][]>([]);

const hScrollRef = ref<InstanceType<typeof OScroller>>();
const scrollIntoView = (smooth?: boolean) => {
  nextTick(() => {
    scrollSelectOrNowCellInToView(hScrollRef.value, {
      smooth,
      align: 'center',
    });
  });
};

const getYearList = (year: number) => {
  const start = year - (year % 100) - 100;

  const list: Array<{ year: number; label: string }> = [];
  for (let i = 0; i < 201; i++) {
    list.push({
      year: i + start,
      label: `${i + start}`,
    });
  }
  return list;
};

const updateViewYears = (year: number) => {
  const nowYear = new Date().getFullYear();
  const cy = Number.isNaN(year) ? nowYear : year;

  const yl = isFunction(props.displayYearList) ? props.displayYearList(cy) : getYearList(cy);

  const list = yl.map((item) => {
    const data = {
      year: item.year,
    };
    return {
      data,
      label: item.label,
      isNow: item.year === nowYear,
      disabled: props.disableCell(data),
    };
  });

  yearList.value = chunk(list, props.column);
};

updateViewYears(props.value.year);

watch(
  () => props.value,
  (v: PickerDate) => {
    if (selectValue.value !== v.year) {
      selectValue.value = v.year;
      scrollIntoView(true);
    }
  }
);

const selectCell = (cell: CellT) => {
  if (cell.disabled || cell.data.year === selectValue.value) {
    return;
  }

  selectValue.value = cell.data.year;

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);
};

watch(
  () => props.visible,
  (v) => {
    selectValue.value = props.value.year;
    if (v) {
      scrollIntoView();
    }
  }
);

onMounted(() => {
  scrollIntoView();
});
</script>
<template>
  <OScroller
    ref="hScrollRef"
    size="small"
    class="o-picker-year"
    show-type="hover"
    :class="{
      'o-picker-hidden': !props.visible,
    }"
  >
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
        :key="item.data.year"
        class="o-picker-cell o-py-cell"
        :class="{
          'o-picker-cell-selected': selectValue === item.data.year,
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
