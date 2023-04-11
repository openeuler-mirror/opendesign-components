<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, provide } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../icon';
import Gallery from './gallery';
import Toggle from './toggle';
import { carouselInjectKey } from './provide';

import { carouselProps } from './types';
import { EffectT } from './effect';

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
let slidesInstance: EffectT | null = null;

function afterActive(to: number, from: number) {
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
    if (slidesInstance) {
      slidesInstance.active(to).then(() => {
        afterActive(to, from);

        isChanging = false;
        resolve(true);
      });
    } else {
      resolve(false);
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

  const options = {
    onTouchstart: () => {
      stopPlay();
    },
    onTouchend: () => {
      // 恢复自动播放
      if (props.autoPlay) {
        startPlay();
      }
    },
    onChanged: (to: number, from: number) => {
      activeIndex.value = to;
      afterActive(to, from);
    },
  };

  let EffectType = null;
  switch (props.effect) {
    case 'toggle': {
      EffectType = Toggle;
      break;
    }
    case 'gallery': {
      EffectType = Gallery;
      break;
    }
  }
  if (EffectType) {
    slidesInstance = new EffectType(slideElList.value, containerRef.value, activeIndex.value, options);
  }

  if (props.clickToSwitch) {
    slideElList.value.forEach((el, idx) => {
      el.addEventListener('click', () => {
        if (idx !== activeIndex.value) {
          activeSlide(idx);
        }
      });
    });
  }

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
  effect: props.effect,
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
        'o-carousel-click-to-switch': props.clickToSwitch,
      },
      `o-carousel-effect-${props.effect}`,
    ]"
    :style="{
      '--carousel-interval': props.interval + 'ms',
    }"
  >
    <div class="o-carousel-wrap">
      <div ref="containerRef" :class="[`o-carousel-container-${props.effect}`]">
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
