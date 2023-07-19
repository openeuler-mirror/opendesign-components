<script setup lang="ts">
import { ref, computed, watch, watchEffect, reactive, Ref } from 'vue';
import { OButton } from '../button';
import { ShortcutParamT, ShortcutT, PickerModeT, DisaplyDayListT, DisaplyYearListT, DisaplyMonthListT, disableCellT } from './types';
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
    yearSelectable?: boolean;
    selectMonth?: boolean;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
    disableCell?: disableCellT;
    displayYearList?: DisaplyYearListT;
    displayMonthList?: DisaplyMonthListT;
    displayDateList?: DisaplyDayListT;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    mode: 'date',
    yearSelectable: true,
    selectMonth: true,
    disableCell: undefined,
    displayYearList: undefined,
    displayMonthList: undefined,
    displayDateList: undefined,
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
    date: ['date', 'datetime'].includes(currentMode.value),
    time: ['time', 'datetime'].includes(currentMode.value),
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
  viewDate.year = p.year || today.year;
  viewDate.month = p.month || today.month;
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

const dateValue = ref<DateValueT>({});
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
 * date picker
 */
const onDateValueUpdate = (v: DateValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDateValueUpdate', v);
};

const onDateSelect = (v: DateValueT, e?: Event) => {
  dateValue.value = v;
  pickerValue.set(v);

  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
  onConfirm(false, e);
};

const onTimeValueUpdate = (v: TimeValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDateValueUpdate', v);
};

const onTimeSelect = (v: TimeValueT, e?: Event) => {
  timeValue.value = v;
  console.log('4', v);

  pickerValue.set(v);
  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
  onConfirm(false, e);
};

const onYearSelect = (v: number, e?: Event) => {
  console.log(currentMode.value, props.mode);
  pickerValue.year = v;

  if (props.mode === 'year') {
    lastDate = pickerValue.date;
    emits('update:value', pickerValue.date);
  }

  onConfirm(false, e);
};

const onMonthSelect = (v: MonthValueT, e?: Event) => {
  pickerValue.set(v);
  lastDate = pickerValue.date;
  emits('update:value', pickerValue.date);
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
const headBtnClick = (dateType: 'year' | 'month', actionType: 'sub' | 'add') => {
  const sign = actionType === 'add' ? 1 : -1;
  if (dateType === 'year') {
    pickerValue.year = viewDate.year + sign;
  } else if (dateType === 'month') {
    pickerValue.month = viewDate.month + sign;
  }
};

const showHead = computed(() => {
  const yearSelectable = ['month', 'date'].includes(props.mode) && props.yearSelectable;
  const selectMonth = ['date'].includes(props.mode) && props.selectMonth;
  return yearSelectable || selectMonth;
});

const headYearValue = computed(() => {
  if (props.mode === 'month') {
    return viewDate.year || '';
  }
  if (props.mode === 'date') {
    return viewDate.year || '';
  }
  return '';
});

const headMonthValue = computed(() => {
  if (currentMode.value === 'date') {
    return pickerValue.month || '';
  }

  return '';
});

const headBtns = computed(() => {
  let year = -1;
  let month = -1;
  if (['month', 'date'].includes(props.mode)) {
    year += 1;
  }
  if (['date'].includes(props.mode)) {
    month += 1;
  }
  if (['month', 'date'].includes(currentMode.value)) {
    year += 1;
  }
  if (['date'].includes(currentMode.value)) {
    month += 1;
  }

  if (props.yearSelectable === false) {
    year = -1;
  }
  return {
    month,
    year,
  };
});
const onHeadYearClick = () => {
  currentMode.value = 'year';
};
const onHeadMonthClick = () => {
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
        <div v-if="headYearValue" class="o-picker-head-year" @click="onHeadYearClick">{{ headYearValue }}</div>
        <div v-if="headMonthValue" class="o-picker-head-month" @click="onHeadMonthClick">{{ headMonthValue }}</div>
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
      <TimePicker
        v-if="showPicker.time"
        :value="timeValue"
        :hide-hour="props.hideHour"
        :hide-minute="props.hideMinute"
        :hide-second="props.hideSecond"
        @update:value="onTimeValueUpdate"
        @select="onTimeSelect"
      />
      <YearPicker
        class="o-picker-pane-year"
        :visible="showPicker.year"
        :value="initValue"
        :disable-cell="disableCellFn"
        :display-year-list="props.displayYearList"
        @select="onYearSelect"
      />
      <MonthPicker
        class="o-picker-pane-month"
        :visible="showPicker.month"
        :value="initValue"
        :column="3"
        :current-year="viewDate.year"
        :disable-cell="disableCellFn"
        :display-month="props.displayMonthList"
        :year-selectable="props.yearSelectable"
        @select="onMonthSelect"
        @select-year="toSelectYear"
      />
      <DatePicker
        v-if="showPicker.date"
        class="o-picker-pane-date"
        :value="initValue"
        :current-year="pickerValue.year"
        :current-month="pickerValue.month"
        :disable-date="disableCellFn"
        @update:value="onDateValueUpdate"
        @select="onDateSelect"
        @select-month="toSelectMonth"
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
