<script setup lang="ts">
import { provide, ref, computed, onMounted, onUnmounted, reactive, Reactive, nextTick } from 'vue';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { OResizeObserver } from '../resize-observer';
import { debounce } from '../_utils/helper';
import { stepInjectKey } from './provide';
import { stepProps } from './types';

const props = defineProps(stepProps);

/**
 * resize 监听器实例（惰性创建）
 *
 * @description SSR 阶段不执行 onMounted，不会触达监听器；
 * 延迟到首次真正 observe 时创建，避免服务端渲染时访问不存在的 ResizeObserver 全局变量
 */
let ro: ReturnType<typeof useResizeObserver> | null = null;

/**
 * @description 获取 resize 监听器实例，不存在时创建
 * @returns resize 监听器实例
 */
const getResizeObserver = (): ReturnType<typeof useResizeObserver> => {
  if (!ro) {
    ro = useResizeObserver();
  }
  return ro;
};

const stepItemHeadRefs = ref<Array<HTMLDivElement>>([]);

const stepItemBoundingArr = reactive<Array<DOMRect>>([]);

const stepItemDividerRects = computed(() => {
  return stepItemBoundingArr?.map(({ left, top, width, height }, i) => {
    const prev = stepItemBoundingArr[i - 1];
    if (!prev) {
      return;
    }
    if (props.direction === 'h') {
      return {
        '--o-step-item-left': `calc(${prev.right! - left}px + var(--step-item-line-gap))`,
        '--o-step-item-right': 'calc(var(--step-item-line-gap) + 100%)',
        '--o-step-item-top': `calc(${height}px / 2)`,
        '--o-step-item-bottom': '',
      };
    }
    return {
      '--o-step-item-left': `calc(${width}px / 2)`,
      '--o-step-item-top': `calc(${prev.bottom! - top}px + var(--step-item-line-gap)`,
      '--o-step-item-bottom': 'calc(var(--step-item-line-gap) + 100%)',
      '--o-step-item-right': '',
    };
  });
});

provide(stepInjectKey, { props, stepItemHeadRefs, stepItemDividerRects });

const collectRects = (target: Reactive<Array<DOMRect>>, rects: DOMRect, idx: number) => {
  target[idx] = rects;
};

const handleResize = (en: ResizeObserverEntry) => {
  const rect = en.target.getBoundingClientRect();
  const idx = stepItemHeadRefs.value.findIndex((item) => item === en.target);
  if (idx !== -1) {
    collectRects(stepItemBoundingArr, rect, idx);
  }
};

const observeAllItems = (): void => {
  stepItemHeadRefs.value.forEach((element) => {
    getResizeObserver().observe(element, handleResize);
  });
};

const unobserveAllItems = (): void => {
  stepItemHeadRefs.value.forEach((element) => {
    ro?.unobserve(element, handleResize);
  });
};

const update = () => {
  stepItemHeadRefs.value.forEach((item, idx) => {
    collectRects(stepItemBoundingArr, item.getBoundingClientRect(), idx);
  });
};

const onStepResize = debounce(update, 0, false);

onMounted(async () => {
  await nextTick();
  observeAllItems();
});

onUnmounted(() => {
  unobserveAllItems();
});
</script>

<template>
  <OResizeObserver @resize="onStepResize">
    <div class="o-step" v-bind="$attrs" :class="[`o-step-${props.direction}`]">
      <slot></slot>
    </div>
  </OResizeObserver>
</template>
