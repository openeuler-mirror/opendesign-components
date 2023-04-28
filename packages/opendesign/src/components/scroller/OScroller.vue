<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps, ScrollerDirection } from './types';

const props = defineProps(scrollerProps);

const containerEl = ref<HTMLElement | null>(null);
const hasV = ref(false);
const hasH = ref(false);
const hThumbRate = ref(0);
const vThumbRate = ref(0);
const hOffsetRate = ref(0);
const vOffsetRate = ref(0);

// TODO 支持绑定全局滚动
const showXBar = ref(false);
const showYBar = ref(false);
let lastTop = -1;
let lastLeft = -1;
let xTimer: number | null = null;
let yTimer: number | null = null;
const onScroll = (e: Event) => {
  const { scrollLeft, scrollWidth, scrollTop, scrollHeight } = e.target as HTMLElement;

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

onMounted(() => {
  if (!containerEl.value) {
    return;
  }
  const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = containerEl.value;

  hThumbRate.value = clientWidth / scrollWidth;
  vThumbRate.value = clientHeight / scrollHeight;
  hOffsetRate.value = scrollLeft / scrollWidth;
  vOffsetRate.value = scrollTop / scrollHeight;

  hasV.value = clientWidth < scrollWidth;
  hasH.value = clientHeight < scrollHeight;
});

const onHBarScroll = (ratio: number) => {
  if (containerEl.value) {
    const d = ratio * containerEl.value.scrollWidth;
    containerEl.value.scrollTo({
      left: d,
    });
  }
};

const onVBarScroll = (ratio: number) => {
  if (containerEl.value) {
    const d = ratio * containerEl.value.scrollHeight;
    containerEl.value.scrollTo({
      top: d,
    });
  }
};

const onBarHoverIn = (d: ScrollerDirection) => {
  if (d === 'h') {
    showXBar.value = true;
    if (xTimer) {
      clearTimeout(xTimer);
      yTimer = null;
    }
  } else if (d === 'v') {
    showYBar.value = true;
    if (yTimer) {
      clearTimeout(yTimer);
      yTimer = null;
    }
  }
};

const onBarHoverOut = (d: ScrollerDirection) => {
  if (d === 'h') {
    xTimer = window.setTimeout(() => {
      showXBar.value = false;
    }, props.duration);
  } else if (d === 'v') {
    yTimer = window.setTimeout(() => {
      showYBar.value = false;
    }, props.duration);
  }
};

const scrollerClass = computed(() => {
  const classList: Array<string | Record<string, boolean>> = [`o-scroller-${props.size}`];
  if (props.showType === 'auto') {
    classList.push('o-scroller-auto-show', {
      'o-scroller-show-x': showXBar.value,
      'o-scroller-show-y': showYBar.value,
    });
  } else if (props.showType === 'hover') {
    return classList.push('o-scroller-hover-show');
  }
  return classList;
});
</script>

<template>
  <div class="o-scroller" :class="scrollerClass">
    <div ref="containerEl" class="o-scroller-container" @scroll.passive="onScroll">
      <slot></slot>
    </div>
    <OScrollbar
      v-if="hasH"
      :size="props.size"
      direction="h"
      :thumb-rate="hThumbRate"
      :offset-rate="hOffsetRate"
      @scroll="onHBarScroll"
      @mouseenter="onBarHoverIn('h')"
      @mouseleave="onBarHoverOut('h')"
    />
    <OScrollbar
      v-if="hasV"
      direction="v"
      :size="props.size"
      :thumb-rate="vThumbRate"
      :offset-rate="vOffsetRate"
      @scroll="onVBarScroll"
      @mouseenter="onBarHoverIn('v')"
      @mouseleave="onBarHoverOut('v')"
    />
  </div>
</template>
