<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, provide } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icons';

import { slidesProps } from './types';

const props = defineProps(slidesProps);

// const emits = defineEmits<{ (e: 'error'): void }>();

const activeIndex = ref(props.activeIndex || 0);
watch(
  () => props.activeIndex,
  (v) => {
    activeIndex.value = v ?? 0;
  }
);

enum ClassNames {
  ACTIVE = 'o-slide-item-active',
  ACTIVE_IN = 'o-slide-item-in',
  ACTIVE_IN_REVERSE = 'o-slide-item-in-reverse',
  ACTIVE_OUT = 'o-slide-item-out',
  ACTIVE_OUT_REVERSE = 'o-slide-item-out-reverse',
}
const initialized = ref(false);

const slidesRef = ref<HTMLElement | null>(null);
const slideElList = computed(() => {
  return slidesRef.value?.children;
});
const total = computed(() => {
  return slidesRef.value?.children.length;
});
let activeEl: Element | null = null;

const isAnimating = ref(false);
const onTransitionStart = () => {
  console.log('onTransitionStart');

  isAnimating.value = true;
};
const onTransitionEnd = () => {
  console.log('onTransitionEnd');
  isAnimating.value = false;
};
/**
 * @param index 激活的slide索引
 * @param animate 切换是否执行过度动画
 */
const activeSlideByIndex = (index: number, animate = true, reverse = false) => {
  if (!slideElList.value || !total.value) {
    return;
  }
  let lastIndex = activeIndex.value;

  const i = index % total.value;
  activeIndex.value = i >= 0 ? i : i + total.value;

  console.log(lastIndex, activeIndex.value);

  let lastActiveEl = activeEl;
  activeEl = slideElList.value[activeIndex.value];

  lastActiveEl?.classList.remove(ClassNames.ACTIVE);
  activeEl.classList.add(ClassNames.ACTIVE);

  if (animate) {
    // 先移除所有过渡动画类
    lastActiveEl?.classList.remove(ClassNames.ACTIVE_IN, ClassNames.ACTIVE_IN_REVERSE, ClassNames.ACTIVE_OUT, ClassNames.ACTIVE_OUT_REVERSE);

    activeEl?.classList.remove(ClassNames.ACTIVE_IN, ClassNames.ACTIVE_IN_REVERSE, ClassNames.ACTIVE_OUT, ClassNames.ACTIVE_OUT_REVERSE);

    if (!reverse) {
      lastActiveEl?.classList.add(ClassNames.ACTIVE_OUT);
      activeEl?.classList.add(ClassNames.ACTIVE_IN);
    } else {
      lastActiveEl?.classList.add(ClassNames.ACTIVE_OUT_REVERSE);
      activeEl?.classList.add(ClassNames.ACTIVE_IN_REVERSE);
    }
  }
};

const changeActiveSlide = (add: number) => {
  if (isAnimating.value) {
    return;
  }
  activeSlideByIndex(activeIndex.value + add, true, add < 0);
};

const initSlides = () => {
  if (!slideElList.value) {
    return;
  }
  activeSlideByIndex(activeIndex.value, false);
  initialized.value = true;

  // 监听过度动画
  Array.from(slideElList.value).forEach((el) => {
    el.addEventListener('animationend', () => {
      el?.classList.remove(ClassNames.ACTIVE_IN, ClassNames.ACTIVE_IN_REVERSE, ClassNames.ACTIVE_OUT, ClassNames.ACTIVE_OUT_REVERSE);
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

onMounted(() => {
  initSlides();
});
</script>
<template>
  <div class="o-slides">
    <div v-show="initialized" ref="slidesRef" class="o-slides-wrap">
      <slot></slot>
    </div>
    <div v-show="initialized" class="o-slides-indicator-wrap">
      <div v-for="item in total" :key="item" class="o-slides-indicator-item">
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
    <div v-show="initialized" class="o-slides-arrow-wrap">
      <div class="o-slides-arrow-prev" @click="changeActiveSlide(-1)">
        <slot name="arrow-prev">
          <div class="o-slides-arrow-icon">
            <slot name="arrow-prev-icon">
              <IconChevronLeft />
            </slot>
          </div>
        </slot>
      </div>
      <div class="o-slides-arrow-next" @click="changeActiveSlide(1)">
        <slot name="arrow-next">
          <div class="o-slides-arrow-icon">
            <slot name="arrow-next-icon">
              <IconChevronRight />
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
