<script setup lang="ts">
import { computed, ref } from 'vue';
import { getRoundClass } from '../_utils/style-class';
import { tagProps } from './types';
import { IconClose } from '../_utils/icons';
import { isFunction } from '../_utils/is';

const props = defineProps(tagProps);

const emits = defineEmits<{
  /**
   * @zh-CN 标签可见性变化时触发
   * @en-US Triggered when the tag visibility changes
   */
  (e: 'update:visible', val: boolean): void;
  /**
   * @zh-CN 标签关闭时触发
   * @en-US Triggered when the tag is closed
   */
  (e: 'close', ev: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tag');

const innerIsVisible = ref(props.visible ?? props.defaultVisible);
const isVisible = computed(() => props.visible ?? innerIsVisible.value);

const onClose = async (ev: MouseEvent) => {
  ev.stopPropagation();
  if (isFunction(props.beforeClose)) {
    const rlt = await props.beforeClose();
    if (rlt) {
      innerIsVisible.value = false;
      emits('update:visible', innerIsVisible.value);
      emits('close', ev);
      return;
    }
  }

  innerIsVisible.value = false;
  emits('update:visible', innerIsVisible.value);
  emits('close', ev);
};
</script>

<template>
  <span
    v-if="isVisible"
    class="o-tag"
    :class="[
      `o-tag-${props.variant}`,
      `o-tag-${props.color}`,
      `o-tag-${props.size}`,
      round.class.value,
      { 'o-tag-closable': props.closable, 'o-tag-interactive': props.interactive || props.closable },
    ]"
    :style="round.style.value"
  >
    <span v-if="$slots.icon" class="o-tag-icon">
      <slot name="icon"></slot>
    </span>
    <span class="o-tag-label">
      <slot></slot>
    </span>
    <span v-if="props.closable" class="o-tag-close" @click="onClose">
      <IconClose />
    </span>
  </span>
</template>
