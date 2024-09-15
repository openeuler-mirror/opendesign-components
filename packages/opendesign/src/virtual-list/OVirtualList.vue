<script lang="ts" setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { vScrollbar } from '../scrollbar';
import { virtualListProps } from './types';
import { isArray } from '../_utils/is';
import { OResizeObserver } from '../resize-observer';
import { vOnResize } from '../directives';

const props = defineProps(virtualListProps);
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
/**
 * 对列表数据预处理
 */
const listData = computed(() => {
  if (!isArray(props.list)) {
    return [];
  }
  return props.list.map((item, index) => ({
    item,
    index,
  }));
});

const bufferCount = props.buffer ?? 1;
// 渲染起始序号
const startIndex = ref(props.defaultStartIndex < bufferCount ? 0 : props.defaultStartIndex - bufferCount);
// 可视区域内的结束序号
const renderCount = ref(1);
// 渲染结束序号
const endIndex = computed(() => {
  return Math.min(startIndex.value + renderCount.value + bufferCount * 2, listData.value.length - 1);
});

/**
 * 渲染的数据
 */
const renderList = computed(() => {
  return listData.value.slice(startIndex.value, endIndex.value + 1);
});

const wrapperRef = ref<HTMLElement>();
// 动态高度时，先给定默认高度
const placeholderSize = 80;

// 列表虚拟总高度，先给定初始值
const contentSize = ref(placeholderSize * listData.value.length);
// 容器可视区尺寸
const containerSize = ref({
  height: 0,
  width: 0,
});
const onContainerResize = () => {
  containerSize.value.height = wrapperRef.value?.clientHeight ?? 0;
  containerSize.value.width = wrapperRef.value?.clientWidth ?? 0;

  updateVisibleCount(wrapperRef.value?.scrollTop ?? 0);
};

const contentStyle = computed(() => ({
  '--content-height': `${contentSize.value}px`,
}));
// 虚拟列表偏移量，用于虚拟滚动
const offset = ref(0);
const renderListStyle = computed(() => {
  return {
    '--offsetY': `${offset.value}px`,
  };
});

interface ItemMeta {
  index: number;
  top: number;
  bottom: number;
  size: number;
  measured: boolean;
}
let listMetaData: Array<ItemMeta> = [];
watchEffect(() => {
  listMetaData = listData.value.map((_, index) => {
    const meta = {
      index,
      size: placeholderSize,
      top: placeholderSize * index,
      bottom: placeholderSize * (index + 1),
      measured: false,
    };
    return meta;
  });
});

/**
 * 更新item的相关偏移、高度，总高度
 * 某一项高度确定后，需要更新后面所有项的偏移值
 */
const updateMeta = (start: number = 0) => {
  for (let i = start + 1; i < listMetaData.length; i++) {
    const lastMeta = listMetaData[i - 1];
    const meta = listMetaData[i];
    meta.top = lastMeta.bottom;
    meta.bottom = meta.top + meta.size;
  }
  const last = listMetaData[listMetaData.length - 1];
  last.bottom = last.top + last.size;
  contentSize.value = last.bottom;
};
/**
 * 根据当前滚动位置，计算可视区域的展示项数量
 */
const updateVisibleCount = (scrollOffset: number) => {
  const { height: containerHeight } = containerSize.value;
  if (!wrapperRef.value || !containerHeight) {
    return;
  }
  const eMeta = listMetaData[endIndex.value - bufferCount];
  if (eMeta.bottom > scrollOffset + containerHeight) {
    return;
  }

  for (let i = endIndex.value + 1; i < listMetaData.length; i++) {
    const meta = listMetaData[i - bufferCount];
    if (meta.top > scrollOffset + containerHeight) {
      renderCount.value = i - startIndex.value - bufferCount;
      break;
    }
  }
};
/**
 * 滚动态时，根据滚动位置，计算虚拟列表渲染的起始、结束位置
 * 使用二分查找
 */
const getStartIndex = (scrollOffset: number) => {
  let start = 0;
  let end = listMetaData.length - 1;

  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const { top, bottom } = listMetaData[mid];

    if (top <= scrollOffset && bottom > scrollOffset) {
      return mid;
    } else if (bottom === scrollOffset) {
      return mid + 1;
    } else if (bottom < scrollOffset) {
      start = mid;
    } else if (top > scrollOffset) {
      end = mid;
    }
  }
  return start;
};
/**
 * 滚动态时，找到渲染的起止index
 */
const onScroll = () => {
  const scrollOffset = wrapperRef.value?.scrollTop ?? 0;
  if (props.itemSize) {
    offset.value = scrollOffset - (scrollOffset % props.itemSize);

    startIndex.value = scrollOffset / props.itemSize;
    return;
  }

  startIndex.value = getStartIndex(scrollOffset);
  offset.value = listMetaData[startIndex.value].top;

  updateVisibleCount(scrollOffset);
};
/**
 * 子项尺寸变化时，重新刷新meta数据
 */
const onItemResize = (en: ResizeObserverEntry, index: number) => {
  const el = en.target;
  const meta = listMetaData[index];
  // 如果之前计算过，且尺寸无变化，则不需要刷新meta数据
  if (meta.measured && meta.size === el.clientHeight) {
    return;
  }

  meta.size = el.clientHeight;
  meta.measured = true;
  meta.bottom = meta.top + meta.size;

  updateMeta(index);
};

onMounted(() => {
  if (!wrapperRef.value) {
    return;
  }
  onContainerResize();
  wrapperRef.value.scrollTop = listMetaData[props.defaultStartIndex].top;
  updateVisibleCount(wrapperRef.value.scrollTop);
});
</script>

<template>
  <div class="o-virtual-list">
    <div class="o-virtual-list-wrapper" v-on-resize="onContainerResize" ref="wrapperRef" v-scrollbar="scrollbarProps" @scroll="onScroll">
      <div class="o-virtual-body" :style="contentStyle">
        <div class="o-virtual-render-list" :style="renderListStyle">
          <template v-for="item in renderList" :key="item.index">
            <template v-if="props.itemSize">
              <slot :item="item.item" :index="item.index"></slot>
            </template>
            <OResizeObserver v-else @resize="(en) => onItemResize(en, item.index)">
              <slot :item="item.item" :index="item.index"></slot>
            </OResizeObserver>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
