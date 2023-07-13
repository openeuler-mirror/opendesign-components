<script setup lang="ts">
import { reactive, ref, watch, nextTick, computed, onMounted } from 'vue';
import { OScroller } from '../scroller';
import { isUndefined } from '../_utils/is';

export interface TimeValueT {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface CellT {
  value: number;
  label: string;
}

const props = withDefaults(
  defineProps<{
    value: TimeValueT;
    hour?: boolean;
    minute?: boolean;
    second?: boolean;
    viewAlign?: 'top' | 'bottom' | 'center';
    showValue?: boolean;
  }>(),
  {
    value: undefined,
    hour: true,
    minute: true,
    second: true,
    viewAlign: 'top',
    showValue: true,
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: TimeValueT): void;
  (e: 'select', value: TimeValueT): void;
}>();

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

const selectValue = reactive<TimeValueT>(props.value);
const selectValueLabel = reactive<Record<keyof TimeValueT, string>>({
  hours: '00',
  minutes: '00',
  seconds: '00',
});

const validValue = computed(() => !(isUndefined(selectValue.hours) || isUndefined(selectValue.minutes) || isUndefined(selectValue.seconds)));

const scrollCellToView = (scroller?: InstanceType<typeof OScroller>, smooth?: boolean) => {
  if (!scroller) {
    return;
  }
  const el = scroller?.$el.querySelector('.o-tp-cell-selected');
  if (!el || !scroller.containerRef) {
    return;
  }
  const { offsetTop, clientHeight } = el;
  const { clientHeight: outHeight } = scroller.containerRef;

  let top = offsetTop;
  if (props.viewAlign === 'center') {
    top = offsetTop - outHeight / 2 + clientHeight / 2;
  } else if (props.viewAlign === 'bottom') {
    top = offsetTop - outHeight + clientHeight;
  }
  scroller.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto',
  });
};
const scrollAllCellToTop = (smooth: boolean = true) => {
  nextTick(() => {
    scrollCellToView(hScrollRef.value, smooth);
    scrollCellToView(mScrollRef.value, smooth);
    scrollCellToView(sScrollRef.value, smooth);
  });
};

watch(
  () => props.value,
  (v: TimeValueT | undefined | null) => {
    selectValue.hours = v?.hours;
    selectValue.minutes = v?.minutes;
    selectValue.seconds = v?.seconds;
    scrollAllCellToTop();
  },
  { immediate: true }
);

const currentValueLabel = computed(() => {
  return `${selectValueLabel.hours} : ${selectValueLabel.minutes} : ${selectValueLabel.seconds} `;
});

const alinClass = computed(() => {
  return validValue.value ? `o-tp-col-align-${props.viewAlign}` : '';
});

const selectCell = (cell: CellT, type: keyof TimeValueT) => {
  selectValue[type] = cell.value;

  selectValueLabel[type] = cell.label;

  emits('select', selectValue);
  emits('update:value', selectValue);

  scrollAllCellToTop();
};

onMounted(() => {
  scrollAllCellToTop(false);
});
</script>
<template>
  <div class="o-time-picker">
    <div v-if="showValue" class="o-picker-head">
      <div class="o-dp-value">
        <slot name="time-value-label" v-bind="selectValue">{{ currentValueLabel }}</slot>
      </div>
    </div>
    <div class="o-picker-main o-picker-main-time">
      <OScroller v-if="props.hour" ref="hScrollRef" class="o-tp-col o-tp-hour" size="small" :wrap-class="alinClass">
        <div
          v-for="item in hourList"
          :key="item.value"
          class="o-tp-cell"
          :class="{
            'o-tp-cell-selected': selectValue.hours === item.value,
          }"
          @click="(e) => selectCell(item, 'hours')"
        >
          <div class="o-tp-cell-val">
            <slot name="cell-hour" v-bind="item">{{ item.label }}</slot>
          </div>
        </div>
      </OScroller>
      <OScroller v-if="props.minute" ref="mScrollRef" class="o-tp-col o-tp-minute" size="small" :wrap-class="alinClass">
        <div
          v-for="item in msList"
          :key="item.value"
          class="o-tp-cell"
          :class="{
            'o-tp-cell-selected': selectValue.minutes === item.value,
          }"
          @click="(e) => selectCell(item, 'minutes')"
        >
          <div class="o-tp-cell-val">
            <slot name="cell-minute" v-bind="item">{{ item.label }}</slot>
          </div>
        </div>
      </OScroller>
      <OScroller v-if="props.second" ref="sScrollRef" class="o-tp-col o-tp-second" size="small" :wrap-class="alinClass">
        <div
          v-for="item in msList"
          :key="item.value"
          class="o-tp-cell"
          :class="{
            'o-tp-cell-selected': selectValue.seconds === item.value,
          }"
          @click="(e) => selectCell(item, 'seconds')"
        >
          <div class="o-tp-cell-val">
            <slot name="cell-second" v-bind="item">{{ item.label }}</slot>
          </div>
        </div>
      </OScroller>
    </div>
  </div>
</template>
