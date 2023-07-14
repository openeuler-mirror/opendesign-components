<script setup lang="ts">
import { ref, watch } from 'vue';
import { OScroller } from '../scroller';
import { OIcon } from '../icon';
import { IconCalendarPrevYear, IconCalendarNextYear } from '../_utils/icons';
import { chunk } from '../_utils/helper';

interface CellT {
  value: number;
  label: string;
  isNow: boolean;
  outView: boolean;
}

const props = withDefaults(
  defineProps<{
    value: number;
  }>(),
  {
    value: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'select', value: number): void;
}>();

const selectValue = ref<number>(props.value);
const yearRangeLabel = ref<string>();
const yearList = ref<CellT[][]>([]);
const viewYear = ref<number>(0);

const DECADE_VALUE = 10;
const updateViewYears = (year?: number) => {
  const nowYear = new Date().getFullYear();
  const y = year ?? nowYear;
  const sy = y - (y % DECADE_VALUE);
  const ey = sy + DECADE_VALUE - 1;

  const list = [];
  for (let i = -1; i < 11; i++) {
    const v = i + sy;
    list.push({
      label: `${v}`,
      value: v,
      outView: v > ey || v < sy,
      isNow: v === nowYear,
    });
  }
  console.log(selectValue.value);

  viewYear.value = sy;
  yearList.value = chunk(list, 3);
  yearRangeLabel.value = `${list[1].label} - ${list[10].value}`;
};

updateViewYears(props.value);

watch(
  () => props.value,
  (v: number) => {
    selectValue.value = v;
    updateViewYears(v);
  }
);

/**
 * head 操作
 */
const headBtnClick = (actionType: 'sub' | 'add') => {
  const sign = actionType === 'add' ? 1 : -1;
  updateViewYears(viewYear.value + sign * 10);
};

const selectCell = (cell: CellT) => {
  selectValue.value = cell.value;
  updateViewYears(cell.value);

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
      <div class="o-picker-head-value">
        <slot name="year-head-label" :select-value="selectValue" :view-year-list="yearList">{{ yearRangeLabel }}</slot>
      </div>
      <div class="o-picker-head-btns">
        <OIcon class="o-picker-btn" button :icon="IconCalendarNextYear" @click="headBtnClick('add')" />
      </div>
    </div>
    <div class="o-picker-main">
      <OScroller ref="hScrollRef" size="small">
        <div v-for="(row, idx) in yearList" :key="idx" class="o-picker-row">
          <div
            v-for="item in row"
            :key="item.value"
            class="o-picker-cell o-py-cell"
            :class="{
              'o-picker-cell-selected': selectValue === item.value,
              'o-picker-cell-out-view': item.outView,
              'o-picker-cell-now': item.isNow,
            }"
            @click="(e) => selectCell(item)"
          >
            <div class="o-picker-cell-val">
              <slot name="cell-year" v-bind="item">{{ item.label }}</slot>
            </div>
          </div>
        </div>
      </OScroller>
    </div>
  </div>
</template>
