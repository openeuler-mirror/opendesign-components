<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { ODivider } from '../../divider';

import { datePickerInjectKey } from '../provide.ts';
import { parseValue, YEAR_VIEW_STEP } from '../utils.ts';
import { useCalendar } from '../use-calendar.ts';
import { DatePickerMode } from '../types.ts';
import DatePanelHeader from './DatePanelHeader.vue';
import DatePanelCalendar from './DatePanelCalendar.vue';
import DatePanelMonth from './DatePanelMonth.vue';
import DatePanelYear from './DatePanelYear.vue';

const emits = defineEmits<{
  (e: 'change', start: number | undefined, end: number | undefined): void;
}>();

const datePickerCtx = inject(datePickerInjectKey)!;
const { mode: effectiveMode, disabledDate, disabledMonth, disabledYear, minDate, maxDate } = datePickerCtx;

const getOffsetRight = (base: Dayjs): Dayjs => {
  if (effectiveMode.value === 'year') return base.add(YEAR_VIEW_STEP, 'year');
  if (effectiveMode.value === 'month') return base.add(1, 'year');
  return base.add(1, 'month');
};
// dayStartOfWeek 仅在 date/datetime 模式 props 中存在；year/month 模式下为 undefined，提供默认值 1
const dayStartOfWeek = computed(() => datePickerCtx.dayStartOfWeek?.value ?? 1);

const parsedMinDate = computed(() => {
  const v = minDate?.value;
  return v ? parseValue(v) : null;
});
const parsedMaxDate = computed(() => {
  const v = maxDate?.value;
  return v ? parseValue(v) : null;
});

// Range selection state
// 范围选择状态机：
// 1. selecting='start': 等待第一次点击，anchorDate/rangeStart/rangeEnd 可能有已确认的值
// 2. selecting='end': 已点击第一个值（anchorDate），等待第二次点击，悬停时更新 hoverDate 实现预览
// 3. 第二次点击后 finishSelection() 排序写入 rangeStart/rangeEnd，重置为 selecting='start'
const anchorDate = ref<Dayjs | null>(null); // 第一次点击的锚点，顺序无意义
const rangeStart = ref<Dayjs | null>(null); // 已确认范围的 start（排序后）
const rangeEnd = ref<Dayjs | null>(null); // 已确认范围的 end（排序后）
const hoverDate = ref<Dayjs | null>(null);
const selecting = ref<'start' | 'end'>('start');

const currentView = defineModel<DatePickerMode>('currentView', { required: true });

// 追踪是哪一侧触发了 month/year 视图切换，选择时始终应用到触发侧
const activeSelectSide = ref<'left' | 'right'>('left');

// 导航视图：当前 currentView 是用于导航（选单点值），而非主范围选择
const isNavView = computed(() => {
  if (effectiveMode.value === 'year') return false;
  if (effectiveMode.value === 'month') return currentView.value === 'year';
  return currentView.value !== 'date';
});

// Panel navigation state - left panel
// 初始为 0，mount 后才赋值为当前日期，避免 SSR/CSR 时间戳不一致导致水合报错
const leftYear = ref(0);
const leftMonth = ref(0);

// Left calendar
const { rows: leftCalRows, weekDayHeaders } = useCalendar({
  displayYear: leftYear,
  displayMonth: leftMonth,
  selectedDate: computed(() => [anchorDate.value ?? rangeStart.value, rangeEnd.value]),
  dayStartOfWeek,
  disabledDate,
  minDate: parsedMinDate,
  maxDate: parsedMaxDate,
  rangeStart,
  rangeEnd,
  anchorDate,
  hoverDate,
});

// Right calendar (至少比left多一个偏移量，偏移量依视图模式：date=1月，month=1年，year=10年)
const rightYear = ref(0);
const rightMonth = ref(0);

// 导航视图下，统一读写触发侧的 year/month
const navYear = computed({
  get: () => (activeSelectSide.value === 'left' ? leftYear.value : rightYear.value),
  set: (v) => {
    if (activeSelectSide.value === 'left') leftYear.value = v;
    else rightYear.value = v;
  },
});
const navMonth = computed({
  get: () => (activeSelectSide.value === 'left' ? leftMonth.value : rightMonth.value),
  set: (v) => {
    if (activeSelectSide.value === 'left') leftMonth.value = v;
    else rightMonth.value = v;
  },
});

// onMounted 批量设置初始值时，临时跳过 watch 的约束逻辑，避免中间态触发错误对齐
let isInitializing = false;

// 左面板前进时，将右面板对齐到更晚的合法位置
const alignRightToLeft = (newLY: number, newLM: number) => {
  if (newLY > rightYear.value || (newLY === rightYear.value && newLM >= rightMonth.value)) {
    rightYear.value = newLY;
    rightMonth.value = newLM + 1;
    if (rightMonth.value > 11) {
      rightYear.value += 1;
      rightMonth.value = 0;
    }
  }
};

// 右面板后退时，将左面板对齐到更早的合法位置
const alignLeftToRight = (newRY: number, newRM: number) => {
  if (newRY < leftYear.value || (newRY === leftYear.value && newRM <= leftMonth.value)) {
    leftYear.value = newRY;
    leftMonth.value = newRM - 1;
    if (leftMonth.value < 0) {
      leftYear.value -= 1;
      leftMonth.value = 11;
    }
  }
};

// 左面板变化后将右面板对齐到合法位置（右必须比左晚至少一个最小单位）
watch(
  [leftYear, leftMonth],
  ([newLY, newLM]) => {
    if (isInitializing) return;
    if (effectiveMode.value === 'year') {
      rightYear.value = newLY + YEAR_VIEW_STEP;
    } else if (effectiveMode.value === 'month') {
      if (newLY >= rightYear.value) rightYear.value = newLY + 1;
    } else {
      alignRightToLeft(newLY, newLM);
    }
  },
  { flush: 'sync' },
);

// 右面板变化后将左面板对齐到合法位置
watch(
  [rightYear, rightMonth],
  ([newRY, newRM]) => {
    if (isInitializing) return;
    if (effectiveMode.value === 'year') {
      leftYear.value = newRY - YEAR_VIEW_STEP;
    } else if (effectiveMode.value === 'month') {
      if (newRY <= leftYear.value) leftYear.value = newRY - 1;
    } else {
      alignLeftToRight(newRY, newRM);
    }
  },
  { flush: 'sync' },
);

const { rows: rightCalRows } = useCalendar({
  displayYear: rightYear,
  displayMonth: rightMonth,
  selectedDate: computed(() => [anchorDate.value ?? rangeStart.value, rangeEnd.value]),
  dayStartOfWeek,
  disabledDate,
  minDate: parsedMinDate,
  maxDate: parsedMaxDate,
  rangeStart,
  rangeEnd,
  anchorDate,
  hoverDate,
});

/**
 * 获取当前范围值，返回 { start: timestamp, end: timestamp }
 */
const getValue = () => ({
  start: rangeStart.value?.valueOf(),
  end: rangeEnd.value?.valueOf(),
});

const toDayjs = (val: number | undefined): Dayjs | null => (val ? dayjs(val) : null);

// 设置 start+end 均存在时的面板导航位置
const setRangeBothEnds = (start: number, end: number) => {
  const startDate = dayjs(start);
  leftYear.value = startDate.year();
  leftMonth.value = startDate.month();
  const endDate = dayjs(end);
  const compareUnit = effectiveMode.value === 'month' ? 'year' : 'month';
  const sameUnit = startDate.isSame(endDate, compareUnit as any);
  if (sameUnit) {
    const offsetRight = getOffsetRight(startDate);
    rightYear.value = offsetRight.year();
    rightMonth.value = offsetRight.month();
  } else {
    rightYear.value = endDate.year();
    rightMonth.value = endDate.month();
  }
};

// 设置仅有一端存在时的面板导航位置
const setSingleEdge = (edgeVal: number | undefined) => {
  const edgeDate = dayjs(edgeVal);
  leftYear.value = edgeDate.year();
  leftMonth.value = edgeDate.month();
  rightYear.value = getOffsetRight(edgeDate).year();
  rightMonth.value = getOffsetRight(edgeDate).month();
};

// 没有范围值时切换回本月附近
const setEmptyRange = () => {
  leftYear.value = dayjs().year();
  leftMonth.value = dayjs().month();
  rightYear.value = getOffsetRight(dayjs()).year();
  rightMonth.value = getOffsetRight(dayjs()).month();
};

/**
 * 设置范围值，同时同步左面板导航到起始日期
 */
const setValue = (start: number | undefined, end: number | undefined) => {
  rangeStart.value = toDayjs(start);
  rangeEnd.value = toDayjs(end);

  // 年份模式：左面板锚定到起始年，右面板始终为左面板 +YEAR_VIEW_STEP（由 watch 自动同步）
  if (effectiveMode.value === 'year') {
    leftYear.value = rangeStart.value?.year() ?? dayjs().year();
    return;
  }

  if (start && end) {
    setRangeBothEnds(start, end);
    return;
  }
  if ([start, end].filter((v) => v).length === 1) {
    setSingleEdge(start || end);
    return;
  }
  setEmptyRange();
};

/**
 * 初始化面板状态，重置 selecting='start'，清空 hoverDate，根据模式设置 currentView
 */
const init = (start?: number, end?: number) => {
  selecting.value = 'start';
  anchorDate.value = null;
  hoverDate.value = null;
  currentView.value = effectiveMode.value === 'datetime' ? 'date' : (effectiveMode.value as 'date' | 'month' | 'year');
  setValue(start ?? undefined, end ?? undefined);
};

const modeUnitMap: Partial<Record<DatePickerMode, 'year' | 'month'>> = { year: 'year', month: 'month' };

// dayjs比较单位：year比较年，month比较月，day比较日
const finishSelection = (anchor: Dayjs, second: Dayjs) => {
  const compareUnit = modeUnitMap[effectiveMode.value] ?? 'day';
  if (anchor.isAfter(second, compareUnit)) {
    rangeStart.value = second;
    rangeEnd.value = anchor;
  } else {
    rangeStart.value = anchor;
    rangeEnd.value = second;
  }
  anchorDate.value = null;
  selecting.value = 'start';
  const { start: s, end: e } = getValue();
  emits('change', s, e);
};

const handleSelectDate = (date: Dayjs) => {
  if (selecting.value === 'start' || !anchorDate.value) {
    anchorDate.value = date;
    rangeStart.value = null;
    rangeEnd.value = null;
    hoverDate.value = null;
    selecting.value = 'end';
  } else {
    finishSelection(anchorDate.value, date);
    hoverDate.value = null;
  }
};

const handleHover = (date: Dayjs) => {
  if (selecting.value === 'end') hoverDate.value = date;
};

const handleLeave = () => {
  if (selecting.value === 'end') hoverDate.value = null;
};

const handleSelectMonth = (month: number, isRight = false) => {
  const year = isRight ? rightYear.value : leftYear.value;
  if (effectiveMode.value === 'month') {
    // 月份范围选择：year 取决于点击的是哪一侧面板（isRight 来自模板），保证日期正确
    const date = dayjs().year(year).month(month).date(1).startOf('day');
    if (selecting.value === 'start' || !anchorDate.value) {
      anchorDate.value = date;
      rangeStart.value = null;
      rangeEnd.value = null;
      selecting.value = 'end';
    } else {
      finishSelection(anchorDate.value, date);
    }
  } else {
    // 导航：始终应用到触发月份视图的那一侧，watches 负责约束对齐
    if (activeSelectSide.value === 'right') {
      rightMonth.value = month;
    } else {
      leftMonth.value = month;
    }
    currentView.value = 'date';
  }
};
const handleSelectYear = (year: number) => {
  if (effectiveMode.value === 'year') {
    const date = dayjs().year(year).month(0).date(1).startOf('day');
    if (selecting.value === 'start' || !anchorDate.value) {
      anchorDate.value = date;
      rangeStart.value = null;
      rangeEnd.value = null;
      selecting.value = 'end';
    } else {
      finishSelection(anchorDate.value, date);
    }
  } else if (effectiveMode.value === 'month') {
    // 导航：始终应用到触发年份视图的那一侧，watches 负责约束对齐
    if (activeSelectSide.value === 'right') {
      rightYear.value = year;
    } else {
      leftYear.value = year;
    }
    currentView.value = 'month';
  } else {
    // 导航：始终应用到触发年份视图的那一侧，watches 负责约束对齐
    if (activeSelectSide.value === 'right') {
      rightYear.value = year;
    } else {
      leftYear.value = year;
    }
    currentView.value = 'date';
  }
};

onMounted(() => {
  isInitializing = true;
  leftYear.value = dayjs().year();
  leftMonth.value = dayjs().month();
  rightYear.value = getOffsetRight(dayjs()).year();
  rightMonth.value = getOffsetRight(dayjs()).month();
  isInitializing = false;
});

defineExpose({
  getValue,
  setValue,
  init,
});
</script>

<template>
  <!-- Mobile & Desktop: dual calendar -->
  <div class="o-date-range-panel-body">
    <!-- 导航视图（二级单点选择）：只渲染触发侧的单个面板，无范围高亮 -->
    <template v-if="isNavView">
      <div class="o-date-range-panel-side">
        <div class="o-date-panel-content">
          <DatePanelHeader v-model:year="navYear" v-model:month="navMonth" v-model:current-view="currentView" @click-year="() => {}" @click-month="() => {}" />
          <ODivider class="o-date-panel-divider" />
          <DatePanelMonth
            v-if="currentView === 'month'"
            :year="navYear"
            :selected-date="null"
            :disabled-month="disabledMonth"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="null"
            :range-end="null"
            :hover-month="null"
            @select="(m) => handleSelectMonth(m, activeSelectSide === 'right')"
            @hover="() => {}"
          />
          <DatePanelYear
            v-else
            :year="navYear"
            :selected-date="null"
            :disabled-year="disabledYear"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="null"
            :range-end="null"
            :hover-year="null"
            :hide-out-of-decade="false"
            @select="handleSelectYear"
            @hover="() => {}"
          />
        </div>
      </div>
    </template>

    <!-- 主范围选择视图：双面板 + 范围高亮 -->
    <template v-else>
      <!-- Left panel -->
      <div class="o-date-range-panel-side">
        <div class="o-date-panel-content">
          <DatePanelHeader
            v-model:year="leftYear"
            v-model:month="leftMonth"
            v-model:current-view="currentView"
            :hide-right-nav="effectiveMode === 'year'"
            @click-year="activeSelectSide = 'left'"
            @click-month="activeSelectSide = 'left'"
          />
          <ODivider class="o-date-panel-divider" />
          <DatePanelCalendar
            v-if="currentView === 'date'"
            :rows="leftCalRows"
            :week-day-headers="weekDayHeaders"
            @select="handleSelectDate"
            @hover="handleHover"
            @leave="handleLeave"
          />
          <DatePanelMonth
            v-else-if="currentView === 'month'"
            :year="leftYear"
            :selected-date="null"
            :disabled-month="disabledMonth"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :anchor-month="selecting === 'end' ? anchorDate : null"
            :hover-month="selecting === 'end' ? hoverDate : null"
            @select="(m) => handleSelectMonth(m, false)"
            @hover="handleHover"
          />
          <DatePanelYear
            v-else
            :year="leftYear"
            :selected-date="null"
            :disabled-year="disabledYear"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :anchor-year="selecting === 'end' ? anchorDate : null"
            :hover-year="selecting === 'end' ? hoverDate : null"
            :hide-out-of-decade="effectiveMode === 'year'"
            @select="handleSelectYear"
            @hover="handleHover"
          />
        </div>
      </div>

      <!-- Right panel -->
      <div class="o-date-range-panel-side">
        <div class="o-date-panel-content">
          <DatePanelHeader
            v-model:year="rightYear"
            v-model:month="rightMonth"
            v-model:current-view="currentView"
            :hide-left-nav="effectiveMode === 'year'"
            @click-year="activeSelectSide = 'right'"
            @click-month="activeSelectSide = 'right'"
          />
          <ODivider class="o-date-panel-divider" />
          <DatePanelCalendar
            v-if="currentView === 'date'"
            :rows="rightCalRows"
            :week-day-headers="weekDayHeaders"
            @select="handleSelectDate"
            @hover="handleHover"
            @leave="handleLeave"
          />
          <DatePanelMonth
            v-else-if="currentView === 'month'"
            :year="rightYear"
            :selected-date="null"
            :disabled-month="disabledMonth"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :anchor-month="selecting === 'end' ? anchorDate : null"
            :hover-month="selecting === 'end' ? hoverDate : null"
            @select="(m) => handleSelectMonth(m, true)"
            @hover="handleHover"
          />
          <DatePanelYear
            v-else
            :year="rightYear"
            :selected-date="null"
            :disabled-year="disabledYear"
            :min-date="parsedMinDate"
            :max-date="parsedMaxDate"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :anchor-year="selecting === 'end' ? anchorDate : null"
            :hover-year="selecting === 'end' ? hoverDate : null"
            :hide-out-of-decade="effectiveMode === 'year'"
            @select="handleSelectYear"
            @hover="handleHover"
          />
        </div>
      </div>
    </template>
  </div>
</template>
