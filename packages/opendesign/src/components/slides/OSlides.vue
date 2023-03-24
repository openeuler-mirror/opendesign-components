<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icons';
// import { getCssVariable } from '../_shared/dom';

import { slidesProps } from './types';

const props = defineProps(slidesProps);

const emits = defineEmits<{ (e: 'change', now: number, last: number): void }>();

const activeIndex = ref(props.activeIndex || 0);
watch(
  () => props.activeIndex,
  (v) => {
    activeIndex.value = v ?? 0;
  }
);
// enum CSS_VAR {
//   GAP_X = '--slide-gap-x',
// }
const ClassNames = {
  PREVIOUS: 'o-slide-item-last',
  NEXT: 'o-slide-item-next',
  ACTIVE: 'o-slide-item-active',
  ANIMATING: 'o-slide-item-animating',
  ACTIVE_IN: 'o-slide-item-in',
  ACTIVE_IN_REVERSE: 'o-slide-item-in-reverse',
  ACTIVE_OUT: 'o-slide-item-out',
  ACTIVE_OUT_REVERSE: 'o-slide-item-out-reverse',
};
const initialized = ref(false);

const slideWrapRef = ref<HTMLElement | null>(null);
const slidesRef = ref<HTMLElement | null>(null);

const slideElList = computed(() => {
  const c = slideWrapRef.value?.children;
  return c ? Array.from(c).map((el) => el as HTMLElement) : null;
});
const total = computed(() => {
  return slideWrapRef.value?.children.length;
});
let activeEl: Element | null = null;

const isAnimating = ref(false);

const fixIndex = (idx: number) => {
  if (!total.value) {
    return idx;
  }
  const i = idx % total.value;
  return i >= 0 ? i : i + total.value;
};

// Switch
/**
 * @param index 激活的slide索引
 * @param animate 切换是否执行过度动画
 */
const activeSwitchSlideByIndex = (index: number, animate = true, reverse = false) => {
  if (!slideElList.value || !total.value) {
    return;
  }
  let lastActiveIndex = activeIndex.value;

  activeIndex.value = index;

  let lastActiveEl = activeEl;
  activeEl = slideElList.value[activeIndex.value];

  lastActiveEl?.classList.remove(ClassNames.ACTIVE);
  activeEl.classList.add(ClassNames.ACTIVE);
  emits('change', activeIndex.value, lastActiveIndex);
  if (animate) {
    // 先移除所有过渡动画类
    lastActiveEl?.classList.remove(
      ClassNames.ACTIVE_IN,
      ClassNames.ACTIVE_IN_REVERSE,
      ClassNames.ACTIVE_OUT,
      ClassNames.ACTIVE_OUT_REVERSE,
      ClassNames.ANIMATING
    );

    activeEl?.classList.remove(ClassNames.ACTIVE_IN, ClassNames.ACTIVE_IN_REVERSE, ClassNames.ACTIVE_OUT, ClassNames.ACTIVE_OUT_REVERSE, ClassNames.ANIMATING);

    if (!reverse) {
      lastActiveEl?.classList.add(ClassNames.ACTIVE_OUT, ClassNames.ANIMATING);
      activeEl?.classList.add(ClassNames.ACTIVE_IN, ClassNames.ANIMATING);
    } else {
      lastActiveEl?.classList.add(ClassNames.ACTIVE_OUT_REVERSE, ClassNames.ANIMATING);
      activeEl?.classList.add(ClassNames.ACTIVE_IN_REVERSE, ClassNames.ANIMATING);
    }
  }
};

const ininSwitchSlides = () => {
  if (!slideElList.value) {
    return;
  }
  activeSwitchSlideByIndex(activeIndex.value, false);

  // 监听过度动画
  slideElList.value.forEach((el) => {
    el.addEventListener('animationend', () => {
      el?.classList.remove(ClassNames.ACTIVE_IN, ClassNames.ACTIVE_IN_REVERSE, ClassNames.ACTIVE_OUT, ClassNames.ACTIVE_OUT_REVERSE, ClassNames.ANIMATING);
      if (el === activeEl) {
        isAnimating.value = false;
      }
    });
    el.addEventListener('animationstart', () => {
      if (el === activeEl) {
        isAnimating.value = true;
      }
    });
  });
};
// Carousel
const activeCarouselSlideByIndex = (index: number) => {
  if (!slideElList.value || !total.value) {
    return;
  }
  // let last = activeIndex.value;
  // let next = fixIndex(index + 1);
  // const lastEl = slideElList.value[last];
  // const nextEl = slideElList.value[next];
  const nowEl = slideElList.value[index];

  activeIndex.value = index;

  // lastEl.classList.add(ClassNames.PREVIOUS);
  // nowEl.classList.add(ClassNames.ACTIVE);
  // nextEl.classList.add(ClassNames.NEXT);

  const d = nowEl.offsetLeft;
  if (slideWrapRef.value) {
    slideWrapRef.value.style.transform = `translate3d(-${d}px, 0, 0)`;
  }
};

const ininCarouselSlides = () => {
  if (!slideElList.value) {
    return;
  }

  slideElList.value.forEach((el, idx) => {
    el.addEventListener('click', () => {
      activeCarouselSlideByIndex(idx);
    });
  });

  activeCarouselSlideByIndex(activeIndex.value);
};

const initSlides = () => {
  switch (props.type) {
    case 'switch': {
      ininSwitchSlides();
      break;
    }
    case 'carousel': {
      ininCarouselSlides();
      break;
    }
  }
  initialized.value = true;
};
const activeSlideByIndex = (index: number, animate = true, reverse = false) => {
  const i = fixIndex(index);
  switch (props.type) {
    case 'switch': {
      activeSwitchSlideByIndex(i, animate, reverse);
      break;
    }
    case 'carousel': {
      activeCarouselSlideByIndex(i);
      break;
    }
  }
};

let timer: number | null = null;
const stopPlay = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};
const startPlay = () => {
  stopPlay();
  timer = window.setInterval(() => {
    activeSlideByIndex(activeIndex.value + 1);
  }, props.interval);
};

const changeActiveSlide = (index: number, animate = true, reverse = false) => {
  if (isAnimating.value) {
    return;
  }
  // 停止自动播放
  stopPlay();

  activeSlideByIndex(index, animate, reverse);
  // 恢复自动播放
  if (props.autoPlay) {
    startPlay();
  }
};

onMounted(() => {
  // if (slidesRef.value) {
  //   console.log(getCssVariable('--gap-x', slidesRef.value));
  // }

  initSlides();
  if (props.autoPlay) {
    startPlay();
  }
});
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>
<template>
  <div
    ref="slidesRef"
    class="o-slides"
    :class="{
      'o-slides-visible': initialized,
    }"
  >
    <div class="o-slides-wrap">
      <div ref="slideWrapRef" class="o-slide-container" :class="[`o-slides-type-${props.type}`]">
        <slot></slot>
      </div>
    </div>
    <div v-if="props.indicator" class="o-slides-indicator-wrap" :class="props.indicatorWrapClass">
      <div v-for="(item, idx) in total" :key="item" class="o-slides-indicator-item" @click="changeActiveSlide(idx)">
        <slot name="indicator" :active="item - 1 === activeIndex">
          <div
            class="o-slides-indicator-dot"
            :class="{
              'o-slides-indicator-dot-active': item - 1 === activeIndex,
            }"
          ></div>
        </slot>
      </div>
    </div>
    <div v-if="props.arrow" class="o-slides-arrow-wrap" :class="props.arrowWrapClass">
      <div @click="changeActiveSlide(activeIndex - 1, true, true)">
        <slot name="arrow-prev">
          <div class="o-slides-arrow-prev">
            <div class="o-slides-arrow-icon">
              <slot name="arrow-prev-icon">
                <IconChevronLeft />
              </slot>
            </div>
          </div>
        </slot>
      </div>
      <div @click="changeActiveSlide(activeIndex + 1, true, false)">
        <slot name="arrow-next">
          <div class="o-slides-arrow-next">
            <div class="o-slides-arrow-icon">
              <slot name="arrow-next-icon">
                <IconChevronRight />
              </slot>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
