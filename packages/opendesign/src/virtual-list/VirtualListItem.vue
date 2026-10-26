<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useResizeObserver, type ResizeObserverEntry } from '@vueuse/core';
import { type Layout } from './types';

/**
 * @description 虚拟列表子项组件——封装 ResizeObserver 监听，
 *              不定高模式下向父组件 emit resize 事件以触发 meta 重算；
 *              定高/按索引定高模式下 observeResize 为 false，回调触发但不 emit，
 *              同时 useResizeObserver 自动随组件卸载清理，无需手动 unobserve。
 */

const props = defineProps<{
  /** 列表项索引 */
  index: number;
  /** 项主轴尺寸（定高/按索引定高模式传入 px 值；不定高模式不传） */
  mainSize?: number;
  /** 布局方向，决定尺寸写入 width 还是 height */
  layout?: Layout;
  /** 是否向父组件 emit resize 事件（仅不定高模式为 true） */
  observeResize?: boolean;
}>();

const emits = defineEmits<{
  /**
   * @zh-CN 子项尺寸变化时触发
   * @en-US Triggered when item size changes
   * @param e 事件名，固定为 'resize'
   * @param entry ResizeObserver 入口对象
   * @param index 列表项索引
   */
  (e: 'resize', entry: ResizeObserverEntry, index: number): void;
}>();

const itemRef = ref<HTMLElement>();

/**
 * @description 子项内联样式——根据布局方向将主轴尺寸写入 width（水平）或 height（垂直）
 */
const itemStyle = computed(() => {
  if (props.mainSize == null) {
    return undefined;
  }
  const sizeProp = props.layout === 'horizontal' ? 'width' : 'height';
  return { [sizeProp]: `${props.mainSize}px` };
});

/**
 * @description 监听子项 DOM 尺寸变化；不定高模式下向父组件 emit resize 事件，
 *              定高/按索引定高模式下 observeResize 为 false，回调虽触发但不 emit。
 *              useResizeObserver 自动在组件卸载时清理，无需手动 unobserve。
 */
useResizeObserver(itemRef, (entries) => {
  if (props.observeResize && entries[0]) {
    emits('resize', entries[0], props.index);
  }
});
</script>

<template>
  <div ref="itemRef" :style="itemStyle" class="o-virtual-render-item">
    <slot></slot>
  </div>
</template>
