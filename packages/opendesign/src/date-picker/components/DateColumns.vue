<script setup lang="ts">
import { ref, computed, nextTick, inject, onMounted, watch } from 'vue';
import dayjs from 'dayjs';

import { ODivider } from '../../divider';
import { useScreen } from '../../hooks';
import { getRoundClass } from '../../_utils/style-class.ts';
import TimeColumn from '../../time-picker/components/TimeColumn.vue';

import { datePickerInjectKey } from '../provide.ts';
import { useDatePickerOptions } from '../use-date-picker-options.ts';

const datePickerCtx = inject(datePickerInjectKey)!;
const { minDate, maxDate, noResponsive, disabledDate, disabledMonth, disabledYear, round, mode: effectiveMode } = datePickerCtx;

const props = defineProps<{
  mode?: 'year' | 'month' | 'date';
}>();

const currentMode = computed(() => props.mode ?? effectiveMode.value ?? 'date');

const emit = defineEmits<{
  (e: 'change', newVal: { year: number; month?: number; day?: number } | undefined): void;
}>();

const { isPhonePad } = useScreen();
const isResponding = computed(() => !noResponsive?.value && isPhonePad.value);

const roundClass = getRoundClass({ round: round }, 'date-picker-columns');

const currentYear = ref<number>(0);
const currentMonth = ref<number>(0);
const currentDay = ref<number>(1);

const { yearOptions, monthOptions, dayOptions, disabledYearOptions, disabledMonthOptions, disabledDayOptions } = useDatePickerOptions({
  currentYear,
  currentMonth,
  disabledDate,
  disabledMonth,
  disabledYear,
  minDate,
  maxDate,
});

const yearColumnRef = ref<InstanceType<typeof TimeColumn>>();
const monthColumnRef = ref<InstanceType<typeof TimeColumn>>();
const dayColumnRef = ref<InstanceType<typeof TimeColumn>>();

const scrollAllToSelected = async (smooth = false) => {
  await nextTick();
  yearColumnRef.value?.scrollToItem(smooth);
  monthColumnRef.value?.scrollToItem(smooth);
  dayColumnRef.value?.scrollToItem(smooth);
};

onMounted(() => {
  currentYear.value = dayjs().year();
  currentMonth.value = dayjs().month();
  currentDay.value = dayjs().date();
  scrollAllToSelected(false);
});
const setValue = (value?: number) => {
  const d = value ? dayjs(value) : dayjs();
  currentYear.value = d.year();
  currentMonth.value = d.month();
  currentDay.value = d.date();
  scrollAllToSelected(false);
};

const getValue = () => {
  if (currentMode.value === 'year') {
    return { year: currentYear.value };
  }
  if (currentMode.value === 'month') {
    return { year: currentYear.value, month: currentMonth.value };
  }
  return { year: currentYear.value, month: currentMonth.value, day: currentDay.value };
};

const handleYearChange = () => {
  if (currentMode.value === 'year') {
    emit('change', getValue());
    return;
  }
  const validMonth = monthOptions.value.some((opt) => opt.value === currentMonth.value);
  if (!validMonth) {
    currentMonth.value = monthOptions.value[0]?.value ?? 0;
    monthColumnRef.value?.scrollToItem(true);
  }
  if (currentMode.value === 'month') {
    emit('change', getValue());
    return;
  }
  const validDay = dayOptions.value.some((opt) => opt.value === currentDay.value);
  if (!validDay) {
    currentDay.value = dayOptions.value[0]?.value ?? 1;
    dayColumnRef.value?.scrollToItem(true);
  }
  emit('change', getValue());
};

const handleMonthChange = () => {
  if (currentMode.value === 'month') {
    emit('change', getValue());
    return;
  }
  const validDay = dayOptions.value.some((opt) => opt.value === currentDay.value);
  if (!validDay) {
    currentDay.value = dayOptions.value[0]?.value ?? 1;
    dayColumnRef.value?.scrollToItem(true);
  }
  emit('change', getValue());
};

const handleDayChange = () => {
  emit('change', getValue());
};

watch(
  () => [minDate?.value, maxDate?.value],
  () => scrollAllToSelected(false),
);

defineExpose({
  scrollAllToSelected,
  setValue,
  getValue,
});
</script>

<template>
  <div :class="['o-time-panel-columns', 'o-date-panel-columns', roundClass.class.value]" :style="roundClass.style.value">
    <div v-if="isResponding" class="o-time-panel-mask o-date-panel-mask" />
    <TimeColumn
      ref="yearColumnRef"
      v-model="currentYear"
      class="o-date-panel-column-scroller"
      :options="yearOptions"
      :disabled-options="disabledYearOptions"
      :no-responsive="noResponsive"
      @change="handleYearChange"
    />
    <template v-if="currentMode !== 'year'">
      <ODivider v-if="!isResponding" direction="v" class="o-time-panel-column-divider o-date-panel-column-divider" />
      <TimeColumn
        ref="monthColumnRef"
        v-model="currentMonth"
        class="o-date-panel-column-scroller"
        :options="monthOptions"
        :disabled-options="disabledMonthOptions"
        :no-responsive="noResponsive"
        @change="handleMonthChange"
      />
    </template>
    <template v-if="currentMode === 'date'">
      <ODivider v-if="!isResponding" direction="v" class="o-time-panel-column-divider o-date-panel-column-divider" />
      <TimeColumn
        ref="dayColumnRef"
        v-model="currentDay"
        class="o-date-panel-column-scroller"
        :options="dayOptions"
        :disabled-options="disabledDayOptions"
        :no-responsive="noResponsive"
        @change="handleDayChange"
      />
    </template>
  </div>
</template>
