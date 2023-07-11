<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IconCalendarPrevMonth, IconCalendarPrevYear, IconCalendarNextMonth, IconCalendarNextYear } from '../_utils/icons';
import { OButton } from '../button';
import { ShortcutParamT, ShortcutT } from './types';
import { OLink } from '../link';
import { OIcon } from '../icon';
import { Labels, getDate, getMonthLabel, getDateRangeStatus, getDaysofMonth, isSameDay, isSameMonth } from './date';
import type { DateT, DateRangeT } from './date';
import { chunk } from '../_utils/helper';
import { addYears, subYears, addMonths, subMonths, startOfMonth } from '../_utils/date';
import { isFunction } from '../_utils/is';

interface DayCellT {
  data: DateT;
  today: boolean;
  outView: boolean;
  rangeStatus: {
    in: boolean;
    start: boolean;
    end: boolean;
  } | null;
}

const props = withDefaults(
  defineProps<{
    range?: boolean;
    value?: Date | null;
    shortcuts?: Array<ShortcutParamT>;
    confirmBtn?: boolean | string;
  }>(),
  {
    range: false,
    value: undefined,
    shortcuts: undefined,
    confirmBtn: false,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: Date | null): void;
  (e: 'confirm', value: Date | null, evt?: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const confirmLabel = computed(() => (typeof props.confirmBtn === 'string' ? props.confirmBtn : Labels.confirm));
const needConfirm = computed(() => {
  if (props.confirmBtn) {
    return true;
  }
  return false;
});

const viewMonthDate = ref<DateT>(getDate(startOfMonth(props.value || new Date())));

const currentMonthLabel = computed(() => getMonthLabel(viewMonthDate.value));

const selectDate = ref<DateT | null>(props.value ? getDate(props.value) : null);

const shortcuts = computed(() => {
  if (props.shortcuts && props.shortcuts.length > 0) {
    return props.shortcuts.map((item) => {
      if (item === 'today') {
        return {
          label: Labels.today,
          value: () => new Date(),
        };
      }
      return item;
    });
  }
  return null;
});

const selectRange = ref<DateRangeT>({
  start: getDate(new Date()),
  end: getDate(new Date(viewMonthDate.value.date.getTime() + 7 * 24 * 60 * 60 * 1000)),
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
  emits('confirm', selectDate.value ? selectDate.value.date : null, e);
};
/**
 * 处理每月日期列表
 */
const dayList = ref(getDaysofMonth(viewMonthDate.value.date));
const dayListByWeek = computed<DayCellT[][]>(() => {
  const list: DayCellT[] = dayList.value.map((item) => {
    const isOutView = !isSameMonth(item, viewMonthDate.value);
    return {
      data: item,
      outView: isOutView,
      today: isSameDay(item, getDate(new Date())),
      rangeStatus: props.range && !isOutView ? getDateRangeStatus(item, selectRange.value) : null,
    };
  });
  return chunk(list, 7);
});

watch(
  () => props.value,
  (v: Date | null | undefined) => {
    if (v) {
      selectDate.value = getDate(v);

      viewMonthDate.value = getDate(startOfMonth(v));
      dayList.value = getDaysofMonth(viewMonthDate.value.date);
    }
  }
);

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
  viewMonthDate.value = getDate(headActionFn[dateType][actionType](viewMonthDate.value.date, 1));
  dayList.value = getDaysofMonth(viewMonthDate.value.date);
};

const onDayCellClick = (cell: DayCellT, e?: Event) => {
  if (!props.range) {
    selectDate.value = cell.data;
    emits('update:value', selectDate.value.date);
    if (cell.outView) {
      viewMonthDate.value = getDate(startOfMonth(cell.data.date));
      dayList.value = getDaysofMonth(cell.data.date);
    }
    onConfirm(false, e);
  } else {
    if (!selectRange.value.start || (selectRange.value.start && selectRange.value.end)) {
      selectRange.value.start = cell.data;
      // selectRange.value.end = null;
    }
  }
};

/*
 * 快捷按钮shortcut
 */
let lastDate: DateT | null = selectDate.value;
const onShortcutClick = (e: Event, shortcut: ShortcutT) => {
  const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
  selectDate.value = getDate(v);
  lastDate = selectDate.value;

  emits('update:value', selectDate.value.date);
  onConfirm(false, e);
};
// hover in时快速显示
const onShortcutMouseEnter = (e: Event, shortcut: ShortcutT) => {
  const v = isFunction(shortcut.value) ? shortcut.value() : shortcut.value;
  lastDate = selectDate.value;
  selectDate.value = getDate(v);
  emits('update:value', selectDate.value.date);
};
// hover out恢复之前值
const onShortcutMouseLeave = () => {
  if (selectDate.value !== lastDate) {
    selectDate.value = lastDate;
    emits('update:value', selectDate.value ? selectDate.value.date : null);
  }
};
</script>
<template>
  <div class="o-date-pane">
    <div class="o-dp-pane-head">
      <div class="o-dp-h-prev">
        <OIcon button :icon="IconCalendarPrevYear" @click="headBtnClick('year', 'sub')" />
        <OIcon button :icon="IconCalendarPrevMonth" @click="headBtnClick('month', 'sub')" />
      </div>
      <div class="o-dp-h-value">{{ currentMonthLabel }}</div>
      <div class="o-dp-h-next">
        <OIcon button :icon="IconCalendarNextMonth" @click="headBtnClick('month', 'add')" />
        <OIcon button :icon="IconCalendarNextYear" @click="headBtnClick('year', 'add')" />
      </div>
    </div>

    <div class="o-dp-pane-main">
      <div class="o-dp-week-head">
        <div v-for="item in Labels.weeks" :key="item" class="o-dp-cell">{{ item }}</div>
      </div>
      <div v-for="(week, idx) in dayListByWeek" :key="idx" class="o-dp-week-list">
        <div
          v-for="item in week"
          :key="item.data.days"
          class="o-dp-cell"
          :class="{
            'o-dp-cell-selected': !props.range && selectDate ? isSameDay(item.data, selectDate) : false,
            'o-dp-cell-range-start': item.rangeStatus?.start,
            'o-dp-cell-in-range': item.rangeStatus?.in,
            'o-dp-cell-range-end': item.rangeStatus?.end,
            'o-dp-cell-out-view': item.outView,
            'o-dp-cell-today': item.today,
          }"
          @click="(e) => onDayCellClick(item, e)"
        >
          <div class="o-dp-cell-val">
            <slot name="day-cell" v-bind="item">{{ item.data.days }}</slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$slots.footer" class="o-dp-pane-foot-extra">
      <slot name="footer"></slot>
    </div>
    <div
      class="o-dp-pane-foot"
      :class="{
        'has-confirm': needConfirm,
      }"
    >
      <div v-if="shortcuts" class="o-dp-pane-shortcut">
        <template v-for="item in shortcuts" :key="item">
          <div
            class="o-dp-pane-shortcut-item"
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
      <div v-if="needConfirm" class="o-dp-pane-shortcut">
        <OButton color="primary" size="small" @click="(e) => onConfirm(true, e)">{{ confirmLabel }}</OButton>
      </div>
    </div>
  </div>
</template>
