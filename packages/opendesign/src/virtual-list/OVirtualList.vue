<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';
import { useResizeObserver, type ResizeObserverEntry } from '@vueuse/core';
import { isClient, isFunction, isNumber, isUndefined } from '../_utils/is';
import { debounceRAF } from '../_utils/helper';
import { useGetUniqueId } from '../_utils/unique-id';
import { type BaseScrollerPropsT, OScrollbar } from '../scrollbar';

import { type Alignment, type RenderIndexInfo, type VirtualListExpose, virtualListProps } from './types';
import VirtualListItem from './VirtualListItem.vue';
import { findIndexByOffset, type MetaAccessor } from './utils/binary-search';
import { calculateScrollTarget, createAxisSelector, resolveNearestAlign } from './utils/alignment';
import { useScrollState } from './composables/use-scroll-state';
import { useWheel } from './composables/use-wheel';

const props = defineProps(virtualListProps);

defineSlots<{
  default(props: { item: any; index: number }): any;
}>();

const emits = defineEmits<{
  /**
   * @zh-CN 虚拟列表渲染区域变化时触发
   * @en-US Triggered when the virtual list render area changes
   */
  (e: 'renderChange', renderIndex: RenderIndexInfo): void;
}>();
/**
 * 滚动条参数，同时作为 OScrollbar 组件的渲染条件（v-if）与 props 数据源（v-bind）
 * @description scrollbar=true 时提供默认配置；为 false 时返回 falsy 值以跳过 OScrollbar 渲染
 */
const scrollbarProps = computed(() => {
  if (props.scrollbar === true) {
    return {
      showType: 'always',
      size: 'medium',
    } as Partial<BaseScrollerPropsT>;
  }
  return props.scrollbar;
});

// ============================================================================
// 布局方向与高度模式
// ============================================================================

/** 水平布局标志 */
const isHorizontal = computed(() => props.layout === 'horizontal');

/** 定高模式（itemSize 为数字） */
const isFixedHeight = computed(() => isNumber(props.itemSize));
/** 按项定高模式（itemSize 为函数，接收 item 和 index 参数） */
const isFunctionHeight = computed(() => isFunction(props.itemSize));
/** 不定高模式（itemSize 未传）——需要 ResizeObserver 运行时测量 */
const isDynamicMode = computed(() => !isFixedHeight.value && !isFunctionHeight.value);

/**
 * @description 获取指定项的高度（定高/按项定高模式）
 * @param item 列表项原始数据
 * @param index 列表项索引
 * @returns 项高度（不定高模式返回 defaultItemSize 作为估算值）
 */
const getItemHeight = (item: unknown, index: number): number => {
  if (isFixedHeight.value) {
    return props.itemSize as number;
  }
  if (isFunctionHeight.value) {
    return (props.itemSize as (item: unknown, i: number) => number)(item, index);
  }
  return props.defaultItemSize;
};

// ============================================================================
// 轴选择器——根据布局方向选择正确的滚动轴和尺寸属性
// ============================================================================

const { getScroll, setScroll: _setScroll, getAxisSize, getScrollSize, getClientSize, scrollToPos: _scrollToPos } = createAxisSelector(isHorizontal);

/**
 * @description 程序化滚动标志——区分用户滚动与组件内部滚动
 *
 * scrollToView / correctScrollForResize 等内部方法修改 scrollTop 前置此标志，
 * onScroll 检测到标志为 true 时说明是程序化滚动的回声（非用户操作），重置标志；
 * 标志为 false 时说明是用户主动滚动，应终止初始重定位（needsInitialReScroll）。
 * 浏览器对 scroll 事件做帧节流（每帧至多 1 次），同一帧内多次 setScroll
 * 只产生 1 个 scroll 事件，因此布尔标志足以覆盖。
 */
let isProgrammaticScroll = false;

/** @description 包裹 setScroll，置程序化滚动标志 */
const setScroll = (el: HTMLElement, val: number) => {
  isProgrammaticScroll = true;
  _setScroll(el, val);
};

/** @description 包裹 scrollToPos，置程序化滚动标志 */
const scrollToPos = (el: HTMLElement, pos: number, behavior: ScrollBehavior) => {
  isProgrammaticScroll = true;
  _scrollToPos(el, pos, behavior);
};
/**
 * 生成稳定的 fallback ID，用于 list 项缺少 id 字段时避免
 * findIndex 匹配到第一个 id===undefined 的项
 */
const genFallbackId = useGetUniqueId();

/**
 * 对列表数据预处理
 *
 * 不定高模式（!itemSize）下，若 item 缺少 id 字段，所有项 id 为 undefined，
 * 动态插入时 findIndex 会匹配到第 0 项导致滚动跳顶。
 * 此时用 genFallbackId() 生成稳定 ID，并在开发环境 console.warn 提示。
 */
const listData = ref<
  Array<{
    id: number | string;
    index: number;
    data: unknown;
  }>
>([]);
watch(
  () => props.list,
  (value) => {
    const hasId = value.length > 0 && !isUndefined((value[0] as { id?: unknown }).id);
    if (!hasId && isDynamicMode.value && value.length > 0 && isClient) {
      // eslint-disable-next-line no-console
      console.warn('[OVirtualList] 不定高模式下建议为每一项传入唯一 id 字段，' + '否则动态追加数据时滚动位置可能跳变。已自动生成 fallback ID。');
    }
    listData.value = value.map((item, index) => ({
      id: (item as { id?: string | number }).id ?? genFallbackId(),
      data: item,
      index,
    }));
  },
  {
    immediate: true,
  },
);
const defaultStartIndex = computed(() => {
  if (isUndefined(props.defaultStartIndex)) {
    return 0;
  }
  return Math.max(Math.min(props.defaultStartIndex, props.list.length - 1), 0);
});
// 可视区域内的起始序号
const visibleStartIndex = ref(defaultStartIndex.value ?? 0);
let visibleStartId: string | number | undefined;
// 可视区域内的结束序号
const renderCount = ref(1);
// 渲染起始序号
const startIndex = computed(() => {
  return Math.max(visibleStartIndex.value - props.buffer, 0);
});
// 渲染结束序号
const endIndex = computed(() => {
  return Math.min(visibleStartIndex.value + renderCount.value + props.buffer - 1, listData.value.length - 1);
});

let lastVisibleStartIndex = visibleStartIndex.value;
let lastRenderCount = renderCount.value;
const emitRenderChange = () => {
  if (lastVisibleStartIndex !== visibleStartIndex.value || lastRenderCount !== renderCount.value) {
    emits('renderChange', {
      start: startIndex.value,
      end: endIndex.value,
      count: renderCount.value,
      visible: visibleStartIndex.value,
    });
    lastVisibleStartIndex = visibleStartIndex.value;
    lastRenderCount = renderCount.value;
  }
};

interface ItemMeta {
  id: string | number;
  index: number;
  top: number;
  bottom: number;
  size: number;
  measured: boolean;
}
const wrapperRef = ref<HTMLElement>();
// 虚拟列表偏移量，用于虚拟滚动
const offset = ref(0);
/** 滚动状态机（isScrolling 状态 + RAF 一致化） */
const { isScrolling, markScrolling, cleanup: cleanupScrollState } = useScrollState();
/**
 * 初始化滚动位置
 */
let initialScroll = isFixedHeight.value || isFunctionHeight.value;

/**
 * @description 不定高模式下初始滚动的重定位机制
 *
 * 初始 contentSize 以 defaultItemSize 估算，可能远小于实际总高度，
 * 导致浏览器 maxScroll 偏小、scrollToView 的目标偏移被提前 clamp。
 * 随可见项测量，contentSize 和 itemTop 会逐步更新，需要重新定位。
 */
let needsInitialReScroll = false;
let initialReScrollCount = 0;
const MAX_INITIAL_RESCROLL = 5;

let listMetaData: Array<ItemMeta> = [];

/**
 * @description 已计算 top/bottom 的最高索引（懒计算缓存指针）
 *
 * 所有 <= lastMeasuredIndex 的项已确定 top/bottom；
 * 之后的项用 meta.size（估算或已测量）估算，访问时按需计算。
 * -1 表示无项已计算。
 */
let lastMeasuredIndex = -1;

/**
 * @description 未计算项的尺寸总和缓存，使 contentSize 计算为 O(1)
 *
 * = sum(meta.size for i > lastMeasuredIndex)
 */
let unmeasuredTotal = 0;

/**
 * @description 确保指定索引项的 top/bottom 已计算（懒计算核心）
 *
 * 当 index > lastMeasuredIndex 时，从 lastMeasuredIndex+1 累加到 index，
 * 逐项设置 top/bottom 并推进 lastMeasuredIndex，同时从 unmeasuredTotal 中
 * 扣除已计算项的 size。
 * @param index 需要计算的索引
 */
const ensureMeasured = (index: number) => {
  if (index <= lastMeasuredIndex || listMetaData.length === 0) {
    return;
  }
  const start = lastMeasuredIndex + 1;
  let top = lastMeasuredIndex >= 0 ? listMetaData[lastMeasuredIndex].bottom : 0;
  for (let i = start; i <= index; i++) {
    const meta = listMetaData[i];
    meta.top = top;
    meta.bottom = top + meta.size;
    top = meta.bottom;
    unmeasuredTotal -= meta.size;
  }
  lastMeasuredIndex = index;
};

/**
 * @description 索引边界守卫——所有 listMetaData[index] 访问必须经此函数，
 *              防止 listData 缩短后索引越界导致 .top/.id 崩溃
 * @param index 原始索引
 * @returns clamped 后的 ItemMeta，空数组时返回 undefined
 */
const safeMeta = (index: number): ItemMeta | undefined => {
  if (listMetaData.length === 0) {
    return undefined;
  }
  const i = Math.max(0, Math.min(index, listMetaData.length - 1));
  return listMetaData[i];
};

/**
 * @description 获取指定索引项的 top 偏移量（懒计算访问器）
 *
 * 当 index > lastMeasuredIndex 时触发 ensureMeasured 按需计算。
 * @param index 列表项索引
 * @returns top 偏移量，空数组或越界时返回 0
 */
const getMetaTop = (index: number): number => {
  const meta = safeMeta(index);
  if (!meta) {
    return 0;
  }
  if (index > lastMeasuredIndex) {
    ensureMeasured(index);
  }
  return meta.top;
};

/**
 * @description 获取指定索引项的 bottom 偏移量（懒计算访问器）
 * @param index 列表项索引
 * @returns bottom 偏移量，空数组或越界时返回 0
 */
const getMetaBottom = (index: number): number => {
  const meta = safeMeta(index);
  if (!meta) {
    return 0;
  }
  if (index > lastMeasuredIndex) {
    ensureMeasured(index);
  }
  return meta.bottom;
};

/**
 * @description O(1) 估算列表总高度
 * @returns 已测量项末位 bottom + 未测量项尺寸总和
 */
const getEstimatedTotalSize = (): number => {
  if (listMetaData.length === 0) {
    return 0;
  }
  if (lastMeasuredIndex < 0) {
    return unmeasuredTotal;
  }
  return listMetaData[lastMeasuredIndex].bottom + unmeasuredTotal;
};

// 列表虚拟总高度，先给定初始值
const initialSize = isFixedHeight.value ? (props.itemSize as number) * listData.value.length : props.defaultItemSize * listData.value.length;
const contentSize = ref(initialSize);

// 容器可视区尺寸
const containerSize = ref({
  height: 0,
  width: 0,
});
/** 主轴尺寸（垂直=height, 水平=width） */
const containerMainSize = computed(() => (isHorizontal.value ? containerSize.value.width : containerSize.value.height));

/** @description 是否启用虚拟滚动——threshold 为 null 时始终启用 */
const isVirtualEnabled = computed(() => {
  if (props.threshold === null) {
    return true;
  }
  return listData.value.length >= props.threshold && contentSize.value > containerMainSize.value;
});

/** 渲染的数据——虚拟滚动模式下裁剪，否则全量渲染 */
const renderList = computed(() => {
  if (!isVirtualEnabled.value) {
    return listData.value;
  }
  return listData.value.slice(startIndex.value, endIndex.value + 1);
});

/**
 * @description 根据当前滚动位置，计算可视区域的展示项数量
 * @param scrollOffset 可选的滚动偏移量，未传则从 wrapperRef 读取
 */
const updateVisibleCount = (scrollOffset?: number) => {
  let scrollSize = scrollOffset;
  if (isUndefined(scrollSize)) {
    scrollSize = wrapperRef.value ? getScroll(wrapperRef.value) : 0;
  }
  const containerHeight = containerMainSize.value;
  if (!wrapperRef.value || !containerHeight) {
    return;
  }

  let render = 1;
  for (let i = visibleStartIndex.value + 1; i < listMetaData.length; i++) {
    if (getMetaTop(i) < scrollSize + containerHeight) {
      render++;
    }
  }
  renderCount.value = render;
  emitRenderChange();
};

const debounceUpdateVisibleCount = debounceRAF(updateVisibleCount);

/**
 * @description 容器尺寸变化后，根据当前 scrollTop 重新定位起始渲染项
 * @param scrollTop 当前滚动偏移量
 */
const refreshStartIndex = (scrollTop: number) => {
  for (let i = visibleStartIndex.value; i >= 0; i--) {
    if (getMetaTop(i) <= scrollTop) {
      visibleStartIndex.value = i;
      break;
    }
  }
};

/**
 * @description 容器尺寸变化后，根据可视区域重新计算渲染项数量
 * @param scrollTop 当前滚动偏移量
 * @param mainSize 容器主轴尺寸
 */
const refreshRenderCount = (scrollTop: number, mainSize: number) => {
  let count = renderCount.value;
  for (let i = endIndex.value; i < listMetaData.length; i++) {
    if (getMetaTop(i) < scrollTop + mainSize) {
      count++;
    }
  }
  renderCount.value = count;
};

const onContainerResize = () => {
  if (!wrapperRef.value) {
    return;
  }
  containerSize.value.height = wrapperRef.value.offsetHeight;
  containerSize.value.width = wrapperRef.value.offsetWidth;

  const mainSize = containerMainSize.value;
  // 当容器主轴尺寸为0，需要更新offset值
  if (mainSize === 0) {
    offset.value = 0;
  }

  // 第一次初始化滚动位置后，再根据容器尺寸变化刷新渲染项
  // 未初始化时（不定高模式首次），仍需更新 renderCount 以填充可视区
  if (!initialScroll) {
    if (contentSize.value < mainSize) {
      visibleStartIndex.value = 0;
    }
    updateVisibleCount();
    return;
  }

  const scrollTop = getScroll(wrapperRef.value);
  refreshStartIndex(scrollTop);
  refreshRenderCount(scrollTop, mainSize);
  emitRenderChange();
};

/**
 * @description 容器尺寸变化监听——替代 v-on-resize 指令，
 *              useResizeObserver 自动随组件卸载清理，无需手动 unobserve
 */
useResizeObserver(wrapperRef, () => {
  onContainerResize();
});

const contentStyle = computed<CSSProperties>(() => ({
  [isHorizontal.value ? '--_vl-content-width' : '--_vl-content-height']: `${contentSize.value}px`,
}));

const renderListStyle = computed<CSSProperties>(() => {
  return {
    // 非虚拟模式（isVirtualEnabled=false）下全量渲染 DOM，不需要 transform 偏移；
    // 若应用非 0 的 offset，会将项推出 o-virtual-body 的 overflow:hidden 范围，
    // 导致末尾项永远无法滚入视口
    [isHorizontal.value ? '--_vl-offset-x' : '--_vl-offset-y']: `${isVirtualEnabled.value ? offset.value : 0}px`,
    // 滚动中禁用子项交互，避免 hover/click 触发不必要的 re-render
    pointerEvents: isScrolling.value ? 'none' : undefined,
  };
});

/**
 * @description 待精准对齐的滚动请求——当目标项未测量时暂存，测量后重新滚动
 */
let pendingScrollTo: { index: number; align: 'start' | 'end' | 'center' | number; behavior: ScrollBehavior } | null = null;
/** 二次逼近迭代计数，防止无限循环 */
let approachCount = 0;
const MAX_APPROACH = 10;

/**
 * @description 设置待精准对齐的滚动请求
 */
const setupPendingScroll = (toIndex: number, align: Alignment, behavior: ScrollBehavior) => {
  pendingScrollTo = { index: toIndex, align: align as 'start' | 'end' | 'center' | number, behavior };
  approachCount = 0;
};

/** @description 定高/按索引定高模式允许自定义 behavior，不定高仅 instant */
const resolveBehavior = (behavior: ScrollBehavior): ScrollBehavior => (isFixedHeight.value || isFunctionHeight.value ? behavior : 'instant');

/**
 * 将指定项滚动到视口内
 * @param index 指定项
 * @param align 'start' | 'end' | 'center' | 'nearest' | number, 默认值'start'
 * @param behavior ScrollBehavior, 默认值 'instant'
 */
const scrollToView = (index: number, align: Alignment = 'start', behavior: ScrollBehavior = 'instant') => {
  if (!wrapperRef.value) {
    return;
  }
  const toIndex = Math.max(Math.min(listMetaData.length - 1, index), 0);
  const item = safeMeta(toIndex);
  if (!item) {
    return;
  }

  const itemTop = getMetaTop(toIndex);
  const cSize = getAxisSize(wrapperRef.value);

  // 解析 'nearest' 对齐方式
  let _align = align;
  if (_align === 'nearest') {
    const resolved = resolveNearestAlign({ currentScroll: getScroll(wrapperRef.value), itemTop, itemSize: item.size, containerSize: cSize });
    if (resolved === null) {
      return;
    }
    _align = resolved;
  }

  // 未测量回退——先 start 对齐，测量后重滚
  if (!item.measured && _align !== 'start') {
    setupPendingScroll(toIndex, _align, behavior);
    scrollToPos(wrapperRef.value, itemTop, 'instant');
    return;
  }

  const scrollTarget = calculateScrollTarget(itemTop, _align, { containerSize: cSize, itemSize: item.size });

  // 二次逼近——目标项距离当前可视区较远时暂存请求
  if (Math.abs(toIndex - visibleStartIndex.value) > renderCount.value && !item.measured) {
    setupPendingScroll(toIndex, _align, behavior);
  }

  scrollToPos(wrapperRef.value, scrollTarget, resolveBehavior(behavior));
};

/**
 * @description 二次逼近——当待测项测量后重新评估滚动位置
 *
 * 每次 onItemResize 后调用（debounced），检查目标项是否已测量：
 * - 已测量：清除 pending，用精准尺寸重新 scrollToView
 * - 未测量：用更新后的估算位置修正 scrollTop，让目标项进入渲染队列
 * - 超过 MAX_APPROACH 次：放弃，用当前数据做最终滚动
 */
const debouncedReApproach = debounceRAF(() => {
  if (!pendingScrollTo || !wrapperRef.value) {
    return;
  }
  approachCount++;
  const { index: targetIndex, align: targetAlign, behavior: targetBehavior } = pendingScrollTo;
  const targetMeta = safeMeta(targetIndex);

  if (targetMeta && targetMeta.measured) {
    // 目标已测量——清除 pending，做最终精准滚动
    pendingScrollTo = null;
    scrollToView(targetIndex, targetAlign, targetBehavior);
    return;
  }

  if (approachCount >= MAX_APPROACH) {
    // 超过最大迭代——放弃精准对齐，用当前估算数据做最终滚动
    pendingScrollTo = null;
    return;
  }

  // 目标仍未测量——用更新后的估算位置修正 scrollTop，让目标进入渲染队列
  const estimatedTop = getMetaTop(targetIndex);
  const currentScroll = getScroll(wrapperRef.value);
  if (Math.abs(estimatedTop - currentScroll) > 1) {
    setScroll(wrapperRef.value, estimatedTop);
  }
});

/**
 * @description 为单个数据项构建 ItemMeta（提取自 watch 的 map 回调，降低圈复杂度）
 * @param item 列表项数据（包含 id 和原始 data）
 * @param index 在 dataList 中的索引
 * @param prevMetaMap 上一轮 meta 的 id 索引（Map，O(1) 查找），用于复用已测量尺寸
 * @returns 新的 ItemMeta
 */
const buildMetaItem = (item: { id: number | string; data: unknown }, index: number, prevMetaMap: Map<string | number, ItemMeta>): ItemMeta => {
  // 不定高模式：复用已测量的 size
  if (isDynamicMode.value) {
    const prev = prevMetaMap.get(item.id);
    if (prev && prev.measured) {
      return { id: item.id, index, size: prev.size, top: 0, bottom: 0, measured: true };
    }
  }
  const isKnownHeight = isFixedHeight.value || isFunctionHeight.value;
  return { id: item.id, index, size: getItemHeight(item.data, index), top: 0, bottom: 0, measured: isKnownHeight };
};

/**
 * @description 滚动重定位——数据变化后根据 visibleStartId 重新定位
 * @param dataList 新的列表数据
 */
const repositionScroll = (dataList: typeof listData.value) => {
  if (isUndefined(visibleStartId) || !wrapperRef.value) {
    return;
  }
  const scrollOffset = getScroll(wrapperRef.value);
  const delta = scrollOffset - getMetaTop(visibleStartIndex.value);
  const newIndex = dataList.findIndex((item) => item.id === visibleStartId);
  if (newIndex >= 0) {
    visibleStartIndex.value = newIndex;
    setScroll(wrapperRef.value, getMetaTop(newIndex) + delta);
  }
};

/**
 * 列表数据或 itemSize 变化时，重新计算尺寸数据并重定位滚动位置
 *
 * 合并原两个 watch（meta 重建 + 滚动重定位），消除时序竞争。
 */
watch(
  [() => props.itemSize, () => listData.value],
  ([, dataList]) => {
    // 空数组守卫
    if (dataList.length === 0) {
      listMetaData = [];
      lastMeasuredIndex = -1;
      unmeasuredTotal = 0;
      contentSize.value = 0;
      return;
    }

    const isKnownHeight = isFixedHeight.value || isFunctionHeight.value;

    // 不定高模式：预建 id → ItemMeta 索引，将复用查找从 O(n) 降为 O(1)
    const prevMetaMap = isDynamicMode.value ? new Map(listMetaData.map((m) => [m.id, m] as const)) : new Map<string | number, ItemMeta>();

    // 重建 meta（委托 buildMetaItem 降低闭包复杂度）
    listMetaData = dataList.map((item, index) => buildMetaItem(item, index, prevMetaMap));

    // 初始化懒计算缓存
    lastMeasuredIndex = -1;
    unmeasuredTotal = 0;
    for (const meta of listMetaData) {
      unmeasuredTotal += meta.size;
    }

    // 定高/按索引定高模式：全量计算
    if (isKnownHeight) {
      ensureMeasured(listMetaData.length - 1);
    }

    contentSize.value = getEstimatedTotalSize();
    repositionScroll(dataList);
  },
  {
    immediate: true,
  },
);

/**
 * @description 批量刷新 contentSize——同一帧内多次 recalcRange 调用只触发一次更新
 */
const flushContentSize = debounceRAF(() => {
  contentSize.value = getEstimatedTotalSize();
});

/**
 * @description 从指定位置开始更新到 lastMeasuredIndex 的 top/bottom（懒计算版 updateMeta）
 *
 * 替代原 updateMeta：仅重算 [start, lastMeasuredIndex] 范围，不遍历未测量项，
 * 复杂度从 O(n-start) 降为 O(lastMeasuredIndex-start)。
 *
 * 注意：meta.top/bottom 是纯 JS 属性（非响应式），同步更新即可；
 * 但 contentSize.value 是响应式 ref，同步赋值会触发 Vue 同帧重新渲染 → DOM 变化
 * → ResizeObserver 再次触发 → "ResizeObserver loop" 错误。
 * 因此 contentSize 的更新延迟到下一帧，打破同步循环。
 * @param start 起始更新位置
 */
const recalcRange = (start: number) => {
  for (let i = start; i <= lastMeasuredIndex; i++) {
    const meta = listMetaData[i];
    meta.top = i > 0 ? listMetaData[i - 1].bottom : 0;
    meta.bottom = meta.top + meta.size;
  }
  // contentSize 延迟到下一帧更新，避免同帧 DOM 变化触发 ResizeObserver loop
  flushContentSize();
};
/** 元数据访问器，供二分查找使用 */
const metaAccessor: MetaAccessor = { getTop: getMetaTop, getBottom: getMetaBottom };

/**
 * @description 根据滚动偏移量，用二分查找定位可视区起始项索引（委托 utils/binary-search.ts）
 */
const getStartIndex = (scrollOffset: number) => findIndexByOffset(listMetaData.length, scrollOffset, metaAccessor);
/**
 * @description 滚动处理核心逻辑——在同一 RAF 内更新 visibleStartIndex、offset 和 renderCount，
 *              消除 startIndex 与 endIndex 的半帧错位
 * @param scrollOffset 当前滚动偏移量
 */
const onScrollImpl = (scrollOffset: number) => {
  if (isFixedHeight.value) {
    visibleStartIndex.value = Math.floor(scrollOffset / (props.itemSize as number));
  } else {
    // 按索引定高或不定高：用二分查找
    visibleStartIndex.value = getStartIndex(scrollOffset);
  }
  offset.value = getMetaTop(startIndex.value);
  const currentMeta = safeMeta(visibleStartIndex.value);
  if (currentMeta) {
    visibleStartId = currentMeta.id;
  }
  // 同帧内更新 renderCount，不再异步延迟
  updateVisibleCount(scrollOffset);
};

const debounceOnScroll = debounceRAF(onScrollImpl);

/**
 * @description scroll 事件回调——标记滚动状态后委托给 RAF 处理
 *
 * 若 isProgrammaticScroll 为 true，说明本次 scroll 事件来自组件内部的
 * setScroll / scrollToPos 调用，重置标志，不影响初始重定位流程；
 * 若为 false，说明是用户主动滚动，终止初始重定位（避免覆盖用户位置）。
 */
const onScroll = () => {
  markScrolling();
  if (isProgrammaticScroll) {
    isProgrammaticScroll = false;
  } else if (needsInitialReScroll) {
    needsInitialReScroll = false;
  }
  const scrollOffset = wrapperRef.value ? getScroll(wrapperRef.value) : 0;
  debounceOnScroll(scrollOffset);
};
/**
 * @description 未测量项或已测量项尺寸变化时，修正滚动位置避免抖动
 *
 * 当项在当前滚动位置之前（itemTop < scrollTop）且尺寸发生变化时，
 * 需要同步修正 scrollTop，否则用户可见区域会跳动。
 * 覆盖两种场景：
 * - 首次测量：meta.size 为估算值，newSize 为实际值
 * - 二次变化：meta.size 为上一次实际值，newSize 为新实际值
 * @param meta 项元数据
 * @param itemTop 项 top 偏移
 * @param newSize 新测量的尺寸
 */
const correctScrollForResize = (meta: ItemMeta, itemTop: number, newSize: number) => {
  if (wrapperRef.value && getScroll(wrapperRef.value) > itemTop) {
    setScroll(wrapperRef.value, getScroll(wrapperRef.value) + newSize - meta.size);
  }
};

/**
 * @description 处理初始滚动位置——作为 init() 的补充回退
 *
 * init() 在 onMounted 中处理所有模式的初始滚动。但当 defaultStartIndex
 * 对应项在首屏不可见（如 list 数据异步到达）时，init() 可能错过时机。
 * 此时 handleInitialScroll 作为回退：目标项被 ResizeObserver 测量后
 * 触发，确保初始滚动一定执行。
 * @param index 被测量的项索引
 */
const handleInitialScroll = (index: number) => {
  if (index !== defaultStartIndex.value || initialScroll) {
    return;
  }
  nextTick(() => {
    scrollToView(defaultStartIndex.value);
    initialScroll = true;
    if (isDynamicMode.value) {
      needsInitialReScroll = true;
      initialReScrollCount = 0;
    }
  });
};

/**
 * @description 子项尺寸变化时，更新 meta 并懒重算影响范围
 */
const onItemResize = (en: ResizeObserverEntry, index: number) => {
  const el = en.target as HTMLElement;
  const meta = safeMeta(index);
  if (!meta) {
    return;
  }

  const newSize = getAxisSize(el);
  if (meta.measured && meta.size === newSize) {
    return;
  }

  const itemTop = getMetaTop(index);
  correctScrollForResize(meta, itemTop, newSize);

  meta.size = newSize;
  meta.measured = true;
  recalcRange(index);

  if (pendingScrollTo) {
    debouncedReApproach();
  }
  handleInitialScroll(index);
  debounceUpdateVisibleCount();
};

/**
 * @description 初始化滚动位置——在 onMounted 中执行
 *
 * - 定高/按项定高模式：itemSize 已知，偏移精确，一次 scrollToView 即可
 * - 不定高模式：以 defaultItemSize 估算偏移量先滚动（可能被浏览器 clamp），
 *   设置 needsInitialReScroll 标志，待可见项测量后 contentSize 更新，
 *   由 contentSize watcher 重新定位到精准位置。
 *   相比仅依赖 handleInitialScroll（需等 ResizeObserver 触发），
 *   init() 在 onMounted 即执行，SSR hydration 后也能立即滚动。
 */
const init = () => {
  if (!wrapperRef.value) {
    return;
  }

  if (isFixedHeight.value || isFunctionHeight.value) {
    // 定高/按索引定高模式：直接初始化滚动位置
    scrollToView(defaultStartIndex.value);
  } else if (isDynamicMode.value && defaultStartIndex.value > 0) {
    // 不定高模式：先以估算偏移量滚动，contentSize watcher 后续修正
    scrollToView(defaultStartIndex.value);
    initialScroll = true;
    needsInitialReScroll = true;
    initialReScrollCount = 0;
  }
};

/**
 * @description 不定高模式下，初始滚动后 contentSize 随可见项测量而更新，
 *              浏览器 maxScroll 随之扩大。此 watcher 在 contentSize 变化后
 *              重新定位到 defaultStartIndex，修正初始滚动被 clamp 的偏差。
 *              当偏移量稳定（|itemTop - currentScroll| ≤ 1）、达到最大重试
 *              次数、或检测到用户已手动滚动（onScroll 中 isProgrammaticScroll
 *              标志判断）时停止。
 */
watch(contentSize, () => {
  if (!needsInitialReScroll || !wrapperRef.value) {
    return;
  }
  initialReScrollCount++;
  if (initialReScrollCount > MAX_INITIAL_RESCROLL) {
    needsInitialReScroll = false;
    return;
  }
  nextTick(() => {
    if (!needsInitialReScroll || !wrapperRef.value) {
      return;
    }
    const itemTop = getMetaTop(defaultStartIndex.value);
    const currentScroll = getScroll(wrapperRef.value);
    if (Math.abs(itemTop - currentScroll) > 1) {
      scrollToView(defaultStartIndex.value);
    } else {
      needsInitialReScroll = false;
    }
  });
});

/**
 * @description 滚动到指定像素偏移量
 * @param px 像素偏移量
 */
const scrollToOffset = (px: number) => {
  if (!wrapperRef.value) {
    return;
  }
  const max = getScrollSize(wrapperRef.value) - getClientSize(wrapperRef.value);
  setScroll(wrapperRef.value, Math.max(0, Math.min(px, max)));
};

// wheel 边界处理——委托 composable
useWheel({ wrapperRef, isHorizontal, axis: { getScroll, setScroll, getAxisSize, getScrollSize, getClientSize, scrollToPos } });

onMounted(() => {
  init();
});

onUnmounted(() => {
  cleanupScrollState();
  debounceOnScroll.cancel();
  debounceUpdateVisibleCount.cancel();
  debouncedReApproach.cancel();
  flushContentSize.cancel();
});

defineExpose<VirtualListExpose>({
  scrollToView,
  scrollToOffset,
});
</script>

<template>
  <div :class="{ 'o-horizontal': isHorizontal, 'o-scrollbar-wrapper': scrollbarProps }" class="o-virtual-list">
    <div ref="wrapperRef" class="o-virtual-list-wrapper" @scroll.passive="onScroll">
      <div :style="contentStyle" class="o-virtual-body">
        <div :style="renderListStyle" class="o-virtual-render-list">
          <template v-for="item in renderList" :key="item.index">
            <VirtualListItem
              :index="item.index"
              :layout="props.layout"
              :main-size="isFixedHeight || isFunctionHeight ? getItemHeight(item.data, item.index) : undefined"
              :observe-resize="isDynamicMode"
              @resize="onItemResize"
            >
              <slot :index="item.index" :item="item.data"></slot>
            </VirtualListItem>
          </template>
        </div>
      </div>
    </div>
    <OScrollbar v-if="scrollbarProps" :target="wrapperRef" v-bind="scrollbarProps" />
  </div>
</template>
