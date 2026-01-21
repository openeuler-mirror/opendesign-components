<script setup lang="ts">
import { computed } from 'vue';
import { vScrollbar, type BaseScrollerPropsT } from '../scrollbar';
interface OptionPropT {
  wrapClass?: string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>;
  // 是否使用scrollbar
  scrollbar?: boolean | Partial<BaseScrollerPropsT>;
}
const props = defineProps<OptionPropT>();

/**
 * 设置滚动条参数
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
  <div class="o-option-list">
    <div v-scrollbar="scrollbarProps" class="o-options-container" :class="props.wrapClass">
      <slot></slot>
    </div>
  </div>
</template>
