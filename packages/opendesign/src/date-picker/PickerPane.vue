<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { OButton } from '../button';
import { ShortcutParamT, ShortcutT, PickerTypeT } from './types';
import { OLink } from '../link';
import { Labels } from './date';
import { isFunction } from '../_utils/is';
import { PickerDate } from './picker-date';
import TimePicker from './TimePicker.vue';
import type { TimeValueT } from './TimePicker.vue';
import DatePicker from './DatePicker.vue';
import type { DateValueT } from './DatePicker.vue';

const props = withDefaults(
  defineProps<{
    range?: boolean;
    value: Date;
    shortcuts?: Array<ShortcutParamT>;
    needConfirm?: boolean;
    confirmLabel?: string;
    type?: PickerTypeT;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmLabel: '',
    type: 'date',
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
let lastDate: Date = pickerValue.value.date;
console.log(pickerValue.value.date);

watch(
  () => props.value,
  (v: Date) => {
    if (pickerValue.value.date !== v) {
      pickerValue.value.date = v;
      lastDate = v;
    }
  }
);

const dateValue = ref<DateValueT>({});
const timeValue = ref<TimeValueT>({});

watchEffect(() => {
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

const pickerType = ref(props.type);
const showPicker = computed(() => {
  return {
    date: ['date', 'datetime'].includes(pickerType.value),
    time: ['time', 'datetime'].includes(pickerType.value),
  };
});

const confirmLabel = computed(() => (props.confirmLabel ? props.confirmLabel : Labels.confirm));
const needConfirm = computed(() => {
  if (['datetime', 'daterange', 'datetimerange', 'monthrange'].includes(props.type)) {
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
</script>
<template>
  <div class="o-picker-pane">
    <div class="o-picker-wrap">
      <DatePicker v-if="showPicker.date" :value="dateValue" @update:value="onDateValueUpdate" @select="onDateSelect" />
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
