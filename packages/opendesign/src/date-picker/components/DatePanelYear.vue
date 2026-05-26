<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { OButton } from '../../button';

import { isYearDisabled } from '../utils.ts';
import { datePickerInjectKey } from '../provide.ts';
import { DisabledYearFn } from '../types.ts';

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
  const rangeStartYear = props.rangeStart?.year() ?? null;
  const rangeEndYear = props.rangeEnd?.year() ?? null;
  const anchorYear = props.anchorYear?.year() ?? null;
  const hoverYear = props.hoverYear?.year() ?? null;

  return Array.from({ length: 12 }, (_, i) => {
    const y = decadeStart.value - 1 + i;
    const isSelected = props.selectedDate ? props.selectedDate.year() === y : false;
    const isCurrent = todayVal ? todayVal.year() === y : false;
    const disabled = isYearDisabled(y, {
      disabledYear: props.disabledYear,
      minDate: props.minDate ?? null,
      maxDate: props.maxDate ?? null,
    });
    const isInDecade = i >= 1 && i <= 10;
    const isHidden = props.hideOutOfDecade && !isInDecade;

    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (isInDecade) {
      if (rangeStartYear !== null && rangeEndYear !== null) {
        // 已确认的范围
        isRangeStart = y === rangeStartYear;
        isRangeEnd = y === rangeEndYear;
        isInRange = y > rangeStartYear && y < rangeEndYear;
      } else if (anchorYear !== null) {
        // 选择进行中：anchorYear 是锚点，hoverYear 是另一端，按相对位置确定起止
        if (hoverYear !== null) {
          const effStart = Math.min(anchorYear, hoverYear);
          const effEnd = Math.max(anchorYear, hoverYear);
          isRangeStart = y === effStart;
          isRangeEnd = y === effEnd;
          isInRange = y > effStart && y < effEnd;
        } else {
          isRangeStart = y === anchorYear;
        }
      }
    }

    return { year: y, isSelected, isCurrent, isDisabled: disabled, isInDecade, isRangeStart, isRangeEnd, isInRange, isHidden };
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
