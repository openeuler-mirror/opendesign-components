<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { OPopup } from '../popup';
import { popoverProps } from './types';
import { mergeClass } from '../_utils/dom';

const props = defineProps(popoverProps);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
}>();
const updateVisible = (val: boolean) => {
  emits('update:visible', val);
};
</script>
<template>
  <slot name="target" v-if="props.disabled"></slot>
  <OPopup
    v-else
    class="o-popover"
    :offset="props.offset"
    :edge-offset="props.edgeOffset"
    :visible="props.visible"
    :position="props.position"
    :trigger="props.trigger"
    :target="props.target"
    :wrapper="props.wrapper"
    :wrap-class="mergeClass('o-popover-wrap', props.wrapClass)"
    :anchor-class="props.anchor ? mergeClass('o-popover-anchor', props.anchorClass) : ''"
    :unmount-on-hide="props.unmountOnHide"
    :auto-hide="props.autoHide"
    :disabled="props.disabled"
    :transition="props.transition"
    :adjust-width="props.adjustWidth"
    :adaptive="props.adaptive"
    :adjust-min-width="props.adjustMinWidth"
    :hide-when-target-invisible="props.hideWhenTargetInvisible"
    :hover-delay="props.hoverDelay"
    :before-hide="props.beforeHide"
    :before-show="props.beforeShow"
    @update:visible="updateVisible"
  >
    <div v-bind="$attrs">
      <slot></slot>
    </div>
    <template #target>
      <slot name="target"></slot>
    </template>
  </OPopup>
</template>
