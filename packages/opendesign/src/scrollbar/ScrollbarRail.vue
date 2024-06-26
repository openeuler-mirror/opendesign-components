<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { ScrollerSizeT } from './types';
import { vOnResize } from '../directives/on-resize';

const props = withDefaults(
  defineProps<{
    /**
     * 滚动条方向 h：横向 v: 纵向
     */
    direction: 'x' | 'y';
    /**
     * 滚动bar宽度占总宽度
     */
    thumbRate?: number;
    /**
     * 滚动bar滚动位置百分比
     */
    offsetRate: number;
    /**
     * 点击track一次，滚动一屏
     */
    notStepJump?: boolean;
    /**
     * 滚动条尺寸大小
     */
    size: ScrollerSizeT;
  }>(),
  {
    direction: 'y',
    offsetRate: 0,
    size: 'medium',
  }
);

const emits = defineEmits<{
  (e: 'scroll', ratio: number): void;
}>();

const isY = computed(() => props.direction === 'y');
// 是否正在拖拽bar
const isDarggingBar = ref(false);

const barRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLElement | null>(null);

const trackLength = ref(0);

const thumbSize = computed(() => {
  if (trackLength.value && props.thumbRate) {
    return Math.round(trackLength.value * props.thumbRate);
  }
  return 0;
});
const thumbSizeStyle = computed(() => {
  return `${thumbSize.value}px`;
});

const maxOffset = computed(() => trackLength.value - thumbSize.value);

const sizeProp = computed(() => {
  return isY.value ? 'height' : 'width';
});
const offsetProp = computed(() => {
  return isY.value ? 'translateY' : 'translateX';
});

const offset = ref(0);
watch(
  () => props.offsetRate,
  (v) => {
    if (!isDarggingBar.value) {
      offset.value = Math.round(trackLength.value * v);
    }
  },
  {
    immediate: true,
  }
);

const offsetStyle = computed(() => {
  return `${offsetProp.value}(${offset.value}px)`;
});

const adjustOffset = (pos: number) => {
  if (pos < 0) {
    return 0;
  }
  if (pos > maxOffset.value) {
    return maxOffset.value;
  }
  return pos;
};

onMounted(() => {
  if (!barRef.value) {
    return;
  }
  const { offsetHeight, offsetWidth } = barRef.value;
  trackLength.value = props.direction === 'x' ? offsetWidth : offsetHeight;
});

let s = 0;
let oldOffset = 0;
const onMouseMove = (e: MouseEvent) => {
  const pos = isY.value ? e.clientY : e.clientX;
  const v = oldOffset + pos - s;

  const of = adjustOffset(v);
  if (of !== offset.value) {
    offset.value = of;
    emits('scroll', offset.value / trackLength.value);
  }
};

const onMouseUp = () => {
  isDarggingBar.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('contextmenu', onMouseUp);
};
const onThumbMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDarggingBar.value = true;
  s = isY.value ? e.clientY : e.clientX;
  oldOffset = offset.value;
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('contextmenu', onMouseUp);
};

const onTrackClick = (e: MouseEvent) => {
  e.preventDefault();
  if (!thumbRef.value || !barRef.value) {
    return;
  }
  const pos = isY.value ? e.clientY : e.clientX;
  let v = 0;
  if (props.notStepJump) {
    const bc = barRef.value.getBoundingClientRect();
    v = pos - (isY.value ? bc.top : bc.left) - thumbSize.value / 2;
  } else {
    const bc = thumbRef.value.getBoundingClientRect();
    const isPlus = pos > (isY.value ? bc.top : bc.left);

    v = offset.value + thumbSize.value * (isPlus ? 1 : -1);
  }

  const of = adjustOffset(v);
  if (of !== offset.value) {
    offset.value = of;
    emits('scroll', offset.value / trackLength.value);
  }
};

const onResize = () => {
  if (!barRef.value) {
    return;
  }
  const { offsetHeight, offsetWidth } = barRef.value;
  trackLength.value = props.direction === 'x' ? offsetWidth : offsetHeight;
};
</script>

<template>
  <div
    ref="barRef"
    v-on-resize="onResize"
    class="o-scrollbar-rail"
    :class="[
      `o-scrollbar-${props.direction}`,
      `o-scrollbar-${props.size}`,
      {
        'o-scrollbar-dragging': isDarggingBar,
      },
    ]"
    @click="onTrackClick"
  >
    <div
      ref="thumbRef"
      class="o-scrollbar-thumb"
      :class="[
        `o-scrollbar-${props.direction}-thumb`,
        {
          [`o-scrollbar-${props.direction}-thumb-dragging`]: isDarggingBar,
        },
      ]"
      :style="{
        [sizeProp]: thumbSizeStyle,
        transform: offsetStyle,
      }"
      @click.stop
      @mousedown="onThumbMouseDown"
    >
      <slot name="thumb" :direction="props.direction" :dragging="isDarggingBar">
        <div
          :class="[
            `o-scrollbar-${props.direction}-thumb-bar`,
            {
              'is-dragging': isDarggingBar,
            },
          ]"
        ></div>
      </slot>
    </div>
    <slot name="track" :direction="props.direction">
      <div class="o-scrollbar-track" :class="[`o-scrollbar-${props.direction}-track`]"></div>
    </slot>
  </div>
</template>
