<script lang="ts" setup>
import { ref, Ref } from 'vue';
import OScrollbar from './OScrollbar.vue';
import { scrollerProps, ScrollbarSlotProps } from './types';
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
defineSlots<{
  /**
   * @zh-CN 默认插槽，滚动区域内容
   * @en-US Default slot, scroll area content
   */
  default?(): any;
  /**
   * @zh-CN 滑块插槽，接收滚动方向与拖拽状态
   * @en-US Thumb slot, receives direction and dragging state
   */
  thumb?(props: ScrollbarSlotProps): any;
  /**
   * @zh-CN 轨道插槽，接收滚动方向与拖拽状态
   * @en-US Track slot, receives direction and dragging state
   */
  track?(props: ScrollbarSlotProps): any;
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
      <template #thumb="slotProps">
        <slot name="thumb" v-bind="slotProps"></slot>
      </template>
      <template #track="slotProps">
        <slot name="track" v-bind="slotProps"></slot>
      </template>
    </OScrollbar>
  </div>
</template>
