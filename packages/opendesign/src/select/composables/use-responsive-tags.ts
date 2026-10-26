import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import type { SelectOptionT } from '../types';

/**
 * 响应式 Tag 折叠所需的 props 子集
 * @description Vue props 为 reactive proxy，传入 composable 后访问其属性仍保持响应式追踪
 */
interface UseResponsiveTagsProps {
  /** 多选标签最大显示数量，支持数字或 'responsive' 容器宽度自适应 */
  maxTagCount?: number | 'responsive';
  /** 自定义折叠标签文案函数 */
  foldLabel?: (tags: Array<SelectOptionT>) => string;
  /** 浮层显示收起的多选 tag */
  showFoldTags: boolean | 'hover' | 'click';
}

/**
 * 响应式 Tag 折叠的外部依赖
 * @description 这些 Ref / ComputedRef 由 OSelect 上游逻辑提供，composable 内部只读取不创建
 */
interface UseResponsiveTagsDeps {
  /** 是否正在展开选择面板 */
  isSelecting: Ref<boolean>;
  /** 是否需要渲染内联搜索 input（filterable 或 allowCreate） */
  showTagInput: ComputedRef<boolean>;
  /** 最终选中值列表 */
  finalValueList: Ref<Array<string | number>>;
  /** value → label 的映射 */
  optionLabels: ComputedRef<Record<string | number, string>>;
}

/**
 * 响应式 Tag 折叠 composable
 * @description maxTagCount='responsive' 时根据容器宽度自动计算可显示的 tag 数量，
 * 超出部分折叠为 +N... 指示器。使用 VueUse useResizeObserver 监听容器宽度变化，
 * 重置-测量-设置策略确保容器宽度变化时可恢复。
 * @param props 响应式 props 子集（maxTagCount / foldLabel / showFoldTags）
 * @param deps 外部依赖（isSelecting / showTagInput / finalValueList / optionLabels）
 * @returns tagsWrapRef, isResponsiveTag, isMeasuring, valueListDisplay, valueListFold, foldLabel, foldTrigger, calculateResponsiveTags
 */
function UseResponsiveTags(props: UseResponsiveTagsProps, deps: UseResponsiveTagsDeps) {
  const { isSelecting, showTagInput, finalValueList, optionLabels } = deps;

  /** 是否为响应式折叠模式 */
  const isResponsiveTag = computed(() => props.maxTagCount === 'responsive');

  /** 响应式折叠：实际可显示的 tag 数量，null 表示全部显示（SSR 阶段或全部可放下时） */
  const responsiveTagCount = ref<number | null>(null);

  /** tags 容器引用，供 useResizeObserver 监听与 DOM 查询使用 */
  const tagsWrapRef = ref<HTMLElement | null>(null);

  /** 上次测量的容器宽度，防止 ResizeObserver 因高度变化振荡 */
  let lastContainerWidth = 0;

  /**
   * 是否正在执行异步测量（防止重入）
   * @description ref 类型，驱动模板 .is-measuring class，使 input wrapper 在测量期间脱离 flex 流，
   * 避免 tag 被 flex 压缩导致 offsetWidth 偏小
   */
  const isMeasuring = ref(false);

  /** 折叠指示器（+N…）的预留宽度，确保指示器不被 overflow:hidden 裁剪 */
  const FOLD_INDICATOR_RESERVE = 56;

  /** 多选 Tag 状态下展开时 input wrapper 的最小宽度，折叠计算需预留此空间 */
  const INPUT_MIN_WIDTH = 80;

  /**
   * 计算折叠指示器与内联 input 的预留宽度
   * @description dropdown 展开且需要搜索/创建时 input wrapper 占用 INPUT_MIN_WIDTH，折叠计算需一并预留
   * @returns 预留宽度（px）
   */
  const getTagReserveWidth = (): number => (isSelecting.value && showTagInput.value ? FOLD_INDICATOR_RESERVE + INPUT_MIN_WIDTH : FOLD_INDICATOR_RESERVE);

  /**
   * 在 nextTick 后测量 tag 实际宽度并设置 responsiveTagCount
   * @description responsiveTagCount=null 时 DOM 中出现全部 tag，逐个累加 offsetWidth，超出容器宽度则停止
   * @param containerWidth 测量时的容器宽度
   */
  const measureTags = (containerWidth: number) => {
    isMeasuring.value = false;
    if (!tagsWrapRef.value) return;

    const tags = tagsWrapRef.value.querySelectorAll('.o-select-tag');
    if (tags.length === 0 || containerWidth === 0) {
      responsiveTagCount.value = null;
      return;
    }

    let totalWidth = 0;
    let count = 0;
    const reserve = getTagReserveWidth();
    for (const tag of tags) {
      totalWidth += (tag as HTMLElement).offsetWidth + 4; // 4px margin
      // 预留折叠指示器 + input 空间：已有至少 1 个 tag 且加上预留后超出容器则停止
      if (totalWidth + reserve > containerWidth && count > 0) break;
      count++;
    }

    // 全部 tag 都能放下（含折叠指示器预留空间）则不折叠
    responsiveTagCount.value = count >= tags.length ? null : Math.max(1, count);
  };

  /**
   * 计算响应式 tag 数量
   * @description 先重置为全部显示（responsiveTagCount=null），在 nextTick 后 DOM 中出现全部 tag，
   * 逐个累加 offsetWidth，超过容器宽度则停止。通过宽度变化检测防止 ResizeObserver 振荡。
   * @param force 是否强制重新计算（tag 数量变化时为 true，宽度未变也重算）
   */
  const calculateResponsiveTags = (force = false) => {
    if (!tagsWrapRef.value || isMeasuring.value) return;
    const containerWidth = tagsWrapRef.value.clientWidth;

    // 非强制模式下，仅当容器宽度变化时才重新计算（防止高度变化引起的振荡）
    if (!force && containerWidth === lastContainerWidth) return;
    lastContainerWidth = containerWidth;

    // 重置为全部显示，以便在 DOM 中测量所有 tag 的真实宽度
    responsiveTagCount.value = null;
    isMeasuring.value = true;

    nextTick(() => measureTags(containerWidth));
  };

  // VueUse useResizeObserver：自动管理生命周期，target 变化时自动重新观察
  useResizeObserver(tagsWrapRef, () => {
    if (isResponsiveTag.value) calculateResponsiveTags(false);
  });

  // tag 数量变化时强制重新计算
  watch(
    () => finalValueList.value.length,
    () => {
      if (isResponsiveTag.value) {
        nextTick(() => calculateResponsiveTags(true));
      }
    },
  );

  /** 实际显示的值列表（截取可显示部分） */
  const valueListDisplay = computed(() => {
    if (!props.maxTagCount) {
      return finalValueList.value;
    }
    if (props.maxTagCount === 'responsive') {
      const count = responsiveTagCount.value;
      if (count === null) return finalValueList.value; // SSR: 显示全部
      return finalValueList.value.slice(0, count);
    }
    return finalValueList.value.slice(0, props.maxTagCount);
  });

  /** 折叠的值列表 */
  const valueListFold = computed(() => {
    if (!props.maxTagCount) {
      return [];
    }
    if (props.maxTagCount === 'responsive') {
      const count = responsiveTagCount.value;
      if (count === null) return []; // SSR: 无折叠
      return finalValueList.value.slice(count);
    }
    return finalValueList.value.slice(props.maxTagCount);
  });

  /** 折叠指示器文案 */
  const foldLabel = computed(() => {
    if (props.foldLabel) {
      const tags = valueListFold.value.map((item) => ({
        value: item,
        label: optionLabels.value[item] ?? '',
      }));
      return props.foldLabel(tags);
    }
    return `+${valueListFold.value.length}...`;
  });

  /** 折叠标签触发方式 */
  const foldTrigger = typeof props.showFoldTags === 'string' ? props.showFoldTags : 'hover';

  return {
    tagsWrapRef,
    isResponsiveTag,
    isMeasuring,
    valueListDisplay,
    valueListFold,
    foldLabel,
    foldTrigger,
    calculateResponsiveTags,
  };
}

export { UseResponsiveTags as useResponsiveTags };
