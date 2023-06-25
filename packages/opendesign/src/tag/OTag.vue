<script setup lang="ts">
import { ref, watch } from 'vue';
import { getRoundClass } from '../_utils/style-class';
import { tagProps } from './types';
import { IconClose } from '../_utils/icons';
import { isFunction, isUndefined } from '../_utils/is';

const props = defineProps(tagProps);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close', ev: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tag');

const isVisible = ref(props.visible ?? props.defaultVisible);

watch(
  () => props.visible,
  (val) => {
    if (!isUndefined(val)) {
      isVisible.value = val;
    }
  }
);

const onClose = async (ev: MouseEvent) => {
  ev.stopPropagation();
  if (isFunction(props.beforeClose)) {
    const rlt = await props.beforeClose();
    if (rlt) {
      isVisible.value = false;
      emits('update:visible', isVisible.value);
      emits('close', ev);
      return;
    }
  }

  isVisible.value = false;
  emits('update:visible', isVisible.value);
  emits('close', ev);
};
</script>

<template>
  <span
    v-if="isVisible"
    class="o-tag"
    :class="[`o-tag-${props.variant}`, `o-tag-${props.color}`, `o-tag-${props.size}`, round.class.value]"
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
