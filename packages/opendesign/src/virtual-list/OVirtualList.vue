<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { vScrollbar } from '../scrollbar';
import { virtualListProps } from './types';
import { isUndefined } from '../_utils/is';
import { vOnResize } from '../directives/on-resize';
import { debounceRAF } from '../_utils/helper';

const props = defineProps(virtualListProps);
const emits = defineEmits<{
  (e: 'renderChange', start: number, end: number): void;
}>();
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
const listData = ref<
  Array<{
    id: number | string;
    index: number;
    data: any;
  }>
>([]);
watch(
  () => props.list,
  (value) => {
    listData.value = value.map((item, index) => ({
      id: item.id,
      data: item,
      index,
    }));
  },
  {
    immediate: true,
  }
);

// 可视区域内的起始序号
const visibleStartIndex = ref(props.defaultStartIndex ?? 0);
let visibleStartId: string | number | undefined = undefined;
// 可视区域内的结束序号
const renderCount = ref(1);
// 渲染起始序号
const startIndex = computed(() => {
  return Math.max(visibleStartIndex.value - props.buffer, 0);
});
// 渲染结束序号
const endIndex = computed(() => {
  return Math.min(startIndex.value + renderCount.value + props.buffer * 2, listData.value.length - 1);
});
watch([visibleStartIndex, renderCount], () => {
  if (!initialScroll) {
    return;
  }
  emits('renderChange', startIndex.value, endIndex.value);
});
/**
 * 渲染的数据
 */
const renderList = computed(() => {
  return listData.value.slice(startIndex.value, endIndex.value + 1);
});

watch(listData, (value) => {
  if (!isUndefined(visibleStartId) && wrapperRef.value) {
    // 计算滚动偏移量
    const top = wrapperRef.value.scrollTop - listMetaData[visibleStartIndex.value].top;
    // 找到更新后的可视数据index
    const index = value.findIndex((item) => item.id === visibleStartId);
    if (index >= 0) {
      visibleStartIndex.value = index;
      // 重新定位滚动条位置（需加上偏移量）
      wrapperRef.value.scrollTop = listMetaData[index].top + top;
    }
  }
});

const wrapperRef = ref<HTMLElement>();

// 列表虚拟总高度，先给定初始值
const contentSize = ref((props.itemSize ? props.itemSize : props.defaultItemSize) * listData.value.length);
// 容器可视区尺寸
const containerSize = ref({
  height: 0,
  width: 0,
});
const onContainerResize = () => {
  if (!wrapperRef.value) {
    return;
  }
  containerSize.value.height = wrapperRef.value.offsetHeight;
  containerSize.value.width = wrapperRef.value.offsetWidth;

  // 第一次初始化滚动位置后，再根据容器尺寸变化刷新渲染项，未初始化，则不刷新
  if (!initialScroll) {
    return;
  }
  const scrollTop = wrapperRef.value.scrollTop;

  // 刷新起始渲染项
  for (let i = visibleStartIndex.value; i >= 0; i--) {
    const meta = listMetaData[i];

    if (meta.top <= scrollTop) {
      visibleStartIndex.value = i;
      break;
    }
  }

  // 刷新结束渲染项
  for (let i = endIndex.value; i < listMetaData.length; i++) {
    const meta = listMetaData[i];

    if (meta.bottom >= scrollTop + containerSize.value.height) {
      renderCount.value = i - visibleStartIndex.value;
      break;
    }
  }
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

/**
 * 初始化滚动位置
 */
let initialScroll = false;

/**
 * 将指定项滚动到视口内，不定高场景下，可能存在滚动不准确
 * @param index 指定项
 * @param align 'start' | 'end' | 'center' | 'nearest' | number, 默认值'start'，不定高场景下，'end' | 'center'因高度不固定，可能存在滚动不准确
 * @param behavior ScrollBehavior, 默认值 'instant'，不定高场景下，仅支持'instant'
 */
const scrollToView = (index: number, align: 'start' | 'end' | 'center' | 'nearest' | number = 'start', behavior: ScrollBehavior = 'instant') => {
  if (!wrapperRef.value || index < 0 || index >= listMetaData.length) {
    return;
  }
  const item = listMetaData[index];
  const itemTop = item.top;

  const cSize = containerSize.value.height;

  // 计算最终对齐方式
  let _align = align;
  if (_align === 'nearest') {
    const currScrollTop = wrapperRef.value.scrollTop;
    if (currScrollTop > itemTop) {
      _align = 'start';
    } else if (currScrollTop + cSize < itemTop) {
      _align = 'end';
    } else {
      // 如果在视口内，则不滚动
      return;
    }
  }

  let scrollTop = itemTop;
  if (_align !== 'start') {
    const itemSize = listMetaData[index].size;
    if (_align === 'center') {
      scrollTop = itemTop - cSize / 2 + itemSize / 2;
    } else if (_align === 'end') {
      scrollTop = itemTop - cSize + itemSize;
    } else if (typeof _align === 'number') {
      scrollTop = itemTop + _align;
    }
  }

  wrapperRef.value.scrollTo({
    top: scrollTop,
    behavior: props.itemSize ? behavior : 'instant',
  });
};

interface ItemMeta {
  id: string | number;
  index: number;
  top: number;
  bottom: number;
  size: number;
  measured: boolean;
  isScrolling: boolean;
}

let listMetaData: Array<ItemMeta> = [];
// 列表数据变换时，重新计算尺寸数据
watch(
  [() => props.itemSize, () => listData.value],
  ([propSize, dataList]) => {
    const itemSize = propSize ? propSize : props.defaultItemSize;

    let lastTop = 0;
    listMetaData = dataList.map((item, index) => {
      // 非固定高度
      if (!propSize) {
        const m = listMetaData.find((mItem) => mItem.id === item.id);
        if (m && m.measured) {
          lastTop = m.bottom;
          return m;
        }
      }

      const metaItem = {
        id: item.id,
        index,
        size: itemSize,
        top: lastTop,
        bottom: lastTop + itemSize,
        measured: propSize ? true : false,
        isScrolling: false,
      };

      lastTop += itemSize;

      return metaItem;
    });
    contentSize.value = listMetaData[listMetaData.length - 1].bottom;
  },
  {
    immediate: true,
  }
);

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
const updateVisibleCount = (scrollOffset?: number) => {
  let scrollSize = scrollOffset;
  if (isUndefined(scrollSize)) {
    scrollSize = wrapperRef.value?.scrollTop ?? 0;
  }
  const { height: containerHeight } = containerSize.value;
  if (!wrapperRef.value || !containerHeight) {
    return;
  }

  for (let i = visibleStartIndex.value + 1; i < listMetaData.length; i++) {
    const meta = listMetaData[i];
    if (meta.top >= scrollSize + containerHeight) {
      renderCount.value = i - visibleStartIndex.value;
      break;
    }
  }
};

const debounceUpdateVisibleCount = debounceRAF(updateVisibleCount);
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
    visibleStartIndex.value = Math.floor(scrollOffset / props.itemSize);
    offset.value = listMetaData[startIndex.value].top;
    visibleStartId = listMetaData[visibleStartIndex.value].id;
    return;
  }

  visibleStartIndex.value = getStartIndex(scrollOffset);
  offset.value = listMetaData[startIndex.value].top;
  visibleStartId = listMetaData[visibleStartIndex.value].id;

  debounceUpdateVisibleCount(scrollOffset);
};
/**
 * 子项尺寸变化时，重新刷新meta数据
 */
const onItemResize = (en: ResizeObserverEntry, index: number) => {
  const el = en.target as HTMLElement;
  const meta = listMetaData[index];

  const size = el.offsetHeight;
  // 如果之前计算过，且尺寸无变化，则不需要刷新meta数据
  if (meta.measured && meta.size === size) {
    return;
  }

  // 如果未计算的元素在滚动位置之前，则需要修正默认高度与渲染后的高度差，避免抖动
  if (meta.measured === false && wrapperRef.value && wrapperRef.value.scrollTop > meta.top) {
    wrapperRef.value.scrollTop += size - meta.size;
  }

  meta.size = size;
  meta.measured = true;
  meta.bottom = meta.top + meta.size;

  updateMeta(index);

  // 处理初始滚动位置
  if (index === props.defaultStartIndex && !initialScroll) {
    // 等渲染后再重新定位滚动初始位置
    nextTick(() => {
      scrollToView(props.defaultStartIndex);
      initialScroll = true;
    });
  }

  debounceUpdateVisibleCount();
};

const init = () => {
  if (!wrapperRef.value) {
    return;
  }
  // 先初始化滚动位置
  if (props.itemSize) {
    scrollToView(props.defaultStartIndex);
    initialScroll = true;
  }
};

onMounted(() => {
  init();
});

defineExpose({
  scrollToView,
});
</script>

<template>
  <div class="o-virtual-list">
    <div class="o-virtual-list-wrapper" v-on-resize="onContainerResize" ref="wrapperRef" v-scrollbar="scrollbarProps" @scroll.passive="onScroll">
      <div class="o-virtual-body" :style="contentStyle">
        <div class="o-virtual-render-list" :style="renderListStyle">
          <template v-for="item in renderList" :key="item.index">
            <template v-if="props.itemSize">
              <div class="o-virtual-render-item" :style="{ height: props.itemSize + 'px' }">
                <slot :item="item.data" :index="item.index"></slot>
              </div>
            </template>
            <div v-else class="o-virtual-render-item" v-on-resize="(en:ResizeObserverEntry) => onItemResize(en, item.index)">
              <slot :item="item.data" :index="item.index"></slot>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
