<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { OScroller } from '../scroller';
import { isUndefined } from '../_utils/is';
interface CellT {
  value: number;
  label: string;
}

interface ValueT {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const props = withDefaults(
  defineProps<{
    value?: ValueT | null;
    hour?: boolean;
    minute?: boolean;
    second?: boolean;
    viewAlign?: 'top' | 'bottom' | 'center';
  }>(),
  {
    value: undefined,
    hour: true,
    minute: true,
    second: true,
    viewAlign: 'top',
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: Date | null): void;
  (e: 'confirm', value: Date | null, evt?: Event): void;
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

const handleValue = (v: ValueT | undefined | null): ValueT => {
  if (!v) {
    return {
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
    };
  }
  const { hours = 0, minutes = 0, seconds = 0 } = v;
  return {
    hours,
    minutes,
    seconds,
  };
};
const selectValue = ref<ValueT>(handleValue(props.value));
selectValue.value = {
  hours: 4,
  minutes: 3,
  seconds: 56,
};

const hasValue = computed(() => !(isUndefined(selectValue.value.hours) && isUndefined(selectValue.value.minutes) && isUndefined(selectValue.value.seconds)));
const alinClass = computed(() => {
  return hasValue.value ? `o-time-col-align-${props.viewAlign}` : '';
});

watch(
  () => props.value,
  (v: ValueT | undefined | null) => {
    if (v) {
      selectValue.value = handleValue(v);
    }
  }
);
const scrollCellToView = (scroller?: InstanceType<typeof OScroller>, smooth?: boolean) => {
  if (!scroller) {
    return;
  }
  const el = scroller?.$el.querySelector('.o-time-cell-selected');
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

const selectCell = (cell: CellT, type: keyof ValueT) => {
  selectValue.value[type] = cell.value;

  if (selectValue.value.hours === undefined) {
    selectValue.value.hours = 0;
  }

  if (selectValue.value.minutes === undefined) {
    selectValue.value.minutes = 0;
  }

  if (selectValue.value.seconds === undefined) {
    selectValue.value.seconds = 0;
  }

  scrollAllCellToTop();
};
onMounted(() => {
  scrollAllCellToTop(false);
});
</script>
<template>
  <div class="o-time-pane">
    <OScroller v-if="props.hour" ref="hScrollRef" class="o-time-col o-time-hour" size="small" :wrap-class="alinClass">
      <div
        v-for="item in hourList"
        :key="item.value"
        class="o-time-cell"
        :class="{
          'o-time-cell-selected': selectValue?.hours === item.value,
        }"
        @click="(e) => selectCell(item, 'hours')"
      >
        <div class="o-time-cell-val">
          <slot name="hour-cell" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
    <OScroller v-if="props.minute" ref="mScrollRef" class="o-time-col o-time-minute" size="small" :wrap-class="alinClass">
      <div
        v-for="item in msList"
        :key="item.value"
        class="o-time-cell"
        :class="{
          'o-time-cell-selected': selectValue?.minutes === item.value,
        }"
        @click="(e) => selectCell(item, 'minutes')"
      >
        <div class="o-time-cell-val">
          <slot name="minute-cell" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
    <OScroller v-if="props.second" ref="sScrollRef" class="o-time-col o-time-second" size="small" :wrap-class="alinClass">
      <div
        v-for="item in msList"
        :key="item.value"
        class="o-time-cell"
        :class="{
          'o-time-cell-selected': selectValue?.seconds === item.value,
        }"
        @click="(e) => selectCell(item, 'seconds')"
      >
        <div class="o-time-cell-val">
          <slot name="second-cell" v-bind="item">{{ item.label }}</slot>
        </div>
      </div>
    </OScroller>
  </div>
</template>
