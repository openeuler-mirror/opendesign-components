<script lang="ts" setup>
import { onMounted, ref, onUnmounted, toRefs } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps, ScrollerDirection } from './types';
import { getHtmlElement } from '../_shared/vue-utils';
import { isPhonePad } from '../_shared/global';
import { OResizeObserver } from '../resize-observer';

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

  if (!props.disabledX) {
    hasX.value = clientWidth < scrollWidth;
  }
  if (!props.disabledY) {
    hasY.value = clientHeight < scrollHeight;
  }
};
const init = () => {
  if (!wrapperEl) {
    return;
  }

  initVars();

  const listenEl = isBody.value ? window : wrapperEl;
  listenEl.addEventListener('scroll', onScroll, { passive: true });
};

onMounted(() => {
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
</script>

<template>
  <div
    class="o-scroller"
    :class="[
      `o-scroller-${props.size}`,
      {
        'o-scroller-auto-show': props.showType === 'auto',
        'o-scroller-always-show': props.showType === 'always',
        'o-scroller-hover-show': props.showType === 'hover' && !isPhonePad,
        'o-scroller-both': hasX && hasY,
        'o-scroller-to-body': isBody,
        'o-scroller-show-x': showXBar,
        'o-scroller-show-y': showYBar,
      },
    ]"
  >
    <div
      v-if="$slots.default"
      ref="containerEl"
      class="o-scroller-container"
      :class="[
        {
          'is-x-disabled': props.disabledX,
          'is-y-disabled': props.disabledY,
        },
        props.wrapClass,
      ]"
    >
      <OResizeObserver @resize="initVars">
        <div></div>
        <slot></slot>
      </OResizeObserver>
    </div>
    <template v-if="props.showType !== 'never'">
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
    </template>
  </div>
</template>
