<script setup lang="ts">
/**
 * DatePanelMonth - 月份选择面板组件
 *
 * 用于在 month 模式或 date 模式的月份视图中展示12个月份供选择
 * 支持范围选择状态（rangeStart/rangeEnd）和悬停预览（hoverMonth）
 *
 * Props:
 * - year: 面板显示的年份
 * - selectedDate: 当前选中的日期（用于单日期选择场景）
 * - rangeStart/rangeEnd: 范围选择的起始/结束月份
 * - hoverMonth: 悬停预览的月份（用于范围选择时的实时预览）
 *
 * 状态计算逻辑与 DatePanelCalendar 保持一致：
 * - isRangeStart: 当前月份是否为范围起始点
 * - isRangeEnd: 当前月份是否为范围结束点（优先用 rangeEnd，否则用 hoverMonth）
 * - isInRange: 当前月份是否在范围内
 */
import { computed, inject, onMounted, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { useI18n } from '../../locale';
import { OButton } from '../../button';

import { isMonthDisabled, computeRangeState } from '../utils.ts';
import { datePickerInjectKey } from '../provide.ts';
import { DisabledMonthFn } from '../types.ts';

interface MonthCellBaseParams {
  /** 月份索引（0-indexed） */
  index: number;
  /** 面板年份 */
  year: number;
  /** 当前选中日期 */
  selectedDate: Dayjs | null;
  /** 今天的日期 */
  todayDate: Dayjs | null;
}

/**
 * 计算月份格子的选中/当前状态
 * @param index - 月份索引（0-indexed）
 * @param year - 面板年份
 * @param selectedDate - 当前选中日期
 * @param todayDate - 今天的日期
 * @returns isSelected 和 isCurrent 状态
 */
function computeMonthCellBase({ index, year, selectedDate, todayDate }: MonthCellBaseParams) {
  const isSelected = selectedDate ? selectedDate.year() === year && selectedDate.month() === index : false;
  const isCurrent = todayDate ? todayDate.year() === year && todayDate.month() === index : false;
  return { isSelected, isCurrent };
}

const props = defineProps<{
  year: number;
  selectedDate: Dayjs | null;
  disabledMonth?: DisabledMonthFn;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  /** 已确认的范围起始月份（排序后） */
  rangeStart?: Dayjs | null;
  /** 已确认的范围结束月份（排序后） */
  rangeEnd?: Dayjs | null;
  /** 第一次点击的锚点月份（选择进行中时传入，顺序无意义） */
  anchorMonth?: Dayjs | null;
  /** 悬停预览月份（selecting='end' 时传入，用于实时预览） */
  hoverMonth?: Dayjs | null;
}>();

const emits = defineEmits<{
  (e: 'select', month: number): void;
  (e: 'hover', date: Dayjs): void;
}>();

const datePickerCtx = inject(datePickerInjectKey)!;

const { t } = useI18n();

const today = ref<Dayjs | null>(null);
onMounted(() => {
  today.value = dayjs();
});

const months = computed(() => {
  const todayVal = today.value;
  return Array.from({ length: 12 }, (_, i) => {
    const { isSelected, isCurrent } = computeMonthCellBase({ index: i, year: props.year, selectedDate: props.selectedDate, todayDate: todayVal });
    const isDisabled = isMonthDisabled(props.year, i, { disabledMonth: props.disabledMonth, minDate: props.minDate ?? null, maxDate: props.maxDate ?? null });
    const cellDate = dayjs().year(props.year).month(i).startOf('month');
    const { isRangeStart, isRangeEnd, isInRange } = computeRangeState({
      cell: cellDate,
      unit: 'month',
      rangeStart: props.rangeStart ? props.rangeStart.startOf('month') : null,
      rangeEnd: props.rangeEnd ? props.rangeEnd.startOf('month') : null,
      anchorDate: props.anchorMonth ? props.anchorMonth.startOf('month') : null,
      hoverDate: props.hoverMonth ? props.hoverMonth.startOf('month') : null,
    });
    return { index: i, isSelected, isCurrent, isDisabled, isRangeStart, isRangeEnd, isInRange };
  });
});
</script>

<template>
  <div class="o-date-panel-months">
    <div
      v-for="m in months"
      :key="m.index"
      class="o-date-panel-cell"
      :class="{
        'is-selected': m.isSelected,
        'is-disabled': m.isDisabled,
        'is-current': m.isCurrent,
        'is-range-start': m.isRangeStart,
        'is-range-end': m.isRangeEnd,
        'is-in-range': m.isInRange,
      }"
      @click="!m.isDisabled && emits('select', m.index)"
      @mouseenter="!m.isDisabled && emits('hover', dayjs().year(props.year).month(m.index))"
    >
      <OButton :round="datePickerCtx.round?.value" variant="solid" class="o-date-panel-btn" :disabled="m.isDisabled">
        {{ t(`datePicker.monthsShort.${m.index}`) }}
      </OButton>
    </div>
  </div>
</template>
