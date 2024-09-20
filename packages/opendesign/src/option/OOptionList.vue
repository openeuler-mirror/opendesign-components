<script setup lang="ts">
import { computed } from 'vue';
import { vScrollbar, BaseScrollerPropsT } from '../scrollbar';
interface OptionPropT {
  wrapClass?: string | any[];
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
    };
  }
  return props.scrollbar;
});
</script>
<template>
  <div class="o-option-list">
    <div class="o-options-container" v-scrollbar="scrollbarProps" :class="props.wrapClass">
      <slot></slot>
    </div>
  </div>
</template>
