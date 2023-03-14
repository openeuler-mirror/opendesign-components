<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { defaultSize } from '../_shared/global';
import { getRoundClass } from '../_shared/style-class';
import { tagProps } from './types';
import { IconClose } from '../_shared/icons';
import { isUndefined } from '../_shared/is';

const props = defineProps(tagProps);

const emits = defineEmits<{
  (e: 'update:checked', val: boolean): void;
  (e: 'change', val: boolean, ev: MouseEvent): void;
  (e: 'close', ev: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tag');

// 是否可见
const isVisible = ref(true);

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (!props.checkable) {
    return false;
  }
  if (!isUndefined(props.checked)) {
    return props.checked;
  }

  return _checked.value;
});

watch(
  isChecked,
  (val) => {
    _checked.value = val;
  },
  { immediate: true }
);

const onClick = (ev: MouseEvent) => {
  if (props.checkable) {
    const checked = !isChecked.value;
    _checked.value = checked;
    emits('update:checked', checked);
    emits('change', checked, ev);
  }
};

const onClose = (ev: MouseEvent) => {
  ev.stopPropagation();
  isVisible.value = false;
  emits('close', ev);
};
</script>

<template>
  <span
    v-if="isVisible"
    class="o-tag"
    :class="[
      `o-tag-${props.color}`,
      `o-tag-${props.size || defaultSize}`,
      `o-tag-${props.variant}`,
      round.class.value,
      { 'o-tag-checkable': props.checkable },
      { 'o-tag-checked': isChecked },
    ]"
    :style="round.style.value"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="o-tag-icon prefix">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
    <span v-if="props.closable" class="o-tag-icon o-tag-icon-close suffix" @click="onClose">
      <IconClose />
    </span>
  </span>
</template>
