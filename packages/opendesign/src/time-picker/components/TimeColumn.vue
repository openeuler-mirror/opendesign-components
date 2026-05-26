<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useCssVar } from '@vueuse/core';

import { OScroller } from '../../scrollbar';
import { useScreen } from '../../hooks';
import { DatePickerColumnOption } from '../types.ts';

const props = defineProps<{
  options: DatePickerColumnOption[];
  disabledOptions?: number[];
  noResponsive?: boolean;
}>();
const emits = defineEmits<{
  (e: 'change', newVal: number | null): void;
}>();

const modelVale = defineModel<number | null>('modelValue', { required: true });

const { isPhonePad } = useScreen();
const isResponding = computed(() => !props.noResponsive && isPhonePad.value);

const columnRef = ref<InstanceType<typeof OScroller>>();
const listRef = ref<HTMLDivElement>();
const itemsRef = ref<HTMLDivElement[]>();

const itemInnerHeightVar = useCssVar('--time-panel-item-height', listRef, { initialValue: '48px' });
const itemInnerHeight = computed(() => Number.parseInt(itemInnerHeightVar.value));
const itemGapVar = useCssVar('--time-panel-item-gap', listRef, { initialValue: '4px' });
const itemGap = computed(() => Number.parseInt(itemGapVar.value));
const itemHeight = computed(() => itemInnerHeight.value + itemGap.value / 2);
const showItemCountVar = useCssVar('--time-panel-col-show-item-count', listRef, { initialValue: '5' });
const showItemCount = computed(() => Number.parseInt(showItemCountVar.value));
const activeItemPadding = computed(() => (itemHeight.value * (showItemCount.value - 1)) / 2);

let changedByOut = false;
const scrollToItem = async (smooth = false) => {
  await nextTick();
  if (!columnRef.value) return;
  const activeItem = columnRef.value.getContainerEl()?.querySelector<HTMLDivElement>('.active');
  if (!activeItem) return;
  changedByOut = !smooth;
  if (isResponding.value) {
    columnRef.value.scrollTo({ top: activeItem.offsetTop - activeItemPadding.value, behavior: smooth ? 'smooth' : 'instant' });
  } else {
    columnRef.value.scrollTo({ top: activeItem.offsetTop, behavior: smooth ? 'smooth' : 'instant' });
  }
};

const WHEEL_STEP = 3;
// 自定义滚轮事件 - 设置步长
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const direction = e.deltaY > 0 ? itemHeight.value : -itemHeight.value;
  columnRef.value?.scrollBy({ top: direction * WHEEL_STEP, behavior: 'smooth' });
};

const isItemDisabled = (item: number) => props.disabledOptions?.includes(item) ?? false;

const findNearestEnabled = (value: number): number | null => {
  const enabled = props.options.filter((o) => !isItemDisabled(o.value));
  if (enabled.length === 0) return null;
  return enabled.reduce((closest, cur) => (Math.abs(cur.value - value) < Math.abs(closest - value) ? cur.value : closest), enabled[0].value);
};

let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
let isAutoScrolling = false;

const handleScroll = () => {
  if (isAutoScrolling) {
    isAutoScrolling = false;
    return;
  }
  let landedValue: number | null = null;
  itemsRef.value?.forEach((el) => {
    const { top } = el.getBoundingClientRect();
    const containerTop = columnRef.value?.getContainerEl()?.getBoundingClientRect().top ?? 0;
    const threshold = 5; // 宽容5px
    const inRespondingMiddle = isResponding.value && Math.abs(activeItemPadding.value - (top - containerTop)) < threshold;
    const inUnrespondingTop = !isResponding.value && top - containerTop < threshold;
    if (inRespondingMiddle || inUnrespondingTop) {
      landedValue = Number.parseInt(el.dataset.itemValue as string);
    }
  });

  if (landedValue !== null && !isItemDisabled(landedValue)) {
    modelVale.value = landedValue;
  }

  const _changedByOut = changedByOut;
  changedByOut = false;
  if (!_changedByOut) {
    emits('change', modelVale.value);
  }

  // 滚动停止后，如果停在禁用值上，自动滚到最近可用值
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    if (landedValue !== null && isItemDisabled(landedValue)) {
      const nearest = findNearestEnabled(landedValue);
      if (nearest !== null) {
        modelVale.value = nearest;
        isAutoScrolling = true;
        scrollToItem(true);
        emits('change', nearest);
      }
    }
  }, 150);
};

const handleItemClick = (item: DatePickerColumnOption) => {
  if (isItemDisabled(item.value)) return;
  modelVale.value = item.value;
  scrollToItem(true);
};

onMounted(() => {
  scrollToItem(false);
});

// 监听响应式模式切换，切换后重新定位滚动位置
watch(isResponding, () => {
  scrollToItem(false);
});

onUnmounted(() => {
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
});

defineExpose({
  scrollToItem,
});
</script>

<template>
  <OScroller
    ref="columnRef"
    size="small"
    :show-type="isResponding ? 'never' : 'auto'"
    disabled-x
    class="o-time-panel-column-scroller"
    wrap-class="o-time-panel-column"
    @scroll="handleScroll"
    @wheel="handleWheel"
  >
    <div class="o-time-panel-indicator" />
    <div ref="listRef" class="o-time-panel-column-list">
      <div v-if="isResponding" class="o-time-panel-column-spacer" />
      <div
        v-for="item in props.options"
        :key="item.value"
        ref="itemsRef"
        class="o-time-panel-item"
        :class="{ active: modelVale === item.value, disabled: isItemDisabled(item.value) }"
        :data-item-value="item.value"
        @click="handleItemClick(item)"
      >
        <div class="o-time-panel-item__inner">{{ item.label }}</div>
      </div>
      <div class="o-time-panel-column-spacer" />
    </div>
  </OScroller>
</template>
