<script setup lang="ts">
import { OScroller } from '../scrollbar';
interface OptionPropT {
  wrapClass?: string | any[];
  scroller?: boolean;
}
const props = defineProps<OptionPropT>();
</script>
<template>
  <div class="o-option-list">
    <OScroller v-if="props.scroller" size="small" show-type="always" :wrap-class="props.wrapClass" class="o-options-scroller">
      <slot></slot>
    </OScroller>
    <div v-else class="o-options-container" :class="props.wrapClass">
      <slot></slot>
    </div>
  </div>
</template>
