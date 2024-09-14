<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { vScrollbar } from '../scrollbar';
import { virtualListProps } from './types';

const props = defineProps(virtualListProps);

const listData = computed(() => {
  if (!props.list) {
    return [];
  }
  return props.list.map((item, index) => ({
    item,
    index,
  }));
});

const bufferCount = 2;
const containerRef = ref<HTMLElement>();
const wrapperRef = ref<HTMLElement>();
/**
 * 设置滚动条参数
 */
const scrollbarProps = computed(() => {
  if (props.scrollbar === true) {
    return {
      showType: 'always',
      size: 'medium',
    };
  }
  return props.scrollbar;
});

const startIndex = ref(props.defaultStartIndex);
const renderCount = ref(1);
const endIndex = computed(() => {
  if (!props.list) {
    return 0;
  }
  const edx = startIndex.value + renderCount.value;
  if (edx > props.list.length) {
    return props.list.length;
  }
  return edx;
});

const computeContentSize = () => {
  if (!props.list?.length || !props.itemSize) {
    return;
  }
  return props.list?.length * props.itemSize;
};
const computeRenderCount = () => {
  if (!wrapperRef.value || !props.itemSize) {
    return;
  }
  const containerSize = wrapperRef.value?.clientHeight;
  renderCount.value = bufferCount * 2 + Math.floor(containerSize / props.itemSize);
};

const contentStyle = ref({
  height: `${computeContentSize()}px` ?? 'auto',
});
const offset = ref(0);
const renderListStyle = computed(() => {
  return {
    transform: `translateY(${offset.value}px)`,
  };
});

const showList = computed(() => {
  return listData.value.slice(startIndex.value, endIndex.value);
});

const onScroll = () => {
  const scrollOffset = wrapperRef.value?.scrollTop ?? 0;

  if (!props.itemSize) {
    return;
  }
  offset.value = scrollOffset - (scrollOffset % props.itemSize);

  startIndex.value = scrollOffset / props.itemSize;
};

onMounted(() => {
  if (!wrapperRef.value || !props.itemSize) {
    return;
  }
  wrapperRef.value.scrollTop = props.defaultStartIndex * props?.itemSize;
  computeRenderCount();
});
</script>

<template>
  <div class="o-virtual-list" ref="containerRef">
    <div class="o-virtual-list-wrapper" ref="wrapperRef" v-scrollbar="scrollbarProps" @scroll="onScroll">
      <div class="o-virtual-body" :style="contentStyle">
        <div class="o-virtual-render-list" :style="renderListStyle">
          <template v-for="item in showList">
            <slot :item="item.item" :index="item.index"></slot>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
