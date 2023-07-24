<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  ShortcutParamT,
  PickerModeT,
  DisaplyDayListT,
  DisaplyYearListT,
  DisaplyMonthListT,
  disableYearCellT,
  disableMonthCellT,
  disableDayCellT,
  disableTimeCellT,
} from './types';
import { Labels } from './date';
import { isFunction, isValidDate } from '../_utils/is';
import { PickerDate } from './picker-date';
import TimePicker from './picker/TimePicker.vue';
import type { TimeValueT } from './picker/TimePicker.vue';
import DayPicker from './picker/DayPicker.vue';
import type { DayValueT } from './picker/DayPicker.vue';
import MonthPicker from './picker/MonthPicker.vue';
import type { MonthValueT } from './picker/MonthPicker.vue';
import YearPicker from './picker/YearPicker.vue';
import PickerHead from './PickerHead.vue';
import PickerFoot from './PickerFoot.vue';
import { isSameDate } from '../_utils/date';
import { formatDate } from '../_utils/date';

const props = withDefaults(
  defineProps<{
    value: Date;
    formateString: string;
    range?: boolean;
    shortcuts?: Array<ShortcutParamT>;
    needConfirm?: boolean;
    confirmLabel?: string;
    clearLabel?: string;
    mode?: PickerModeT;
    yearSelectable?: boolean;
    monthSelectable?: boolean;
    disableCell?: disableYearCellT | disableMonthCellT | disableDayCellT;
    disableTimeCell?: disableTimeCellT;
    displayYearList?: DisaplyYearListT;
    displayMonthList?: DisaplyMonthListT;
    displayDayList?: DisaplyDayListT;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    clearLabel: '',
    mode: 'date',
    yearSelectable: true,
    monthSelectable: true,
    disableCell: undefined,
    disableTimeCell: undefined,
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
  (e: 'clear', evt: Event): void;
}>();

// 控制面板显示
const currentMode = ref(props.mode);
const showPicker = computed(() => {
  return {
    year: ['year', 'year-range'].includes(currentMode.value),
    month: ['month', 'month-range'].includes(currentMode.value),
    day: ['date', 'datetime'].includes(currentMode.value),
  };
});
const mountPicker = computed(() => {
  const time = ['time', 'datetime'].includes(props.mode);
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
today.set({ hour: 0, minute: 0, second: 0 });

// 当前面板值
const viewValue = ref<Date>(isValidDate(props.value) ? props.value : today.date);
const pickerValue: PickerDate = new PickerDate(props.value, (p: PickerDate) => {
  if (isValidDate(p.date)) {
    if (!isSameDate(p.date, viewValue.value)) {
      viewValue.value = p.date;
    }
  } else {
    viewValue.value = today.date;
  }
});

let lastDate: Date = pickerValue.date;

console.log(pickerValue.date);

const disableCellFn = isFunction(props.disableCell) ? props.disableCell : () => false;
const disableTimeCellFn = isFunction(props.disableTimeCell) ? props.disableTimeCell : () => false;
const isShortcutSelecting = ref(false);

watch(
  () => props.value,
  (v: Date) => {
    if (!isSameDate(pickerValue.date, v)) {
      pickerValue.date = v;

      lastDate = v;
    }
  }
);

// // 是否需要确认按钮
// const confirmLabel = computed(() => (props.confirmLabel ? props.confirmLabel : Labels.confirm));
// const clearLabel = computed(() => (props.clearLabel ? props.clearLabel : Labels.clear));

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
 * 清除已选择
 * @param force 强制提交
 * @param e
 */
const onClear = (e: Event) => {
  emits('clear', e);
};

/**
 * year picker
 */
const onYearSelect = (v: number, e?: Event) => {
  pickerValue.year = v;
  if (props.mode === 'year') {
    emits('update:value', pickerValue.date);
    lastDate = pickerValue.date;
  }

  onConfirm(false, e);
};

/**
 * month picker
 */
const onMonthSelect = (v: MonthValueT, e?: Event) => {
  pickerValue.set(v);
  if (props.mode === 'month') {
    emits('update:value', pickerValue.date);
    lastDate = pickerValue.date;
  }
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
  pickerValue.set(v);
  emits('update:value', pickerValue.date);
  lastDate = pickerValue.date;
  onConfirm(false, e);
};

/**
 * time picker
 */

const hideHour = computed(() => !props.formateString.includes('H'));
const hideMinute = computed(() => !props.formateString.includes('m'));
const hideSecond = computed(() => !props.formateString.includes('s'));

const timeHeadValue = computed(() => {
  const fs: string[] = [];
  if (!hideHour.value) {
    fs.push('HH');
  }
  if (!hideMinute.value) {
    fs.push('mm');
  }
  if (!hideSecond.value) {
    fs.push('ss');
  }
  return formatDate(viewValue.value, fs.join(':'));
});
const onTimeValueUpdate = (v: TimeValueT) => {
  // 范围选择时，需要hover时刷新输入框值
  console.log('onDayValueUpdate', v);
};

const onTimeSelect = (v: TimeValueT, e?: Event) => {
  console.log(v);

  pickerValue.set({
    hour: v.hour || 0,
    minute: v.minute || 0,
    second: v.second || 0,
  });
  emits('update:value', pickerValue.date);
  lastDate = pickerValue.date;
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
const onHeadBtnClick = (dateType: 'year' | 'month', value: number) => {
  const cp = pickerValue.valid ? pickerValue : new PickerDate(viewValue.value);
  if (dateType === 'year') {
    pickerValue.year = cp.year + value;
  } else if (dateType === 'month') {
    pickerValue.month = cp.month + value;
  }
};

const noHead = computed(() => {
  if (['year', 'time'].includes(props.mode)) {
    return true;
  }

  if (props.mode === 'month' && !props.yearSelectable) {
    return true;
  }

  return false;
});

const onHeadValueClick = (type: 'year' | 'month') => {
  if (type === 'year') {
    toSelectYear();
  } else if (type === 'month') {
    toSelectMonth();
  }
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
const onShortcutClick = (value: Date, e: Event) => {
  pickerValue.date = value;

  emits('update:value', value);
  lastDate = value;
  onConfirm(false, e);
};
// hover in时快速显示
const onShortcutHoverin = (value: Date) => {
  isShortcutSelecting.value = true;
  pickerValue.date = value;
  emits('update:value', value);
};
// hover out恢复之前值
const onShortcutHoverout = () => {
  if (pickerValue.date !== lastDate) {
    isShortcutSelecting.value = false;
    pickerValue.date = lastDate;

    emits('update:value', lastDate);
  }
};
</script>
<template>
  <div class="o-picker-pane">
    <div class="o-picker-main-wrap">
      <div v-if="mountPicker.year || mountPicker.month || mountPicker.day" class="o-picker-main-date">
        <PickerHead
          v-if="!noHead"
          :mode="props.mode"
          :current-mode="currentMode"
          :value="viewValue"
          :show-year="props.yearSelectable"
          @value-click="onHeadValueClick"
          @btn-click="onHeadBtnClick"
        />
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
            :value="props.value"
            :disable-cell="(disableCellFn as disableYearCellT)"
            :display-year-list="props.displayYearList"
            @select="onYearSelect"
          />
          <MonthPicker
            v-if="mountPicker.month"
            class="o-picker-pane-month"
            :visible="showPicker.month"
            :value="props.value"
            :column="3"
            :view-value="viewValue"
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
            :value="props.value"
            :view-value="viewValue"
            :disable-cell="(disableCellFn as disableDayCellT)"
            :display-day-list="props.displayDayList"
            @update:value="onDayValueUpdate"
            @select="onDaySelect"
            @select-month="toSelectMonth"
            @select-year="toSelectYear"
          />
        </div>
      </div>
      <div class="o-picker-main-time">
        <div v-if="$props.mode === 'datetime'" class="o-picker-head">
          <div class="o-picker-head-value">{{ timeHeadValue }}</div>
        </div>
        <TimePicker
          v-if="mountPicker.time"
          class="o-picker-pane-time"
          :value="props.value"
          :view-value="viewValue"
          :hide-hour="hideHour"
          :hide-minute="hideMinute"
          :hide-second="hideSecond"
          :disable-cell="(disableTimeCellFn as disableTimeCellT)"
          @update:value="onTimeValueUpdate"
          @select="onTimeSelect"
        />
      </div>
    </div>
    <PickerFoot
      :shortcuts="shortcuts"
      :need-confirm="needConfirm"
      :confirm-label="props.confirmLabel"
      :clear-label="props.clearLabel"
      @clear="onClear"
      @confirm="(e:Event) => onConfirm(true, e)"
      @shortcut:click="onShortcutClick"
      @shortcut:hoverin="onShortcutHoverin"
      @shortcut:hoverout="onShortcutHoverout"
    />
  </div>
</template>
