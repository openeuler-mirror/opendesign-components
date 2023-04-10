<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, provide } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icon';
import Gallery, { GalleryT } from './gallery';
import { carouselInjectKey } from './provide';

import { carouselProps } from './types';

const props = defineProps(carouselProps);

const emits = defineEmits<{
  (e: 'before-change', to: number, from: number): void;
  (e: 'change', to: number, from: number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const total = computed(() => containerRef.value?.children.length);

const fixIndex = (idx: number) => {
  if (!total.value) {
    return idx;
  }
  const i = idx % total.value;
  return i >= 0 ? i : i + total.value;
};

const activeIndex = ref(props.activeIndex ? fixIndex(props.activeIndex) : 0);

watch(
  () => props.activeIndex,
  (v) => {
    activeIndex.value = v ?? 0;
  }
);

const initialized = ref(false);

const slidesRef = ref<HTMLElement | null>(null);

const slideElList = computed(() => {
  const c = containerRef.value?.children;
  return c ? Array.from(c).map((el) => el as HTMLElement) : null;
});

let isChanging = false;

// gallery
let slidesInstance: GalleryT | null = null;

function afterActive(to: number, from: number) {
  const toSlideEl = (slideElList.value as HTMLElement[])[to];
  const fromSlideEl = (slideElList.value as HTMLElement[])[from];

  fromSlideEl.classList.remove('o-carousel-active');
  toSlideEl.classList.add('o-carousel-active');

  emits('change', to, from);
}
const activeSlideByIndex = (index: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const to = fixIndex(index);
    const from = activeIndex.value;

    if (isChanging || !slideElList.value || to === from) {
      return Promise.resolve(false);
    }
    isChanging = true;

    emits('before-change', to, from);
    activeIndex.value = to;

    switch (props.type) {
      case 'gallery': {
        (slidesInstance as GalleryT)?.active(to).then(() => {
          afterActive(to, from);

          isChanging = false;
          resolve(true);
        });
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
  // 停止自动播放
  stopPlay();

  return activeSlideByIndex(index).then((success) => {
    if (!success) {
      return;
    }

    // 恢复自动播放
    if (props.autoPlay) {
      startPlay();
    }
  });
};

const initSlides = () => {
  if (!slideElList.value || !containerRef.value || initialized.value) {
    return;
  }
  switch (props.type) {
    case 'gallery': {
      slidesInstance = new Gallery(slideElList.value, containerRef.value, activeIndex.value, {
        onTouchstart: () => {
          stopPlay();
        },
        onTouchend: () => {
          // 恢复自动播放
          if (props.autoPlay) {
            startPlay();
          }
        },
        onChanged: (to, from) => {
          activeIndex.value = to;
          afterActive(to, from);
        },
      });
      break;
    }
  }

  if (props.clickToActive) {
    slideElList.value.forEach((el, idx) => {
      el.addEventListener('click', () => {
        if (idx !== activeIndex.value) {
          activeSlide(idx);
        }
      });
    });
  }

  slideElList.value[activeIndex.value].classList.add('o-carousel-active');

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
const init = () => {
  initSlides();
  if (props.autoPlay) {
    startPlay();
  }
};
onMounted(() => {
  if (!props.manualInit) {
    init();
  }
});
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
provide(carouselInjectKey, {
  type: props.type,
});

defineExpose({
  init: init,
  play: startPlay,
  stop: startPlay,
  active: activeSlide,
});
</script>
<template>
  <div
    ref="slidesRef"
    class="o-carousel"
    :class="[
      {
        'o-carousel-visible': initialized,
        'o-carousel-click-active': props.clickToActive,
      },
      `o-carousel-type-${props.type}`,
    ]"
    :style="{
      '--carousel-interval': props.interval + 'ms',
    }"
  >
    <div class="o-carousel-wrap">
      <div ref="containerRef" class="o-carousel-container" :class="[`o-carousel-container-${props.type}`]">
        <slot></slot>
      </div>
    </div>
    <div v-if="!props.hideIndicator" class="o-carousel-indicator-wrap" :class="props.indicatorWrapClass">
      <div v-for="(item, idx) in total" :key="item" class="o-carousel-indicator-item" @click="props.indicatorClick && activeSlide(idx)">
        <slot name="indicator" :active="item - 1 === activeIndex">
          <div
            class="o-carousel-indicator-bar"
            :class="{
              'o-carousel-indicator-bar-active': item - 1 === activeIndex,
              'is-autoplay': props.autoPlay,
            }"
          ></div>
        </slot>
      </div>
    </div>
    <div v-if="!props.hideArrow" class="o-carousel-arrow-wrap" :class="props.arrowWrapClass">
      <div @click="activeSlide(activeIndex - 1)">
        <slot name="arrow-prev">
          <div class="o-carousel-arrow-prev">
            <div class="o-carousel-arrow-icon">
              <slot name="arrow-prev-icon">
                <IconChevronLeft />
              </slot>
            </div>
          </div>
        </slot>
      </div>
      <div @click="activeSlide(activeIndex + 1)">
        <slot name="arrow-next">
          <div class="o-carousel-arrow-next">
            <div class="o-carousel-arrow-icon">
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
