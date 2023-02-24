<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { ComponentPublicInstance, ref } from 'vue';
import { OPopup } from '../popup';
import { OChildOnly } from '../child-only';
import { popoverProps } from './types';

const props = defineProps(popoverProps);

const emits = defineEmits<{ (e: 'update:visible', val: boolean): void }>();
const updateVisible = (val: boolean) => {
  emits('update:visible', val);
};
const targetElRef = ref<ComponentPublicInstance | null>(null);
</script>
<template>
  <OChildOnly ref="targetElRef">
    <slot name="target"></slot>
  </OChildOnly>
  <OPopup
    class="o-popover"
    :offset="props.offset"
    :visible="props.visible"
    :position="props.position"
    :trigger="props.trigger"
    :target="props.target || targetElRef"
    :wrapper="props.wrapper"
    anchor-class="o-popover-anchor"
    :unmount-on-hide="props.unmountOnHide"
    @update:visible="updateVisible"
  >
    <div class="o-popover-wrap" v-bind="$attrs">
      <slot></slot>
    </div>
  </OPopup>
</template>
