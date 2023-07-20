<script setup lang="ts">
import { OIcon } from '../icon';
import { IconCalendarPrevYear, IconCalendarNextYear, IconCalendarPrevMonth, IconCalendarNextMonth } from '../_utils/icons';
import { computed, reactive } from 'vue';
import { PickerDate, PickerModeT } from './types';
import { Labels } from './date';

const props = withDefaults(
  defineProps<{
    value: Date;
    mode: PickerModeT;
    currentMode: PickerModeT;
    showYear: boolean;
  }>(),
  {}
);

const emits = defineEmits<{
  // 最终值
  (e: 'btn-click', type: 'year' | 'month', value: number): void;
  (e: 'value-click', type: 'year' | 'month'): void;
}>();

const currentValue = computed(() => new PickerDate(props.value));

const btns = reactive({
  year: {
    show: true,
    add: true,
    sub: true,
  },
  month: {
    show: ['data'],
    add: true,
    sub: true,
  },
});

const headYearValue = computed(() => {
  if (!props.showYear) {
    return '';
  }
  if (['month', 'date'].includes(props.mode)) {
    return currentValue.value.year + Labels.year || '';
  }
  return '';
});

const headMonthValue = computed(() => {
  if (['date'].includes(props.mode)) {
    return currentValue.value.month + 1 + Labels.month || '';
  }

  return '';
});

/**
 * head 操作
 */
const headBtnClick = (dateType: 'year' | 'month', actionType: 'sub' | 'add') => {
  const sign = actionType === 'add' ? 1 : -1;
  emits('btn-click', dateType, sign);
};

const onHeadYearClick = () => {
  emits('value-click', 'year');
};
const onHeadMonthClick = () => {
  emits('value-click', 'month');
};
</script>
<template>
  <div class="o-picker-head">
    <div class="o-picker-head-btns">
      <OIcon v-if="btns.year.show" class="o-picker-btn" button :icon="IconCalendarPrevYear" :disabled="!btns.year.sub" @click="headBtnClick('year', 'sub')" />
      <OIcon
        v-if="btns.year.show"
        class="o-picker-btn"
        button
        :icon="IconCalendarPrevMonth"
        :disabled="!btns.month.sub"
        @click="headBtnClick('month', 'sub')"
      />
    </div>
    <div class="o-picker-head-value">
      <div class="o-picker-head-year" @click="onHeadYearClick">
        {{ headYearValue }}
      </div>
      <div class="o-picker-head-month" @click="onHeadMonthClick">
        {{ headMonthValue }}
      </div>
    </div>
    <div class="o-picker-head-btns">
      <OIcon
        v-if="btns.year.show"
        class="o-picker-btn"
        button
        :icon="IconCalendarNextMonth"
        :disabled="!btns.month.add"
        @click="headBtnClick('month', 'add')"
      />
      <OIcon v-if="btns.year.show" class="o-picker-btn" button :icon="IconCalendarNextYear" :disabled="!btns.year.add" @click="headBtnClick('year', 'add')" />
    </div>
  </div>
</template>
