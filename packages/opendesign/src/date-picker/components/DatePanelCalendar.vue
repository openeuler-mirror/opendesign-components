<script setup lang="ts">
import { inject } from 'vue';
import { Dayjs } from 'dayjs';

import { useI18n } from '../../locale';
import { OButton } from '../../button';

import { CalendarCell } from '../use-calendar.ts';
import { datePickerInjectKey } from '../provide.ts';

const props = defineProps<{
  rows: CalendarCell[][];
  weekDayHeaders: number[];
}>();

const emits = defineEmits<{
  (e: 'select', date: Dayjs): void;
  (e: 'hover', date: Dayjs): void;
  (e: 'leave'): void;
}>();

const { t } = useI18n();

const datePickerCtx = inject(datePickerInjectKey)!;
</script>

<template>
  <div class="o-date-panel-calendar" @mouseleave="emits('leave')">
    <div v-for="dow in props.weekDayHeaders" :key="dow" class="o-date-panel-cell o-date-panel-weekday">
      {{ t(`datePicker.weekdays.${dow}`) }}
    </div>
    <template v-for="(row, ri) in props.rows" :key="ri">
      <div
        v-for="cell in row"
        :key="cell.date.valueOf()"
        class="o-date-panel-cell"
        :class="{
          'is-current-month': cell.isCurrentMonth,
          'is-current': cell.isToday,
          'is-selected': cell.isSelected,
          'is-disabled': cell.isDisabled,
          'is-other-period': !cell.isCurrentMonth,
          'is-range-start': cell.isRangeStart,
          'is-range-end': cell.isRangeEnd,
          'is-in-range': cell.isInRange,
        }"
        @click="!cell.isDisabled && cell.isCurrentMonth && emits('select', cell.date)"
        @mouseover="!cell.isDisabled && cell.isCurrentMonth && emits('hover', cell.date)"
      >
        <OButton :round="datePickerCtx.round?.value" variant="solid" class="o-date-panel-btn" :disabled="cell.isDisabled || !cell.isCurrentMonth">{{
          cell.day
        }}</OButton>
      </div>
    </template>
  </div>
</template>
