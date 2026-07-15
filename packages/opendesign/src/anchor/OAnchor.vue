<script setup lang="ts">
import { CSSProperties, nextTick, onMounted, onUnmounted, provide, ref, shallowRef, toRef } from 'vue';
import { anchorProps, type AnchorContainerT } from './types';
import { anchorInjectKey } from './provide';
import { isString, isUndefined, isWindow, isCurrentPageLink } from '../_utils/is';
import { checkElementOverflowHorizontal, getCssVariable, getScroll, getScrollParents, scrollTo } from '../_utils/dom';
import { throttleRAF } from '../_utils/helper';
import { useResizeObserver } from '../hooks/use-resize-observer';

const props = defineProps(anchorProps);

const emits = defineEmits<{
  /**
   * @deprecated 请使用`item-click`事件替代，将在 v2.0.0 移除
   */
  (e: 'click', ev: MouseEvent, link?: string): void;
  (e: 'change', link: string): void;
}>();

const ANCHOR_REGX = /#([\S ]+)$/;

const anchorRef = ref<HTMLDivElement>();
const anchorItemsRef = ref<HTMLDivElement>();

const isScrolling = ref(false);

const links = ref<Set<string>>(new Set());
const activeLink = ref('');

const indicatorStyle = ref<CSSProperties>({});

const scrollContainer = ref<AnchorContainerT>();

const getContainer = (container: string | AnchorContainerT = window) => {
  if (isString(container)) {
    const dom = document.querySelector(container) as HTMLElement;
    return dom ? dom : window;
  }
  return container;
};

const updateIndicatorPosition = () => {
  const el = anchorRef.value?.querySelector<HTMLAnchorElement>('.o-anchor-item-link.is-active');

  if (!el) {
    indicatorStyle.value = {};
    return;
  }
  const { offsetTop, offsetHeight } = el;
  const depth = el.getAttribute('data-depth');
  indicatorStyle.value.top = `${offsetTop}px`;
  indicatorStyle.value.height = `${offsetHeight}px`;
  indicatorStyle.value.opacity = depth === '0' ? 0 : 1;

  if (props.layout !== 'h') {
    return;
  }
  const { isOverflowLeft, isOverflowRight, overflowLeft, overflowRight } = checkElementOverflowHorizontal({ element: el });

  if (!isOverflowLeft && !isOverflowRight) {
    return;
  }
  const xOverflownWidth = Number.parseInt(getCssVariable('--anchor-x-overflown-width', el));
  const itemGap = Number.parseInt(getCssVariable('--anchor-item-gap', el));
  const adjustX = xOverflownWidth + itemGap;
  const toScrollLeftBy = isOverflowLeft ? -overflowLeft - adjustX : overflowRight + adjustX;
  anchorItemsRef.value?.scrollBy({
    left: toScrollLeftBy,
    behavior: 'smooth',
  });
};

const xOverflown = ref({ left: false, right: false });
const itemsScrollLeft = ref(0);
const handleScroll = throttleRAF(() => {
  if (props.layout !== 'h' || !anchorItemsRef.value) {
    return;
  }
  const { scrollLeft, scrollWidth, clientWidth } = anchorItemsRef.value!;
  itemsScrollLeft.value = scrollLeft;
  xOverflown.value.left = scrollLeft > 0;
  xOverflown.value.right = scrollLeft + clientWidth < scrollWidth;
});
onMounted(handleScroll);

const setActiveLink = async (link: string) => {
  if (activeLink.value === link) {
    return;
  }

  activeLink.value = link;

  emits('change', activeLink.value);

  await nextTick();
  updateIndicatorPosition();
};

const getAnchorTarget = (link: string) => {
  const anchorMatches = ANCHOR_REGX.exec(link);

  if (!anchorMatches) {
    return;
  }

  const target = document.getElementById(anchorMatches[1]);

  return target;
};

const getOffsetTop = (el: HTMLElement, container: AnchorContainerT) => {
  const { top } = el.getBoundingClientRect();
  if (isWindow(container)) {
    return top - document.documentElement.clientTop;
  }

  return top - container.getBoundingClientRect().top;
};

/**
 * 滚动至指定锚点位置
 */
const scrollIntoView = async (link: string) => {
  if (!isCurrentPageLink(link)) {
    return;
  }
  setActiveLink(link);

  const target = getAnchorTarget(link);

  if (!target) {
    return;
  }

  isScrolling.value = true;

  const { scrollTop } = getScroll(scrollContainer.value as HTMLElement);
  const offsetTop = getOffsetTop(target, scrollContainer.value as HTMLElement);

  const y = scrollTop + offsetTop - props.targetOffset;

  await scrollTo(y, {
    container: scrollContainer.value,
  });

  isScrolling.value = false;
};

const activeNearest = () => {
  const distances: Array<{ link: string; top: number }> = [];
  const { targetOffset, bounds } = props;

  let active = '';

  links.value.forEach((link) => {
    const target = getAnchorTarget(link);
    if (target) {
      const top = getOffsetTop(target, scrollContainer.value as AnchorContainerT);

      if (top < targetOffset + bounds) {
        distances.push({
          link,
          top,
        });
      }
    }
  });

  if (distances.length) {
    const max = distances.reduce((prev, cur) => (prev.top > cur.top ? prev : cur));
    active = max.link;
  }

  setActiveLink(active);
};

// 滚动事件
const onScroll = () => {
  if (isScrolling.value) {
    return;
  }
  activeNearest();
};

const bindEvent = () => {
  if (isUndefined(scrollContainer.value)) {
    return;
  }

  scrollContainer.value.addEventListener('scroll', onScroll, { passive: true });
};

const unbindEvent = () => {
  if (isUndefined(scrollContainer.value)) {
    return;
  }

  scrollContainer.value.removeEventListener('scroll', onScroll);
};

const addLink = (link: string) => {
  if (!ANCHOR_REGX.test(link) || links.value.has(link)) {
    return;
  }

  links.value.add(link);
};

const removeLink = (link: string) => {
  links.value.add(link);
};

/**
 * @deprecated 请使用 `item-click` 事件替代，将在 v2.0.0 移除
 */
const onItemClick = (options: { event: MouseEvent; link?: string }) => {
  const { event, link } = options;
  emits('click', event, link);
};

provide(anchorInjectKey, {
  addLink,
  removeLink,
  onItemClick,
  activeLink,
  scrollIntoView,
  layout: toRef(props, 'layout'),
  getChangeHash: () => props.changeHash,
});

// 添加响应式
const onAnchorResize = throttleRAF(() => {
  updateIndicatorPosition();
  handleScroll();
});

onMounted(() => {
  const ro = useResizeObserver();
  scrollContainer.value = getContainer(props.container);
  const hash = decodeURIComponent(window.location.hash);
  if (hash) {
    scrollIntoView(hash);
  } else {
    activeNearest();
  }
  nextTick(() => {
    bindEvent();
    if (anchorRef.value) {
      ro.observe(anchorRef.value, onAnchorResize);
    }
  });
});

onUnmounted(() => {
  unbindEvent();
  const ro = useResizeObserver();
  if (anchorRef.value) {
    ro.unobserve(anchorRef.value, onAnchorResize);
  }
});

/** 横向 anchor 是否处于 sticky 吸附状态 */
const isAnchorStickying = ref(false);
/**
 * anchor 的可滚动祖先元素，用于检测 sticky 状态。
 * 为空时表示 anchor 直接挂在页面顶层，参照系为视口（window）。
 */
const anchorParent = shallowRef<HTMLElement>();

/**
 * @description 检测横向 anchor 是否处于 sticky 吸附状态，
 * 通过比较 anchor 与其滚动参照系（可滚动祖先元素或视口）的矩形位置判断
 */
const detectSticking = throttleRAF(() => {
  if (!anchorRef.value) {
    return;
  }
  const elRect = anchorRef.value.getBoundingClientRect();
  // 无可滚动祖先时以视口顶部（top: 0）为参照
  const containerTop = anchorParent.value ? anchorParent.value.getBoundingClientRect().top : 0;

  const stickyOffset = parseFloat(window.getComputedStyle(anchorRef.value).top) || 0;
  isAnchorStickying.value = elRect.top <= containerTop + stickyOffset && elRect.bottom > containerTop + stickyOffset;
});
onMounted(() => {
  // 仅横向布局需要 sticky 检测
  if (props.layout !== 'h') {
    return;
  }
  // 获取 anchor 的第一个可滚动祖先元素；若无（如直接挂在页面顶层），则监听 window 滚动
  anchorParent.value = getScrollParents(anchorRef.value!)[0];
  if (anchorParent.value) {
    anchorParent.value.addEventListener('scroll', detectSticking, { passive: true });
  } else {
    window.addEventListener('scroll', detectSticking, { passive: true });
  }
});
onUnmounted(() => {
  if (anchorParent.value) {
    anchorParent.value.removeEventListener('scroll', detectSticking);
  } else {
    window.removeEventListener('scroll', detectSticking);
  }
});
</script>

<template>
  <div ref="anchorRef" :class="['o-anchor', `o-anchor-${props.layout}`, `o-anchor-${props.size}`, isAnchorStickying && `o-anchor-stickying`]">
    <div v-if="props.layout === 'v'" class="o-anchor-line">
      <div class="o-anchor-indicator" :style="indicatorStyle"></div>
    </div>
    <div
      ref="anchorItemsRef"
      :class="{
        'o-anchor-items': true,
        'left-overflown': xOverflown.left,
        'right-overflown': xOverflown.right,
      }"
      :style="{
        '--o-anchor-ellipsis-left': itemsScrollLeft,
        '--o-anchor-ellipsis-right': -itemsScrollLeft,
      }"
      @scroll="handleScroll"
    >
      <slot></slot>
    </div>
  </div>
</template>
