<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watchEffect, toRefs, computed } from 'vue';
import { useEventListener, useIntervalFn, useResizeObserver, useTimeoutFn } from '@vueuse/core';
import ScrollbarRail from './ScrollbarRail.vue';
import { scrollbarProps, ScrollerDirection, ScrollbarSlotProps } from './types';
import { mergeClass, resolveHtmlElement } from '../_utils/vue-utils';
import { useScreen } from '../hooks';
import { isClient } from '../_utils/is';

const ScrollbarClass = {
  container: 'o-scrollbar-container',
};

const props = defineProps(scrollbarProps);

defineSlots<{
  /**
   * @zh-CN 滑块插槽，接收滚动方向与拖拽状态
   * @en-US Thumb slot, receives direction and dragging state
   */
  thumb?(props: ScrollbarSlotProps): any;
  /**
   * @zh-CN 轨道插槽，接收滚动方向与拖拽状态
   * @en-US Track slot, receives direction and dragging state
   */
  track?(props: ScrollbarSlotProps): any;
}>();

const { isPhonePad } = useScreen();

// 滚动目标容器
let scrollTargetEl: HTMLElement | null = null;
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
 * 滚动条自动隐藏定时器，使用 useTimeoutFn 管理横纵向两个独立定时器
 */
const xHideTimer = useTimeoutFn(
  () => {
    showXBar.value = false;
  },
  () => props.duration,
  { immediate: false },
);
const yHideTimer = useTimeoutFn(
  () => {
    showYBar.value = false;
  },
  () => props.duration,
  { immediate: false },
);

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
    xHideTimer.start();
  }
  lastLeft = scrollLeft;

  if (lastTop >= 0) {
    showYBar.value = scrollTop !== lastTop;
    yHideTimer.start();
  }
  lastTop = scrollTop;
};

let childToObserve: HTMLElement | null = null;

/**
 * init() 中创建的资源清理函数列表
 * @description useResizeObserver / useEventListener 在 onMounted 的 Promise.then 微任务中创建，
 * 此时组件 effect scope 已关闭，tryOnScopeDispose 无法注册自动清理，需在 onUnmounted 中手动调用
 */
const initCleanups: (() => void)[] = [];

/**
 * 初始化滚动条
 * @description 监听目标元素尺寸变化与滚动事件，仅在 onMounted 后调用。
 * 内部创建的 useResizeObserver / useEventListener 返回值需手动收集，因其在 Promise.then 微任务中执行
 */
const init = () => {
  if (!scrollTargetEl) {
    return;
  }

  scrollTargetEl.classList.add(ScrollbarClass.container);

  // 监听滚动容器及其子元素的尺寸变化，子元素变化会导致 scroll size 变化
  const ro1 = useResizeObserver(scrollTargetEl, updateScrollbar);
  initCleanups.push(ro1.stop);
  if (scrollTargetEl.children.length === 1 && scrollTargetEl.children[0] instanceof HTMLElement) {
    childToObserve = scrollTargetEl.children[0];
    const ro2 = useResizeObserver(childToObserve, updateScrollbar);
    initCleanups.push(ro2.stop);
  }

  updateScrollbar();

  // isBody 时监听 window 滚动，否则监听目标元素
  const stopScroll = useEventListener(isBody.value ? window : scrollTargetEl, 'scroll', onScroll, { passive: true });
  initCleanups.push(stopScroll);
};

/**
 * 定期检查滚动容器尺寸变化并刷新滚动条
 * @description 使用 useIntervalFn 管理定时器，组件卸载时自动清理。
 * 回调内通过 isClient 守卫，确保 SSR / Node.js 环境下 timer 回调不访问 window
 */
const { pause: pauseIdleUpdate, resume: resumeIdleUpdate } = useIntervalFn(
  () => {
    if (isClient && window.requestIdleCallback) {
      window.requestIdleCallback(updateScrollbarByScollSize);
    }
  },
  1000,
  { immediate: false },
);

/**
 * 解析 target prop 并初始化滚动条
 * @description 在 onMounted 中执行，避免 SSR 期间访问 document
 */
const { target } = toRefs(props);
onMounted(() => {
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
});

/** ********
 * 处理滚动条显示
 * 如果showType=hover，则在hoverout时会刷新滚动条样式
 */
const isShowScrollbar = ref(props.showType === 'always');

watchEffect(() => {
  isShowScrollbar.value = props.showType === 'always';
  if (props.showType === 'always') {
    // SSR 期间不启动定时器，避免 Node.js 环境下 interval 回调访问 window 报错
    if (props.autoUpdateOnScrollSize && isClient) {
      resumeIdleUpdate();
    }
  } else {
    pauseIdleUpdate();
  }
});

/**
 * hover 显示模式下的目标元素
 * @description 仅在 showType=hover 且非触屏设备时返回 offsetParent，否则返回 null 使 useEventListener 自动跳过
 */
const hoverTarget = computed(() => {
  const isHoverShow = props.showType === 'hover' && !isPhonePad.value;
  if (!isHoverShow) {
    return null;
  }
  return rootRef.value?.offsetParent as HTMLElement | null;
});

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

// hover 事件监听，hoverTarget 为 null 时自动跳过，组件卸载时自动清理
useEventListener(hoverTarget, 'mouseenter', onWrapperHoverIn);
useEventListener(hoverTarget, 'mouseleave', onWrapperHoverOut);

onUnmounted(() => {
  initCleanups.forEach((fn) => fn());
  initCleanups.length = 0;
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
    xHideTimer.stop();
  } else if (d === 'y') {
    showYBar.value = true;
    yHideTimer.stop();
  }
};

const onBarHoverOut = (d: ScrollerDirection) => {
  if (isPhonePad.value) {
    return;
  }
  if (d === 'x') {
    xHideTimer.start();
  } else if (d === 'y') {
    yHideTimer.start();
  }
};

defineExpose({
  /**
   * @zh-CN 更新滚动条样式
   * @en-US Update scrollbar styles
   */
  update: updateScrollbar,
});
</script>

<template>
  <div
    ref="rootRef"
    class="o-scrollbar"
    :class="
      mergeClass(
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
        props.barClass,
      )
    "
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
        <template #thumb="slotProps"><slot name="thumb" v-bind="slotProps"></slot></template>
        <template #track="slotProps"><slot name="track" v-bind="slotProps"></slot></template>
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
        <template #thumb="slotProps"><slot name="thumb" v-bind="slotProps"></slot></template>
        <template #track="slotProps"><slot name="track" v-bind="slotProps"></slot></template>
      </ScrollbarRail>
    </template>
  </div>
</template>
