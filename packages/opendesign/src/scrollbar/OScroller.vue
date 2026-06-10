<script lang="ts" setup>
import { ref, Ref } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps } from './types';
import { mergeClass } from '../_utils/vue-utils';

const props = defineProps(scrollerProps);
const emits = defineEmits<{
  /**
   * @zh-CN 滚动事件
   * @en-US Scroll event
   * @since 1.2.0
   */
  (e: 'scroll', event: Event): void;
}>();
const targetRef: Ref<HTMLElement | null> = ref(null);

/**
 * 滚动至指定位置
 */
const scrollTo = (options?: ScrollToOptions | undefined) => {
  if (!targetRef.value) {
    return;
  }
  targetRef.value.scrollTo(options);
};

/**
 * 按偏移量滚动
 * @since 1.2.4
 */
const scrollBy = (options?: ScrollToOptions | undefined) => {
  if (!targetRef.value) {
    return;
  }
  targetRef.value.scrollBy(options);
};

defineExpose({
  scrollTo,
  /**
   * 按偏移量滚动
   * @since 1.2.4
   */
  scrollBy: scrollBy,
  /**
   * 获取容器DOM元素
   */
  getContainerEl() {
    return targetRef.value;
  },
});
</script>

<template>
  <div class="o-scroller o-scrollbar-wrapper">
    <div
      ref="targetRef"
      :class="
        mergeClass(
          'o-scroller-container',
          {
            'is-x-disabled': props.disabledX,
            'is-y-disabled': props.disabledY,
          },
          props.wrapClass,
        )
      "
      @scroll.passive="(e) => emits('scroll', e)"
    >
      <slot></slot>
    </div>
    <OScrollbar
      :target="targetRef"
      :disabled-x="props.disabledX"
      :disabled-y="props.disabledY"
      :duration="props.duration"
      :show-type="props.showType"
      :size="props.size"
      :bar-class="props.barClass"
      :auto-update-on-scroll-size="props.autoUpdateOnScrollSize"
    >
      <template #thumb>
        <slot name="thumb"></slot>
      </template>
      <template #track>
        <slot name="track"></slot>
      </template>
    </OScrollbar>
  </div>
</template>
