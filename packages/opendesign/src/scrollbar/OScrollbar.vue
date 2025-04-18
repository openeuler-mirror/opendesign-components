<script lang="ts" setup>
import { ref, onUnmounted, watchEffect, toRefs } from 'vue';
import ScrollbarRail from './ScrollbarRail.vue';
import { scrollbarProps, ScrollerDirection } from './types';
import { resolveHtmlElement } from '../_utils/vue-utils';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { useScreen } from '../hooks';

const ScrollbarClass = {
  container: 'o-scrollbar-container',
};

const props = defineProps(scrollbarProps);

const { isPhonePad } = useScreen();

// 滚动目标容器
let scrollTargetEl: HTMLElement | null = null;
let scrollListenEl: HTMLElement | null | Window = null;
const rootRef = ref<HTMLElement | null>(null);
const hasY = ref(false);
const hasX = ref(false);
const hThumbRate = ref(0);
const vThumbRate = ref(0);
const hOffsetRate = ref(0);
const vOffsetRate = ref(0);
const isBody = ref(false);

const showXBar = ref(false);
const showYBar = ref(false);
let lastTop = -1;
let lastLeft = -1;
let xTimer: number | null = null;
let yTimer: number | null = null;

let ro: ReturnType<typeof useResizeObserver> | null = null;

let lastScrollWidth = -1;
let lastScrollHeight = -1;

/**
 * 根据容器滚动信息初始化滚动条样式
 */
const updateScrollbar = () => {
  if (!scrollTargetEl) {
    return;
  }
  const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = scrollTargetEl;

  lastScrollWidth = scrollWidth;
  lastScrollHeight = scrollHeight;

  hThumbRate.value = clientWidth / scrollWidth;
  vThumbRate.value = clientHeight / scrollHeight;
  hOffsetRate.value = scrollLeft / scrollWidth;
  vOffsetRate.value = scrollTop / scrollHeight;

  if (!props.disabledX) {
    hasX.value = clientWidth < scrollWidth;
  }
  if (!props.disabledY) {
    hasY.value = clientHeight < scrollHeight;
  }
};
/**
 * 根据滚动容器滚动高度变化，刷新滚动条
 */
const updateScrollbarByScollSize = () => {
  if (!scrollTargetEl) {
    return;
  }
  // 如果滚动宽度或高度有变化，则重新计算滚动条样式
  const { scrollWidth, scrollHeight } = scrollTargetEl;
  if (lastScrollWidth !== scrollWidth || lastScrollHeight !== scrollHeight) {
    updateScrollbar();
  }
};

/**
 * 容器滚动事件响应函数
 */
const onScroll = () => {
  if (!scrollTargetEl) {
    return;
  }

  const { scrollLeft, scrollWidth, scrollTop, scrollHeight } = scrollTargetEl;

  // 如果滚动宽度或高度有变化，则重新计算滚动条样式
  if (lastScrollWidth !== scrollWidth || lastScrollHeight !== scrollHeight) {
    updateScrollbar();
  }

  hOffsetRate.value = scrollLeft / scrollWidth;
  vOffsetRate.value = scrollTop / scrollHeight;

  if (lastLeft >= 0) {
    showXBar.value = scrollLeft !== lastLeft;
    if (xTimer) {
      clearTimeout(xTimer);
    }
    xTimer = window.setTimeout(() => {
      showXBar.value = false;
      xTimer = null;
    }, props.duration);
  }
  lastLeft = scrollLeft;

  if (lastTop >= 0) {
    showYBar.value = scrollTop !== lastTop;
    if (yTimer) {
      clearTimeout(yTimer);
      yTimer = null;
    }
    yTimer = window.setTimeout(() => {
      showYBar.value = false;
    }, props.duration);
  }
  lastTop = scrollTop;
};

/**
 * 初始化
 */
const init = () => {
  if (!scrollTargetEl) {
    return;
  }

  scrollTargetEl.classList.add(ScrollbarClass.container);
  ro = useResizeObserver();

  // 监听滚动元素的尺寸变化，这里无法监听子元素尺寸变化引起的父容器scrollheight变化
  ro.observe(scrollTargetEl, updateScrollbar);
  // 监听scrollTargetEl的子元素，子元素的变化会导致scroll size变化
  if (scrollTargetEl.children.length === 1 && scrollTargetEl.children[0] instanceof HTMLElement) {
    ro.observe(scrollTargetEl.children[0], updateScrollbar);
  }

  updateScrollbar();

  scrollListenEl = isBody.value ? window : scrollTargetEl;
  scrollListenEl.addEventListener('scroll', onScroll, { passive: true });

  // 处理hover事件，控制显示滚动条
  handleWrapperHoverEvent();
};
/**
 * 根据滚动目标定期刷新滚动演示
 */
let updateTimer: number;
let updateIdleTimer: number;
const updateScrollbarOnIdle = () => {
  if (window.requestIdleCallback) {
    updateTimer = window.setInterval(() => {
      updateIdleTimer = window.requestIdleCallback(updateScrollbarByScollSize);
    }, 1000);
  }
};
const cancelUpdateScrollbarOnIdle = () => {
  if (updateTimer) {
    clearInterval(updateTimer);
    cancelIdleCallback && cancelIdleCallback(updateIdleTimer);
    updateTimer = 0;
    updateIdleTimer = 0;
  }
};
/**
 * 基于滚动监听元素初始化
 */
const { target } = toRefs(props);
resolveHtmlElement(target).then((el) => {
  if (el === document.body) {
    isBody.value = true;
    scrollTargetEl = document.documentElement;
  } else if (el) {
    scrollTargetEl = el;
  }
  if (!scrollTargetEl) {
    return;
  }

  init();
});

/**********
 * 处理滚动条显示
 * 如果showType=hover，则在hoverout时会刷新滚动条样式
 */
const isShowScrollbar = ref(props.showType === 'always');

watchEffect(() => {
  isShowScrollbar.value = props.showType === 'always';
  // 可以考虑是否在滚动条显示时就定时刷新
  if (props.showType === 'always') {
    if (props.autoUpdateOnScrollSize) {
      updateScrollbarOnIdle();
    }
  } else {
    cancelUpdateScrollbarOnIdle();
  }
});

let wrapperEl: HTMLElement | null = null;

const onWrapperHoverIn = () => {
  isShowScrollbar.value = true;
};

const onWrapperHoverOut = () => {
  isShowScrollbar.value = false;

  // 如果容器滚动高度有变化，则刷新滚动条
  if (scrollTargetEl) {
    const { scrollWidth, scrollHeight } = scrollTargetEl;

    // 如果滚动宽度或高度有变化，则重新计算滚动条样式
    if (lastScrollWidth !== scrollWidth || lastScrollHeight !== scrollHeight) {
      updateScrollbar();
    }
  }
};

const removeWrapperHoverEvent = () => {
  if (wrapperEl) {
    wrapperEl.removeEventListener('mouseenter', onWrapperHoverIn);
    wrapperEl.removeEventListener('mouseleave', onWrapperHoverOut);
  }
};
const handleWrapperHoverEvent = () => {
  watchEffect(() => {
    const isHoverShow = props.showType === 'hover' && !isPhonePad.value;
    wrapperEl = rootRef.value?.offsetParent as HTMLElement;
    if (!wrapperEl) {
      return;
    }
    if (isHoverShow) {
      wrapperEl?.addEventListener('mouseenter', onWrapperHoverIn);
      wrapperEl?.addEventListener('mouseleave', onWrapperHoverOut);
    } else {
      removeWrapperHoverEvent();
    }
  });
};
/**********/

onUnmounted(() => {
  if (scrollTargetEl) {
    ro?.unobserve(scrollTargetEl, updateScrollbar);

    scrollListenEl?.removeEventListener('scroll', onScroll);
  }

  removeWrapperHoverEvent();
  cancelUpdateScrollbarOnIdle();

  scrollTargetEl?.classList.remove(ScrollbarClass.container);
});

const onHBarScroll = (ratio: number) => {
  if (scrollTargetEl) {
    const d = ratio * scrollTargetEl.scrollWidth;
    scrollTargetEl.scrollTo({
      left: d,
    });
  }
};

const onVBarScroll = (ratio: number) => {
  if (scrollTargetEl) {
    const d = ratio * scrollTargetEl.scrollHeight;
    scrollTargetEl.scrollTo({
      top: d,
    });
  }
};

const onBarHoverIn = (d: ScrollerDirection) => {
  if (isPhonePad.value) {
    return;
  }
  if (d === 'x') {
    showXBar.value = true;
    if (xTimer) {
      clearTimeout(xTimer);
      yTimer = null;
    }
  } else if (d === 'y') {
    showYBar.value = true;
    if (yTimer) {
      clearTimeout(yTimer);
      yTimer = null;
    }
  }
};

const onBarHoverOut = (d: ScrollerDirection) => {
  if (isPhonePad.value) {
    return;
  }
  if (d === 'x') {
    xTimer = window.setTimeout(() => {
      showXBar.value = false;
    }, props.duration);
  } else if (d === 'y') {
    yTimer = window.setTimeout(() => {
      showYBar.value = false;
    }, props.duration);
  }
};

defineExpose({
  update: updateScrollbar,
});
</script>

<template>
  <div
    class="o-scrollbar"
    ref="rootRef"
    :class="[
      props.barClass,
      `o-scrollbar-${props.size}`,
      {
        'o-scrollbar-auto-show': props.showType === 'auto',
        'o-scrollbar-always-show': props.showType === 'always',
        'o-scrollbar-hover-show': props.showType === 'hover' && !isPhonePad,
        'o-scrollbar-visible': isShowScrollbar,
        'o-scrollbar-both': hasX && hasY,
        'o-scrollbar-visible-x': showXBar,
        'o-scrollbar-visible-y': showYBar,
        'o-scrollbar-to-body': isBody,
      },
    ]"
  >
    <template v-if="props.showType !== 'never'">
      <ScrollbarRail
        v-if="hasX && !props.disabledX"
        :size="props.size"
        direction="x"
        :thumb-rate="hThumbRate"
        :offset-rate="hOffsetRate"
        @scroll="onHBarScroll"
        @mouseenter="onBarHoverIn('x')"
        @mouseleave="onBarHoverOut('x')"
      >
        <template #thumb><slot name="thumb"></slot></template>
        <template #track><slot name="track"></slot></template>
      </ScrollbarRail>
      <ScrollbarRail
        v-if="hasY && !props.disabledY"
        direction="y"
        :size="props.size"
        :thumb-rate="vThumbRate"
        :offset-rate="vOffsetRate"
        @scroll="onVBarScroll"
        @mouseenter="onBarHoverIn('y')"
        @mouseleave="onBarHoverOut('y')"
      >
        <template #thumb><slot name="thumb"></slot></template>
        <template #track><slot name="track"></slot></template>
      </ScrollbarRail>
    </template>
  </div>
</template>
