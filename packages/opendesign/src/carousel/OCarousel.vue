<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, provide, Ref } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../_utils/icons';
import Gallery from './effects/gallery';
import Toggle from './effects/toggle';
import { carouselInjectKey } from './provide';

import { carouselProps } from './types';
import Effect from './effects/effect';

const props = defineProps(carouselProps);

const emits = defineEmits<{
  (e: 'before-change', to: number, from: number): void;
  (e: 'change', to: number, from: number): void;
  (e: 'update:activeIndex', value: number): void;
  (e: 'pause', value: number): void;
}>();

const containerRef: Ref<HTMLElement | null> = ref(null);
const total = computed(() => containerRef.value?.children.length);

const isAutoPlay = ref(props.autoPlay);
watch(
  () => props.autoPlay,
  (a) => {
    isAutoPlay.value = a;
  }
);

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

// gallery
let slidesInstance: InstanceType<typeof Effect> | null = null;
// 避免同一时间多次切换
let isChanging = false;

const activeSlideByIndex = (index: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const to = fixIndex(index);
    const from = activeIndex.value;

    if (isChanging || !slideElList.value) {
      resolve(false);
      return;
    }

    // fix https://gitee.com/openeuler/opendesign-components/issues/I848XL?from=project-issue
    if (to === from) {
      resolve(true);
      return;
    }

    isChanging = true;

    if (slidesInstance) {
      activeIndex.value = to;
      emits('update:activeIndex', to);
      slidesInstance.active(to).then(() => {
        isChanging = false;
        resolve(true);
      });
    } else {
      isChanging = false;
      resolve(false);
    }
  });
};

let timer: number | null = null;
const isPlaying = ref(isAutoPlay.value);

const pausePlay = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isPlaying.value = false;
    emits('pause', activeIndex.value);
  }
};

const resumePlay = () => {
  if (isAutoPlay.value) {
    setTimeout(() => {
      startPlay();
    }, 0);
  }
};
// TODO 导出增加播放进度
const startPlay = () => {
  pausePlay();
  isPlaying.value = true;
  timer = window.setInterval(() => {
    activeSlideByIndex(activeIndex.value + 1);
  }, props.interval);
};

// 激活slide
const activeSlide = (index: number, resumeAutoPlay = true) => {
  // 停止自动播放
  pausePlay();
  return activeSlideByIndex(index).then((success) => {
    if (!success) {
      return;
    }

    // 恢复自动播放
    if (!props.pauseOnHover || resumeAutoPlay) {
      resumePlay();
    }
  });
};

const initSlides = () => {
  if (!slideElList.value || !containerRef.value || initialized.value) {
    return;
  }

  const options = {
    activeClass: props.activeClass,
    onTouchstart: () => {
      pausePlay();
    },
    onTouchend: () => {
      // 恢复自动播放
      resumePlay();
    },
    onBeforeChange: (to: number, from: number) => {
      emits('before-change', to, from);
    },
    onChanged: (to: number, from: number) => {
      activeIndex.value = to;
      emits('update:activeIndex', to);
      emits('change', to, from);
    },
  };

  let EffectType = null;
  switch (props.effect) {
    case 'gallery': {
      EffectType = Gallery;
      break;
    }
    case 'toggle': {
      EffectType = Toggle;
      break;
    }
    default: {
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
      pausePlay();
    }
  }
);
const init = () => {
  initSlides();
  if (isAutoPlay.value) {
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
  slidesInstance?.destroyed();
});
provide(carouselInjectKey, {
  effect: props.effect,
});

const play = () => {
  isAutoPlay.value = true;
  startPlay();
};
const pause = () => {
  isAutoPlay.value = false;
  pausePlay();
};

const onHoverIn = () => {
  if (props.pauseOnHover) {
    pausePlay();
  }
};

const onHoverOut = () => {
  if (props.pauseOnHover) {
    resumePlay();
  }
};

defineExpose({
  init: init,
  play,
  pause,
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
        'o-carousel-hover-arrow': props.arrow === 'hover',
        'o-carousel-autoplay': isAutoPlay,
        'is-playing': isPlaying,
      },
      `o-carousel-effect-${props.effect}`,
    ]"
    :style="{
      '--carousel-interval': props.interval + 'ms',
    }"
    @mouseenter="onHoverIn"
    @mouseleave="onHoverOut"
  >
    <div class="o-carousel-wrap">
      <div ref="containerRef" :class="[`o-carousel-container-${props.effect}`]">
        <slot></slot>
      </div>
    </div>
    <div v-if="!props.hideIndicator" class="o-carousel-indicator-wrap" :class="props.indicatorWrapClass">
      <div v-for="(item, idx) in total" :key="item" class="o-carousel-indicator-item" @click="props.indicatorClick && activeSlide(idx)">
        <slot name="indicator" :active="item - 1 === activeIndex" :index="idx">
          <div
            class="o-carousel-indicator-bar"
            :class="{
              'o-carousel-indicator-bar-selected': item - 1 === activeIndex,
            }"
          >
            <div class="o-carousel-indicator-line"></div>
          </div>
        </slot>
      </div>
    </div>
    <div v-if="props.arrow !== 'never'" class="o-carousel-arrow-wrap" :class="props.arrowWrapClass">
      <div @click="activeSlide(activeIndex - 1, false)">
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
      <div @click="activeSlide(activeIndex + 1, false)">
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
