<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { OButton } from '../../button';

import { isYearDisabled, computeRangeState, RangeStateResult } from '../utils.ts';
import { datePickerInjectKey } from '../provide.ts';
import { DisabledYearFn } from '../types.ts';

interface YearRangeStateParams {
  /** 年份 */
  y: number;
  /** 是否在当前十年范围内 */
  isInDecade: boolean;
  /** 已确认范围起始日期 */
  rangeStart?: Dayjs | null;
  /** 已确认范围结束日期 */
  rangeEnd?: Dayjs | null;
  /** 选择进行中的锚点年份 */
  anchorYear?: Dayjs | null;
  /** 当前悬停年份 */
  hoverYear?: Dayjs | null;
}

const NO_RANGE: RangeStateResult = { isRangeStart: false, isRangeEnd: false, isInRange: false };

/**
 * 计算年份格子的范围高亮状态（十年外的格子不参与范围高亮）
 * @param y - 年份
 * @param isInDecade - 是否在当前十年内
 * @param rangeStart - 已确认范围起始
 * @param rangeEnd - 已确认范围结束
 * @param anchorYear - 锚点年份
 * @param hoverYear - 悬停年份
 * @returns 范围高亮状态
 */
function computeYearRangeState({ y, isInDecade, rangeStart, rangeEnd, anchorYear, hoverYear }: YearRangeStateParams): RangeStateResult {
  if (!isInDecade) return NO_RANGE;
  return computeRangeState({
    cell: dayjs().year(y).startOf('year'),
    unit: 'year',
    rangeStart: rangeStart || null,
    rangeEnd: rangeEnd || null,
    anchorDate: anchorYear || null,
    hoverDate: hoverYear || null,
  });
}

const props = defineProps<{
  year: number;
  selectedDate: Dayjs | null;
  disabledYear?: DisabledYearFn;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  /** 已确认的范围起始年份（排序后） */
  rangeStart?: Dayjs | null;
  /** 已确认的范围结束年份（排序后） */
  rangeEnd?: Dayjs | null;
  /** 第一次点击的锚点年份（选择进行中时传入，顺序无意义） */
  anchorYear?: Dayjs | null;
  hoverYear?: Dayjs | null;
  hideOutOfDecade?: boolean;
}>();

const emits = defineEmits<{
  (e: 'select', year: number): void;
  (e: 'hover', date: Dayjs): void;
}>();

const datePickerCtx = inject(datePickerInjectKey)!;

const today = ref<Dayjs | null>(null);
onMounted(() => {
  today.value = dayjs();
});

const decadeStart = computed(() => Math.floor(props.year / 10) * 10);

const years = computed(() => {
  const todayVal = today.value;
  return Array.from({ length: 12 }, (_, i) => {
    const y = decadeStart.value - 1 + i;
    const isSelected = props.selectedDate ? props.selectedDate.year() === y : false;
    const isCurrent = todayVal ? todayVal.year() === y : false;
    const isDisabled = isYearDisabled(y, { disabledYear: props.disabledYear, minDate: props.minDate ?? null, maxDate: props.maxDate ?? null });
    const isInDecade = i >= 1 && i <= 10;
    const isHidden = props.hideOutOfDecade && !isInDecade;
    const { isRangeStart, isRangeEnd, isInRange } = computeYearRangeState({
      y,
      isInDecade,
      rangeStart: props.rangeStart,
      rangeEnd: props.rangeEnd,
      anchorYear: props.anchorYear,
      hoverYear: props.hoverYear,
    });
    return { year: y, isSelected, isCurrent, isDisabled, isInDecade, isRangeStart, isRangeEnd, isInRange, isHidden };
  });
});
</script>

<template>
  <div class="o-date-panel-years">
    <div
      v-for="y in years"
      :key="y.year"
      class="o-date-panel-cell"
      :class="{
        'is-selected': y.isSelected,
        'is-disabled': y.isDisabled,
        'is-current': y.isCurrent,
        'is-other-period': !y.isInDecade,
        'is-range-start': y.isRangeStart,
        'is-range-end': y.isRangeEnd,
        'is-in-range': y.isInRange,
      }"
      @click="!y.isDisabled && !y.isHidden && emits('select', y.year)"
      @mouseenter="!y.isDisabled && !y.isHidden && emits('hover', dayjs().year(y.year))"
    >
      <OButton :round="datePickerCtx.round?.value" variant="solid" class="o-date-panel-btn" :disabled="y.isDisabled || !y.isInDecade">{{ y.year }}</OButton>
    </div>
  </div>
</template>
