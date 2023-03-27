<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, provide } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icons';
// import { getCssVariable } from '../_shared/dom';
import GallerySlides, { GallerySlidesT } from './gallery';
import { slidesInjectKey } from './provide';

import { slidesExposeT, slidesProps } from './types';

const props = defineProps(slidesProps);

const emits = defineEmits<{
  (e: 'before-change', to: number, from: number): void;
  (e: 'change', to: number, from: number): void;
}>();

const activeIndex = ref(props.activeIndex || 0);
watch(
  () => props.activeIndex,
  (v) => {
    activeIndex.value = v ?? 0;
  }
);

const initialized = ref(false);

const slideWrapRef = ref<HTMLElement | null>(null);
const slidesRef = ref<HTMLElement | null>(null);

const slideElList = computed(() => {
  const c = slideWrapRef.value?.children;
  return c ? Array.from(c).map((el) => el as HTMLElement) : null;
});
const total = computed(() => slideWrapRef.value?.children.length);

let isChanging = false;

const fixIndex = (idx: number) => {
  if (!total.value) {
    return idx;
  }
  const i = idx % total.value;
  return i >= 0 ? i : i + total.value;
};

// gallery
let slidesInstance: GallerySlidesT | null = null;

const activeSlideByIndex = (index: number) => {
  return new Promise((resolve) => {
    const to = fixIndex(index);
    const from = activeIndex.value;
    if (to === from) {
      resolve(false);
    }

    emits('before-change', to, activeIndex.value);

    switch (props.type) {
      case 'gallery': {
        (slidesInstance as GallerySlidesT)?.active(to).then(() => {
          emits('change', to, from);
          resolve(true);
        });
        activeIndex.value = to;
        break;
      }
      default: {
        resolve(false);
      }
    }
  });
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

// 激活slide
const activeSlide = (index: number) => {
  if (isChanging) {
    return Promise.resolve();
  }
  isChanging = true;
  // 停止自动播放
  stopPlay();
  return activeSlideByIndex(index).then(() => {
    // 恢复自动播放
    if (props.autoPlay) {
      startPlay();
    }
    isChanging = false;
  });
};

const initSlides = () => {
  if (!slideElList.value || !slideWrapRef.value) {
    return;
  }
  switch (props.type) {
    case 'gallery': {
      slidesInstance = new GallerySlides(slideElList.value, slideWrapRef.value, activeIndex.value);

      break;
    }
  }
  slideElList.value.forEach((el, idx) => {
    el.addEventListener('click', () => {
      activeSlide(idx);
    });
  });
  initialized.value = true;
};

watch(
  () => props.autoPlay,
  (v) => {
    if (v) {
      startPlay();
    } else {
      stopPlay();
    }
  }
);
onMounted(() => {
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
provide(slidesInjectKey, {
  type: props.type,
});

defineExpose({
  play: startPlay,
  stop: startPlay,
  active: activeSlide,
});
</script>
<template>
  <div
    ref="slidesRef"
    class="o-slides"
    :class="[
      {
        'o-slides-visible': initialized,
      },
      `o-slides-type-${props.type}`,
    ]"
    :style="{
      '--slides-interval': props.interval + 'ms',
    }"
  >
    <div class="o-slides-wrap">
      <div ref="slideWrapRef" class="o-slide-container" :class="[`o-slide-container-${props.type}`]">
        <slot></slot>
      </div>
    </div>
    <div v-if="props.indicator" class="o-slides-indicator-wrap" :class="props.indicatorWrapClass">
      <div v-for="(item, idx) in total" :key="item" class="o-slides-indicator-item" @click="activeSlide(idx)">
        <slot name="indicator" :active="item - 1 === activeIndex">
          <div
            class="o-slides-indicator-bar"
            :class="{
              'o-slides-indicator-bar-active': item - 1 === activeIndex,
              'is-autoplay': props.autoPlay,
            }"
          ></div>
        </slot>
      </div>
    </div>
    <div v-if="props.arrow" class="o-slides-arrow-wrap" :class="props.arrowWrapClass">
      <div @click="activeSlide(activeIndex - 1)">
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
      <div @click="activeSlide(activeIndex + 1)">
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
