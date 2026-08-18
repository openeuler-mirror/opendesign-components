<script setup lang="ts">
import { computed, ref } from 'vue';
import { OScrollbar, type BaseScrollerPropsT } from '../scrollbar';

interface OptionPropT {
  wrapClass?: string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>;
  /** 是否使用滚动条 */
  scrollbar?: boolean | Partial<BaseScrollerPropsT>;
}

const props = withDefaults(defineProps<OptionPropT>(), {
  wrapClass: undefined,
  scrollbar: true,
});

/** 滚动容器引用，供 OScrollbar 绑定 */
const containerRef = ref<HTMLElement>();

/**
 * 滚动条参数，同时作为 OScrollbar 组件的渲染条件（v-if）与 props 数据源（v-bind）
 * @description scrollbar=true 时提供默认配置；为 false 时返回 falsy 值以跳过 OScrollbar 渲染
 */
const scrollbarProps = computed(() => {
  if (props.scrollbar === true) {
    return {
      showType: 'hover',
      size: 'small',
    } as Partial<BaseScrollerPropsT>;
  }
  return props.scrollbar;
});
</script>

<template>
  <div class="o-option-list" :class="{ 'o-scrollbar-wrapper': scrollbarProps }">
    <div ref="containerRef" class="o-options-container" :class="props.wrapClass">
      <slot></slot>
    </div>
    <OScrollbar v-if="scrollbarProps" :target="containerRef" v-bind="scrollbarProps" />
  </div>
</template>
