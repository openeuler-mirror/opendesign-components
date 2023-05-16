<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted, toRefs } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps, ScrollerDirection } from './types';
import { useResizeObserver } from '../hooks';
import { getHtmlElement } from '../_shared/vue-utils';

const ScrollerClass = {
  BODY: 'o-hide-scrollbar',
};
const props = defineProps(scrollerProps);

const containerEl = ref<HTMLElement | null>(null);
const hasY = ref(false);
const hasX = ref(false);
const hThumbRate = ref(0);
const vThumbRate = ref(0);
const hOffsetRate = ref(0);
const vOffsetRate = ref(0);
let wrapperEl: HTMLElement | null = null;
let ro: ReturnType<typeof useResizeObserver> | null = null;
const isBody = ref(false);

const showXBar = ref(false);
const showYBar = ref(false);
let lastTop = -1;
let lastLeft = -1;
let xTimer: number | null = null;
let yTimer: number | null = null;

const onScroll = () => {
  if (!wrapperEl) {
    return;
  }

  const { scrollLeft, scrollWidth, scrollTop, scrollHeight } = wrapperEl;

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

const initVars = () => {
  if (!wrapperEl) {
    return;
  }
  const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = wrapperEl;

  hThumbRate.value = clientWidth / scrollWidth;
  vThumbRate.value = clientHeight / scrollHeight;
  hOffsetRate.value = scrollLeft / scrollWidth;
  vOffsetRate.value = scrollTop / scrollHeight;

  hasX.value = clientWidth < scrollWidth;
  hasY.value = clientHeight < scrollHeight;
};
const init = () => {
  if (!wrapperEl) {
    return;
  }

  initVars();

  ro?.observe(wrapperEl, initVars);
  const listenEl = isBody.value ? window : wrapperEl;
  listenEl.addEventListener('scroll', onScroll, { passive: true });
};

onMounted(() => {
  ro = useResizeObserver();

  if (containerEl.value) {
    wrapperEl = containerEl.value;
    init();
  } else {
    const { target } = toRefs(props);
    getHtmlElement(target).then((el) => {
      if (el === document.body) {
        isBody.value = true;
        wrapperEl = document.documentElement;
        document.body.classList.add(ScrollerClass.BODY);
      } else if (el) {
        wrapperEl = el;
      }

      init();
    });
  }
});
onUnmounted(() => {
  if (wrapperEl) {
    ro?.unobserve(wrapperEl, initVars);

    const listenEl = isBody.value ? window : wrapperEl;
    listenEl.removeEventListener('scroll', onScroll);
  }
});

const onHBarScroll = (ratio: number) => {
  if (wrapperEl) {
    const d = ratio * wrapperEl.scrollWidth;
    wrapperEl.scrollTo({
      left: d,
    });
  }
};

const onVBarScroll = (ratio: number) => {
  if (wrapperEl) {
    const d = ratio * wrapperEl.scrollHeight;
    wrapperEl.scrollTo({
      top: d,
    });
  }
};

const onBarHoverIn = (d: ScrollerDirection) => {
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

const scrollerClass = computed(() => {
  const classList: Array<string | Record<string, boolean>> = [`o-scroller-${props.size}`];
  if (props.showType === 'auto') {
    classList.push('o-scroller-auto-show', {
      'o-scroller-show-x': showXBar.value,
      'o-scroller-show-y': showYBar.value,
    });
  } else if (props.showType === 'hover') {
    classList.push('o-scroller-hover-show');
  }

  if (hasX.value && hasY.value) {
    classList.push('o-scroller-both');
  }
  if (isBody.value) {
    classList.push('o-scroller-to-body');
  }
  return classList;
});
</script>

<template>
  <div class="o-scroller" :class="scrollerClass">
    <div v-if="$slots.default" ref="containerEl" class="o-scroller-container">
      <slot></slot>
    </div>
    <OScrollbar
      v-if="hasX && !props.disabledX"
      :size="props.size"
      direction="x"
      :thumb-rate="hThumbRate"
      :offset-rate="hOffsetRate"
      @scroll="onHBarScroll"
      @mouseenter="onBarHoverIn('x')"
      @mouseleave="onBarHoverOut('x')"
    />
    <OScrollbar
      v-if="hasY && !props.disabledY"
      direction="y"
      :size="props.size"
      :thumb-rate="vThumbRate"
      :offset-rate="vOffsetRate"
      @scroll="onVBarScroll"
      @mouseenter="onBarHoverIn('y')"
      @mouseleave="onBarHoverOut('y')"
    />
  </div>
</template>
