<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted, watchEffect } from 'vue';
import { OScroller } from '../../scroller';
import { isFunction } from '../../_utils/is';
import { getNumberList, isSameDay, scrollSelectOrNowCellInToView } from '../date';
import { PickerDate } from '../picker-date';
import { DisaplyTimeListT, disableTimeCellT } from '../types';

// TODO: 1. 时间选择禁用，时分秒相互影响禁用状态； 2. 禁用的时间在属性传入时怎么避免选中？

export interface TimeValueT {
  hour?: number;
  minute?: number;
  second?: number;
}

interface CellT {
  value: number;
  label: string;
  disabled: boolean;
}

const props = withDefaults(
  defineProps<{
    value: Date;
    viewValue: Date;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
    viewAlign?: 'top' | 'bottom' | 'center';
    disableCell: disableTimeCellT;
    displayHourList?: DisaplyTimeListT;
    displayMinuteList?: DisaplyTimeListT;
    displaySecondList?: DisaplyTimeListT;
  }>(),
  {
    value: undefined,
    viewAlign: 'top',
    showValue: true,
    displayHourList: undefined,
    displayMinuteList: undefined,
    displaySecondList: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: TimeValueT): void;
  (e: 'select', value: TimeValueT): void;
}>();

const rootEl = ref<HTMLElement>();
const columns = computed(() => {
  let cols = 3;
  if (props.hideHour) {
    cols -= 1;
  }
  if (props.hideMinute) {
    cols -= 1;
  }
  if (props.hideSecond) {
    cols -= 1;
  }
  return cols;
});
const inValue = new PickerDate(props.value);
const currentDate = new PickerDate();

const selectValue = ref<TimeValueT>({
  hour: inValue.hour,
  minute: inValue.minute,
  second: inValue.second,
});

// 是否传入参数为全部隐藏，如果是，则默认都展示
const hideAll = computed(() => props.hideHour && props.hideMinute && props.hideSecond);

const hScrollRef = ref<InstanceType<typeof OScroller>>();
const mScrollRef = ref<InstanceType<typeof OScroller>>();
const sScrollRef = ref<InstanceType<typeof OScroller>>();
const alinClass = computed(() => `o-pt-col-align-${props.viewAlign}`);

/**
 * 处理时间列表
 */
const hourList = ref<CellT[]>();
const minuteList = ref<CellT[]>();
const secondList = ref<CellT[]>();

const getTimeList = (date: Date) => {
  const pd = new PickerDate(date);
  if (isSameDay(pd, currentDate)) {
    return;
  }
  currentDate.date = pd.date;

  const hlist = isFunction(props.displayHourList)
    ? props.displayHourList(date)
    : getNumberList(0, 24, (v: number) => ({
        value: v,
        label: v.toString().padStart(2, '0'),
      }));

  const mlist = isFunction(props.displayHourList)
    ? props.displayHourList(date)
    : getNumberList(0, 60, (v: number) => ({
        value: v,
        label: v.toString().padStart(2, '0'),
      }));

  const slist = isFunction(props.displayHourList)
    ? props.displayHourList(date)
    : getNumberList(0, 60, (v: number) => ({
        value: v,
        label: v.toString().padStart(2, '0'),
        disabled: props.disableCell(v, 'second'),
      }));

  hourList.value = hlist.map((item) => ({
    ...item,
    disabled: props.disableCell(item.value, 'hour'),
  }));

  minuteList.value = mlist.map((item) => ({
    ...item,
    disabled: props.disableCell(item.value, 'minute'),
  }));
  secondList.value = slist.map((item) => ({
    ...item,
    disabled: props.disableCell(item.value, 'second'),
  }));
};

watchEffect(() => getTimeList(props.viewValue));

const scrollAllCellToTop = (smooth: boolean = true) => {
  nextTick(() => {
    scrollSelectOrNowCellInToView(hScrollRef.value, { smooth });
    scrollSelectOrNowCellInToView(mScrollRef.value, { smooth });
    scrollSelectOrNowCellInToView(sScrollRef.value, { smooth });
  });
};

watch(
  () => props.value,
  (v: Date) => {
    inValue.date = v;

    selectValue.value = {
      hour: inValue.hour,
      minute: inValue.minute,
      second: inValue.second,
    };
    scrollAllCellToTop();
  },
  { immediate: true }
);

const selectCell = (cell: CellT, type: keyof TimeValueT) => {
  if (cell.disabled) {
    return;
  }

  selectValue.value[type] = cell.value;

  emits('select', selectValue.value);
  emits('update:value', selectValue.value);

  scrollAllCellToTop();
};

const cellHeight = ref('34px');
onMounted(() => {
  scrollAllCellToTop(false);

  // 获取cell高度，撑高容器，滚动到顶部
  if (rootEl.value) {
    const cell = rootEl.value.querySelector('.o-picker-cell');
    if (cell) {
      cellHeight.value = `${cell.clientHeight}px`;
    }
  }
});
</script>
<template>
  <div
    ref="rootEl"
    class="o-picker-time"
    :style="{
      '--cell-height': cellHeight,
      '--columns': columns,
    }"
  >
    <OScroller v-if="!props.hideHour || hideAll" ref="hScrollRef" class="o-pt-col-wrap o-pt-hour" size="small" :wrap-class="[alinClass, 'o-pt-col']">
      <div
        v-for="item in hourList"
        :key="item.value"
        class="o-picker-cell o-pt-cell"
        :class="{
          'o-picker-cell-selected': selectValue.hour === item.value,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => selectCell(item, 'hour')"
      >
        <div class="o-picker-cell-val">
          <slot name="cell-hour" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
    <OScroller v-if="!props.hideMinute || hideAll" ref="mScrollRef" class="o-pt-col-wrap o-pt-minute" size="small" :wrap-class="[alinClass, 'o-pt-col']">
      <div
        v-for="item in minuteList"
        :key="item.value"
        class="o-picker-cell o-pt-cell"
        :class="{
          'o-picker-cell-selected': selectValue.minute === item.value,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => selectCell(item, 'minute')"
      >
        <div class="o-picker-cell-val">
          <slot name="cell-minute" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
    <OScroller v-if="!props.hideSecond || hideAll" ref="sScrollRef" class="o-pt-col-wrap o-pt-second" size="small" :wrap-class="[alinClass, 'o-pt-col']">
      <div
        v-for="item in secondList"
        :key="item.value"
        class="o-picker-cell o-pt-cell"
        :class="{
          'o-picker-cell-selected': selectValue.second === item.value,
          'o-picker-cell-disabled': item.disabled,
        }"
        @click="(e) => selectCell(item, 'second')"
      >
        <div class="o-picker-cell-val">
          <slot name="cell-second" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
  </div>
</template>
