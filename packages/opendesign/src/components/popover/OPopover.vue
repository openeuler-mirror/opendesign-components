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
import { mergeClass } from '../_shared/dom';

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
    :wrap-class="mergeClass('o-popover-wrap', props.wrapClass)"
    :anchor-class="props.anchor ? mergeClass('o-popover-anchor', props.anchorClass) : ''"
    :unmount-on-hide="props.unmountOnHide"
    :auto-hide="props.autoHide"
    :disabled="props.disabled"
    :transition="props.transition"
    :adjust-width="props.adjustWidth"
    :adjust-min-width="props.adjustMinWidth"
    :hide-when-target-invisible="props.hideWhenTargetInvisible"
    :hover-delay="props.hoverDelay"
    :before-hide="props.beforeHide"
    :before-show="props.beforeShow"
    @update:visible="updateVisible"
  >
    <div class="o-popover-body" v-bind="$attrs">
      <slot></slot>
    </div>
  </OPopup>
</template>
