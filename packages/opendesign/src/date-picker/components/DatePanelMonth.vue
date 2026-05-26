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

import { isMonthDisabled } from '../utils.ts';
import { datePickerInjectKey } from '../provide.ts';
import { DisabledMonthFn } from '../types.ts';

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
    const isSelected = props.selectedDate ? props.selectedDate.year() === props.year && props.selectedDate.month() === i : false;
    const isCurrent = todayVal ? todayVal.year() === props.year && todayVal.month() === i : false;
    const disabled = isMonthDisabled(props.year, i, {
      disabledMonth: props.disabledMonth,
      minDate: props.minDate ?? null,
      maxDate: props.maxDate ?? null,
    });

    const cellDate = dayjs().year(props.year).month(i).startOf('month');
    const rangeStart = props.rangeStart ? props.rangeStart.startOf('month') : null;
    const rangeEnd = props.rangeEnd ? props.rangeEnd.startOf('month') : null;
    const anchorMonth = props.anchorMonth ? props.anchorMonth.startOf('month') : null;

    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (rangeStart && rangeEnd) {
      // 已确认的范围
      isRangeStart = cellDate.isSame(rangeStart, 'month');
      isRangeEnd = cellDate.isSame(rangeEnd, 'month');
      isInRange = cellDate.isAfter(rangeStart, 'month') && cellDate.isBefore(rangeEnd, 'month');
    } else if (anchorMonth) {
      // 选择进行中：anchorMonth 是锚点，hoverMonth 是另一端，按相对位置确定起止
      if (props.hoverMonth) {
        const hoverM = props.hoverMonth.startOf('month');
        const [effStart, effEnd] = hoverM.isBefore(anchorMonth, 'month') ? [hoverM, anchorMonth] : [anchorMonth, hoverM];
        isRangeStart = cellDate.isSame(effStart, 'month');
        isRangeEnd = cellDate.isSame(effEnd, 'month');
        isInRange = cellDate.isAfter(effStart, 'month') && cellDate.isBefore(effEnd, 'month');
      } else {
        isRangeStart = cellDate.isSame(anchorMonth, 'month');
      }
    }

    return { index: i, isSelected, isCurrent, isDisabled: disabled, isRangeStart, isRangeEnd, isInRange };
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
