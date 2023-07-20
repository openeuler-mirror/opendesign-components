<script setup lang="ts">
import { ref, computed, watch, watchEffect, reactive, Ref } from 'vue';
import { OButton } from '../button';
import {
  ShortcutParamT,
  ShortcutT,
  PickerModeT,
  DisaplyDayListT,
  DisaplyYearListT,
  DisaplyMonthListT,
  disableYearCellT,
  disableMonthCellT,
  disableDayCellT,
} from './types';
import { OLink } from '../link';
import { Labels } from './date';
import { isFunction } from '../_utils/is';
import { PickerDate } from './picker-date';
import TimePicker from './TimePicker.vue';
import type { TimeValueT } from './TimePicker.vue';
import DayPicker from './DayPicker.vue';
import type { DayValueT } from './DayPicker.vue';
import YearPicker from './YearPicker.vue';
import MonthPicker from './MonthPicker.vue';
import type { MonthValueT } from './MonthPicker.vue';

import { OIcon } from '../icon';
import { IconCalendarPrevYear, IconCalendarNextYear, IconCalendarPrevMonth, IconCalendarNextMonth } from '../_utils/icons';

const props = withDefaults(
  defineProps<{
    range?: boolean;
    value: Date;
    shortcuts?: Array<ShortcutParamT>;
    needConfirm?: boolean;
    confirmLabel?: string;
    mode?: PickerModeT;
    yearSelectable?: boolean;
    monthSelectable?: boolean;
    selectMonth?: boolean;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
    disableCell?: disableYearCellT | disableMonthCellT | disableDayCellT;
    displayYearList?: DisaplyYearListT;
    displayMonthList?: DisaplyMonthListT;
    displayDayList?: DisaplyDayListT;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    mode: 'date',
    yearSelectable: true,
    monthSelectable: true,
    selectMonth: true,
    disableCell: undefined,
    displayYearList: undefined,
    displayMonthList: undefined,
    displayDayList: undefined,
  }
);

const emits = defineEmits<{
  // 控制输入框展示的当前值
  (e: 'update:value', value: Date): void;
  // 最终值
  (e: 'confirm', value: Date, evt?: Event): void;
}>();

// 控制面板显示
const currentMode = ref(props.mode);
const showPicker = computed(() => {
  return {
    year: ['year', 'year-range'].includes(currentMode.value),
    month: ['month', 'month-range'].includes(currentMode.value),
    day: ['date', 'datetime'].includes(currentMode.value),
    time: ['time', 'datetime'].includes(currentMode.value),
  };
});
const mountPicker = computed(() => {
  const time = ['time', 'datetime'].includes(currentMode.value);
  const day = ['date', 'datetime'].includes(currentMode.value);
  const month = (props.monthSelectable && day) || ['month', 'month-range'].includes(currentMode.value);
  const year = (props.yearSelectable && month) || (props.yearSelectable && day) || ['year', 'year-range'].includes(currentMode.value);

  return {
    year,
    month,
    day,
    time,
  };
});

const today = new PickerDate(new Date());

// 传入的初始值
const initValue = computed(() => new PickerDate(props.value));

const viewDate = reactive({
  year: initValue.value.year || today.year,
  month: initValue.value.month || today.month,
});

// 当前面板值
const pickerValue: PickerDate = new PickerDate(props.value, (p: PickerDate) => {
  if (mountPicker.value.year) {
    viewDate.year = Number.isNaN(p.year) ? today.year : p.year;
  }
  if (mountPicker.value.month) {
    viewDate.month = Number.isNaN(p.month) ? today.month : p.month;
  }
});

let lastDate: Date = pickerValue.date;

console.log(pickerValue.date);

const disableCellFn = isFunction(props.disableCell) ? props.disableCell : () => false;
const isShortcutSelecting = ref(false);

watch(
  () => props.value,
  (v: Date) => {
    if (pickerValue.date !== v) {
      pickerValue.date = v;

      lastDate = v;
    }
  }
);

const dateValue = ref<DayValueT>({});
const timeValue = ref<TimeValueT>({});

watchEffect(() => {
  // time picker
  timeValue.value = {
    hour: initValue.value.hour,
    minute: initValue.value.minute,
    second: initValue.value.second,
  };
});

// 是否需要确认按钮
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
  isShortcutSelecting.value = false;

  if (currentMode.value !== props.mode) {
    currentMode.value = props.mode;
    return;
  }
  if (needConfirm.value && !force) {
    return;
  }
  emits('confirm', pickerValue.date, e);
};

/**
 * year picker
 */
const onYearSelect = (v: number, e?: Event) => {
  console.log(currentMode.value, props.mode);
  pickerValue.year = v;

  if (props.mode === 'year') {
    lastDate = pickerValue.date;
    emits('update:value', pickerValue.date);
  }

  onConfirm(false, e);
};

/**
 * month picker
 */
const onMonthSelect = (v: MonthValueT, e?: Event) => {
  pickerValue.set(v);
  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
  onConfirm(false, e);
};

/**
 * date picker
 */
const onDayValueUpdate = (v: DayValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDayValueUpdate', v);
};

const onDaySelect = (v: DayValueT, e?: Event) => {
  dateValue.value = v;
  pickerValue.set(v);

  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
  onConfirm(false, e);
};

/**
 * time picker
 */
const onTimeValueUpdate = (v: TimeValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDayValueUpdate', v);
};

const onTimeSelect = (v: TimeValueT, e?: Event) => {
  timeValue.value = v;
  console.log('4', v);

  pickerValue.set(v);
  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
  onConfirm(false, e);
};

const toSelectYear = () => {
  if (props.yearSelectable === false) {
    return;
  }

  if (currentMode.value !== 'year') {
    currentMode.value = 'year';
  } else {
    currentMode.value = props.mode;
  }
};
const toSelectMonth = () => {
  if (currentMode.value !== 'month') {
    currentMode.value = 'month';
  } else {
    currentMode.value = props.mode;
  }
};

/**
 * head 操作
 */
const headBtnClick = (dateType: 'year' | 'month', actionType: 'sub' | 'add') => {
  const sign = actionType === 'add' ? 1 : -1;
  if (dateType === 'year') {
    pickerValue.year = viewDate.year + sign;
  } else if (dateType === 'month') {
    pickerValue.month = viewDate.month + sign;
  }
};

const showHead = computed(() => {
  // const yearSelectable = ['month', 'date'].includes(props.mode) && props.yearSelectable;
  // const monthSelectable = ['date'].includes(props.mode) && props.monthSelectable;
  // return yearSelectable || monthSelectable;
  return ['date'].includes(props.mode) || props.yearSelectable;
});

const headYearValue = computed(() => {
  if (!props.yearSelectable) {
    return '';
  }
  if (['month', 'date'].includes(props.mode)) {
    return viewDate.year + Labels.year || '';
  }
  return '';
});

const headMonthValue = computed(() => {
  if (['date'].includes(props.mode)) {
    return viewDate.month + 1 + Labels.month || '';
  }

  return '';
});

const headBtns = computed(() => {
  let year = -1;
  let month = -1;
  if (props.yearSelectable) {
    if (['month', 'date'].includes(props.mode)) {
      year += 1;
    }
    if (['month', 'date'].includes(currentMode.value)) {
      year += 1;
    }
  }
  if (['date'].includes(props.mode)) {
    month += 1;
  }
  if (['date'].includes(currentMode.value)) {
    month += 1;
  }

  return {
    month,
    year,
  };
});
const onHeadYearClick = () => {
  toSelectYear();
};
const onHeadMonthClick = () => {
  toSelectMonth();
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
  pickerValue.date = v;
  lastDate = v;

  emits('update:value', pickerValue.date);
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
    isShortcutSelecting.value = true;
    hoverInTimer = 0;
    const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
    pickerValue.date = v;
    emits('update:value', pickerValue.date);
  }, hoverDelay);
};
// hover out恢复之前值
const onShortcutMouseLeave = () => {
  clearTimer();

  hoverOutTimer = window.setTimeout(() => {
    hoverOutTimer = 0;

    if (dateValue.value !== lastDate) {
      isShortcutSelecting.value = false;
      pickerValue.date = lastDate;

      emits('update:value', pickerValue.date);
    }
  }, hoverDelay);
};
</script>
<template>
  <div class="o-picker-pane">
    <div v-if="showHead" class="o-picker-head">
      <div class="o-picker-head-btns">
        <OIcon
          v-if="headBtns.year > -1"
          class="o-picker-btn"
          button
          :icon="IconCalendarPrevYear"
          :disabled="headBtns.year === 0"
          @click="headBtnClick('year', 'sub')"
        />
        <OIcon v-if="headBtns.month > -1" class="o-picker-btn" button :icon="IconCalendarPrevMonth" @click="headBtnClick('month', 'sub')" />
      </div>
      <div class="o-picker-head-value">
        <div v-if="headYearValue" class="o-picker-head-year" @click="onHeadYearClick">
          {{ headYearValue }}
        </div>
        <div v-if="headMonthValue" class="o-picker-head-month" @click="onHeadMonthClick">
          {{ headMonthValue }}
        </div>
      </div>
      <div class="o-picker-head-btns">
        <OIcon v-if="headBtns.month > -1" class="o-picker-btn" button :icon="IconCalendarNextMonth" @click="headBtnClick('month', 'add')" />
        <OIcon
          v-if="headBtns.year > -1"
          class="o-picker-btn"
          button
          :icon="IconCalendarNextYear"
          :disabled="headBtns.year === 0"
          @click="headBtnClick('year', 'add')"
        />
      </div>
    </div>
    <div
      class="o-picker-main"
      :class="{
        'o-picker-selecting': isShortcutSelecting,
      }"
    >
      <YearPicker
        v-if="mountPicker.year"
        class="o-picker-pane-year"
        :visible="showPicker.year"
        :value="initValue"
        :disable-cell="(disableCellFn as disableYearCellT)"
        :display-year-list="props.displayYearList"
        @select="onYearSelect"
      />
      <MonthPicker
        v-if="mountPicker.month"
        class="o-picker-pane-month"
        :visible="showPicker.month"
        :value="initValue"
        :column="3"
        :current-year="viewDate.year"
        :disable-cell="(disableCellFn as disableMonthCellT)"
        :display-month-list="props.displayMonthList"
        :year-selectable="props.yearSelectable"
        @select="onMonthSelect"
        @select-year="toSelectYear"
      />
      <DayPicker
        v-if="mountPicker.day"
        class="o-picker-pane-date"
        :visible="showPicker.day"
        :value="initValue"
        :current-year="viewDate.year"
        :current-month="viewDate.month"
        :disable-cell="(disableCellFn as disableDayCellT)"
        :display-day-list="props.displayDayList"
        @update:value="onDayValueUpdate"
        @select="onDaySelect"
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
