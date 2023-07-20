<script setup lang="ts">
import { reactive, ref, watch, nextTick, computed, onMounted } from 'vue';
import { OScroller } from '../scroller';
import { isUndefined } from '../_utils/is';
import { scrollSelectOrNowCellInToView } from './date';
import { PickerDate } from './picker-date';

export interface TimeValueT {
  hour?: number;
  minute?: number;
  second?: number;
}

interface CellT {
  value: number;
  label: string;
}

const props = withDefaults(
  defineProps<{
    value: Date;
    hideHour?: boolean;
    hideMinute?: boolean;
    hideSecond?: boolean;
    viewAlign?: 'top' | 'bottom' | 'center';
    showValue?: boolean;
  }>(),
  {
    value: undefined,
    viewAlign: 'top',
    showValue: true,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: TimeValueT): void;
  (e: 'select', value: TimeValueT): void;
}>();

const initValue = new PickerDate(props.value);

// 是否传入参数为全部隐藏，如果是，则默认都展示
const hideAll = computed(() => props.hideHour && props.hideMinute && props.hideSecond);

const hScrollRef = ref<InstanceType<typeof OScroller>>();
const mScrollRef = ref<InstanceType<typeof OScroller>>();
const sScrollRef = ref<InstanceType<typeof OScroller>>();

/**
 * 处理时间列表
 */
const hourList: CellT[] = [];
const msList: CellT[] = [];
for (let i = 0; i < 24; i++) {
  hourList.push({
    value: i,
    label: i.toString().padStart(2, '0'),
  });
}
for (let i = 0; i < 60; i++) {
  msList.push({
    value: i,
    label: i.toString().padStart(2, '0'),
  });
}

const selectValue = reactive<TimeValueT>({
  hour: initValue.hour,
  minute: initValue.minute,
  second: initValue.second,
});

const validValue = computed(() => !(isUndefined(selectValue.hour) || isUndefined(selectValue.minute) || isUndefined(selectValue.second)));

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
    initValue.date = v;

    selectValue.hour = initValue.hour;
    selectValue.minute = initValue.minute;
    selectValue.second = initValue.second;
    scrollAllCellToTop();
  },
  { immediate: true }
);

const currentValueLabel = computed(() => {
  const t: string[] = [];
  if (!props.hideHour || hideAll.value) {
    t.push((selectValue.hour || 0).toString().padStart(2, '0'));
  }
  if (!props.hideMinute || hideAll.value) {
    t.push((selectValue.minute || 0).toString().padStart(2, '0'));
  }
  if (!props.hideSecond || hideAll.value) {
    t.push((selectValue.second || 0).toString().padStart(2, '0'));
  }
  return t.join(':');
});

const alinClass = computed(() => {
  return validValue.value ? `o-pt-col-align-${props.viewAlign}` : '';
});

const selectCell = (cell: CellT, type: keyof TimeValueT) => {
  selectValue[type] = cell.value;

  emits('select', selectValue);
  emits('update:value', selectValue);

  scrollAllCellToTop();
};

onMounted(() => {
  scrollAllCellToTop(false);
});
</script>
<template>
  <div class="o-picker-time">
    <div v-if="showValue" class="o-picker-head">
      <div class="o-picker-head-value">
        <slot name="time-head-label" v-bind="selectValue">{{ currentValueLabel }}</slot>
      </div>
    </div>
    <div class="o-picker-main o-pt-main">
      <OScroller v-if="!props.hideHour || hideAll" ref="hScrollRef" class="o-pt-col-wrap o-pt-hour" size="small" :wrap-class="[alinClass, 'o-pt-col']">
        <div
          v-for="item in hourList"
          :key="item.value"
          class="o-picker-cell o-pt-cell"
          :class="{
            'o-picker-cell-selected': selectValue.hour === item.value,
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
          v-for="item in msList"
          :key="item.value"
          class="o-picker-cell o-pt-cell"
          :class="{
            'o-picker-cell-selected': selectValue.minute === item.value,
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
          v-for="item in msList"
          :key="item.value"
          class="o-picker-cell o-pt-cell"
          :class="{
            'o-picker-cell-selected': selectValue.second === item.value,
          }"
          @click="(e) => selectCell(item, 'second')"
        >
          <div class="o-picker-cell-val">
            <slot name="cell-second" v-bind="item">{{ item.label }}</slot>
          </div>
        </div>
      </OScroller>
    </div>
  </div>
</template>
