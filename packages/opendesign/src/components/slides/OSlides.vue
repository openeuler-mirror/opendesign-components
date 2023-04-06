<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, provide } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icons';
// import { getCssVariable } from '../_shared/dom';
import GallerySlides, { GallerySlidesT } from './gallery';
import { slidesInjectKey } from './provide';

import { slidesProps } from './types';

const props = defineProps(slidesProps);

const emits = defineEmits<{
  (e: 'before-change', to: number, from: number): void;
  (e: 'change', to: number, from: number): void;
}>();

const slideWrapRef = ref<HTMLElement | null>(null);
const total = computed(() => slideWrapRef.value?.children.length);

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
  const c = slideWrapRef.value?.children;
  return c ? Array.from(c).map((el) => el as HTMLElement) : null;
});

let isChanging = false;

// gallery
let slidesInstance: GallerySlidesT | null = null;

function afterActive(to: number, from: number) {
  const toSlideEl = (slideElList.value as HTMLElement[])[to];
  const fromSlideEl = (slideElList.value as HTMLElement[])[from];

  fromSlideEl.classList.remove('o-slide-active');
  toSlideEl.classList.add('o-slide-active');

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
        (slidesInstance as GallerySlidesT)?.active(to).then(() => {
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
  if (!slideElList.value || !slideWrapRef.value || initialized.value) {
    return;
  }
  switch (props.type) {
    case 'gallery': {
      slidesInstance = new GallerySlides(slideElList.value, slideWrapRef.value, activeIndex.value, {
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

  slideElList.value[activeIndex.value].classList.add('o-slide-active');

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
provide(slidesInjectKey, {
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
    class="o-slides"
    :class="[
      {
        'o-slides-visible': initialized,
        'o-slide-click-active': props.clickToActive,
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
    <div v-if="!props.hideIndicator" class="o-slides-indicator-wrap" :class="props.indicatorWrapClass">
      <div v-for="(item, idx) in total" :key="item" class="o-slides-indicator-item" @click="props.indicatorClick && activeSlide(idx)">
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
    <div v-if="!props.hideArrow" class="o-slides-arrow-wrap" :class="props.arrowWrapClass">
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
