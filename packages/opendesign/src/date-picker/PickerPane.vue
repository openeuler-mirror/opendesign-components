<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { OButton } from '../button';
import { ShortcutParamT, ShortcutT, PickerModeT } from './types';
import { OLink } from '../link';
import { Labels } from './date';
import { isFunction } from '../_utils/is';
import { PickerDate } from './picker-date';
import TimePicker from './TimePicker.vue';
import type { TimeValueT } from './TimePicker.vue';
import DatePicker from './DatePicker.vue';
import type { DateValueT } from './DatePicker.vue';
import YearPicker from './YearPicker.vue';
import MonthPicker from './MonthPicker.vue';
import type { MonthValueT } from './MonthPicker.vue';

import { OIcon } from '../icon';
import { IconCalendarPrevYear, IconCalendarNextYear, IconCalendarPrevMonth, IconCalendarNextMonth } from '../_utils/icons';
import { addYears, subYears, addMonths, subMonths } from '../_utils/date';

const props = withDefaults(
  defineProps<{
    range?: boolean;
    value: Date;
    shortcuts?: Array<ShortcutParamT>;
    needConfirm?: boolean;
    confirmLabel?: string;
    mode?: PickerModeT;
    selectYear?: boolean;
    selectMonth?: boolean;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
    disableDate?: (current: Date, type?: 'start' | 'end') => boolean;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    mode: 'date',
    disableDate: undefined,
    selectYear: true,
    selectMonth: true,
  }
);

const emits = defineEmits<{
  // 控制输入框展示的当前值
  (e: 'update:value', value: Date): void;
  // 最终值
  (e: 'confirm', value: Date, evt?: Event): void;
}>();

const initValue = computed(() => new PickerDate(props.value));
const pickerValue = ref<InstanceType<typeof PickerDate>>(initValue.value);
const viewValue = ref<InstanceType<typeof PickerDate>>(initValue.value);
let lastDate: Date = pickerValue.value.date;
console.log(pickerValue.value.date);
const disableDate = isFunction(props.disableDate) ? props.disableDate : () => false;

watch(
  () => props.value,
  (v: Date) => {
    if (pickerValue.value.date !== v) {
      pickerValue.value = new PickerDate(v);
      viewValue.value = new PickerDate(v);

      lastDate = v;
    }
  }
);

const dateValue = ref<DateValueT>({});
const timeValue = ref<TimeValueT>({});
const monthValue = ref<MonthValueT>();

watchEffect(() => {
  monthValue.value = {
    years: initValue.value.years,
    months: initValue.value.months,
  };

  dateValue.value = {
    years: initValue.value.years,
    months: initValue.value.months,
    days: initValue.value.days,
  };
  // time picker
  timeValue.value = {
    hours: initValue.value.hours,
    minutes: initValue.value.minutes,
    seconds: initValue.value.seconds,
  };
});

const currentMode = ref(props.mode);
const showPicker = computed(() => {
  return {
    year: ['year', 'year-range'].includes(currentMode.value),
    month: ['month', 'month-range'].includes(currentMode.value),
    date: ['date', 'datetime'].includes(currentMode.value),
    time: ['time', 'datetime'].includes(currentMode.value),
  };
});

const confirmLabel = computed(() => (props.confirmLabel ? props.confirmLabel : Labels.confirm));
const needConfirm = computed(() => {
  if (['datetime', 'daterange', 'datetimerange', 'monthrange'].includes(currentMode.value)) {
    return true;
  }
  if (props.needConfirm) {
    return true;
  }
  return false;
});

/**
 * 确认提交
 * @param force 强制提交
 * @param e
 */
const onConfirm = (force: boolean, e?: Event) => {
  if (currentMode.value !== props.mode) {
    currentMode.value = props.mode;
    return;
  }
  if (needConfirm.value && !force) {
    return;
  }
  emits('confirm', pickerValue.value.date, e);
};

/**
 * date picker
 */
const onDateValueUpdate = (v: DateValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDateValueUpdate', v);
};

const onDateSelect = (v: DateValueT, e?: Event) => {
  dateValue.value = v;
  pickerValue.value.set(v);

  lastDate = pickerValue.value.date;
  emits('update:value', pickerValue.value.date);
  onConfirm(false, e);
};

const onTimeValueUpdate = (v: TimeValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDateValueUpdate', v);
};

const onTimeSelect = (v: TimeValueT, e?: Event) => {
  timeValue.value = v;
  console.log('4', v);

  pickerValue.value.set(v);
  lastDate = pickerValue.value.date;
  emits('update:value', pickerValue.value.date);
  onConfirm(false, e);
};

const onYearSelect = (v: number, e?: Event) => {
  pickerValue.value.years = v;
  lastDate = pickerValue.value.date;
  emits('update:value', pickerValue.value.date);
  onConfirm(false, e);
};

const onMonthSelect = (v: MonthValueT, e?: Event) => {
  pickerValue.value.set(v);
  lastDate = pickerValue.value.date;
  emits('update:value', pickerValue.value.date);
  onConfirm(false, e);
};

const toSelectYear = () => {
  currentMode.value = 'year';
};
const toSelectMonth = () => {
  currentMode.value = 'month';
};

/**
 * head 操作
 */
const headActionFn = {
  year: {
    add: addYears,
    sub: subYears,
  },
  month: {
    add: addMonths,
    sub: subMonths,
  },
};
const headBtnClick = (dateType: 'year' | 'month', actionType: 'sub' | 'add') => {
  const value = headActionFn[dateType][actionType](pickerValue.value.date, 1);
  pickerValue.value.date = value;
};

const showHead = computed(() => {
  const selectYear = ['month', 'date'].includes(props.mode) && props.selectYear;
  const selectMonth = ['date'].includes(props.mode) && props.selectMonth;
  return selectYear || selectMonth;
});

const headYearValue = computed(() => {
  if (props.mode === 'month') {
    return pickerValue.value.years || '';
  }

  return '';
});

const headMonthValue = computed(() => {
  if (currentMode.value === 'date') {
    return pickerValue.value.months || '';
  }

  return '';
});

const headBtns = computed(() => {
  let years = -1;
  let months = -1;
  if (['month', 'date'].includes(props.mode)) {
    years += 1;
  }
  if (['date'].includes(props.mode)) {
    months += 1;
  }
  if (['month', 'date'].includes(currentMode.value)) {
    years += 1;
  }
  if (['date'].includes(currentMode.value)) {
    months += 1;
  }

  if (props.selectYear === false) {
    years = -1;
  }
  return {
    months,
    years,
  };
});
const onHeadYearClick = () => {
  // emits('select-year');
  currentMode.value = 'year';
};
const onHeadMonthClick = () => {
  // emits('select-month');
  currentMode.value = 'month';
};
//shortcuts
const shortcuts = computed(() => {
  if (props.shortcuts && props.shortcuts.length > 0) {
    return props.shortcuts.map((item) => {
      if (item === 'now') {
        return {
          label: Labels.now,
          value: () => new Date(),
        };
      }
      return item;
    });
  }
  return null;
});
/*
 * 快捷按钮shortcut
 */
const onShortcutClick = (e: Event, shortcut: ShortcutT) => {
  const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
  pickerValue.value.date = v;
  lastDate = v;

  emits('update:value', pickerValue.value.date);
  onConfirm(false, e);
};
// 避免频繁更新dom
let hoverInTimer: number = 0;
let hoverOutTimer: number = 0;
const hoverDelay = 100;
const clearTimer = () => {
  if (hoverInTimer) {
    clearTimeout(hoverInTimer);
    hoverInTimer = 0;
  }
  if (hoverOutTimer) {
    clearTimeout(hoverOutTimer);
    hoverOutTimer = 0;
  }
};
// hover in时快速显示
const onShortcutMouseEnter = (e: Event, shortcut: ShortcutT) => {
  clearTimer();

  hoverInTimer = window.setTimeout(() => {
    hoverInTimer = 0;
    const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
    pickerValue.value.date = v;
    emits('update:value', pickerValue.value.date);
  }, hoverDelay);
};
// hover out恢复之前值
const onShortcutMouseLeave = () => {
  clearTimer();

  hoverOutTimer = window.setTimeout(() => {
    hoverOutTimer = 0;

    if (dateValue.value !== lastDate) {
      pickerValue.value.date = lastDate;
      emits('update:value', pickerValue.value.date);
    }
  }, hoverDelay);
};

const displayMonths = (year: number) => {
  console.log('displayMonths', year);

  return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月'].map((item, idx) => {
    return {
      value: idx,
      label: item,
    };
  });
};
</script>
<template>
  <div class="o-picker-pane">
    <div v-if="showHead" class="o-picker-head">
      <div class="o-picker-head-btns">
        <OIcon
          v-if="headBtns.years > -1"
          class="o-picker-btn"
          button
          :icon="IconCalendarPrevYear"
          :disabled="headBtns.years === 0"
          @click="headBtnClick('year', 'sub')"
        />
        <OIcon v-if="headBtns.months > -1" class="o-picker-btn" button :icon="IconCalendarPrevMonth" @click="headBtnClick('month', 'sub')" />
      </div>
      <div class="o-picker-head-value">
        <!-- <slot name="date-head-label" :select-value="selectValue" :view-month="viewMonthDate.months" :view-year="viewMonthDate.years" :to-select-fn="toSelectFn">

        </slot> -->
        <div v-if="headYearValue" class="o-picker-head-year" @click="onHeadYearClick">{{ headYearValue }}</div>
        <div v-if="headMonthValue" class="o-picker-head-month" @click="onHeadMonthClick">{{ headMonthValue }}</div>
      </div>
      <div class="o-picker-head-btns">
        <OIcon v-if="headBtns.months > -1" class="o-picker-btn" button :icon="IconCalendarNextMonth" @click="headBtnClick('month', 'add')" />
        <OIcon
          v-if="headBtns.years > -1"
          class="o-picker-btn"
          button
          :icon="IconCalendarNextYear"
          :disabled="headBtns.years === 0"
          @click="headBtnClick('year', 'add')"
        />
      </div>
    </div>
    <div class="o-picker-main">
      <DatePicker
        v-if="showPicker.date"
        :value="dateValue"
        @update:value="onDateValueUpdate"
        @select="onDateSelect"
        @select-month="toSelectMonth"
        @select-year="toSelectYear"
      />
      <TimePicker
        v-if="showPicker.time"
        :value="timeValue"
        :hide-hour="props.hideHour"
        :hide-minute="props.hideMinute"
        :hide-second="props.hideSecond"
        @update:value="onTimeValueUpdate"
        @select="onTimeSelect"
      />
      <YearPicker v-if="showPicker.year" class="o-picker-pane-year" :value="initValue" :disable-date="disableDate" @select="onYearSelect" />
      <MonthPicker
        v-if="showPicker.month"
        class="o-picker-pane-month"
        :value="initValue"
        :current-years="pickerValue.years"
        :disable-date="disableDate"
        :display-months="displayMonths"
        :column="3"
        :select-year="props.selectYear"
        @select="onMonthSelect"
        @select-year="toSelectYear"
      />
    </div>
    <div v-if="$slots.footer" class="o-picker-extra">
      <slot name="extra"></slot>
    </div>
    <div
      class="o-picker-foot"
      :class="{
        'has-confirm': needConfirm,
      }"
    >
      <div v-if="shortcuts" class="o-picker-shortcut">
        <template v-for="item in shortcuts" :key="item">
          <div
            class="o-picker-shortcut-item"
            @click="(e) => onShortcutClick(e, item)"
            @mouseenter="(e:Event) => onShortcutMouseEnter(e, item)"
            @mouseleave="(e:Event) => onShortcutMouseLeave()"
          >
            <slot name="shortcut" :shortcut="item">
              <OLink color="primary">{{ item.label }}</OLink>
            </slot>
          </div>
        </template>
      </div>
      <div v-if="needConfirm" class="o-picker-shortcut">
        <OButton color="primary" size="small" @click="(e) => onConfirm(true, e)">{{ confirmLabel }}</OButton>
      </div>
    </div>
  </div>
</template>
