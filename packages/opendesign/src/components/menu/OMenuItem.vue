<script setup lang="ts">
import { computed, inject } from 'vue';
import { menuItemProps } from './types';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_shared/is';

const props = defineProps(menuItemProps);

const emits = defineEmits<{
  (e: 'click'): void;
}>();

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

const isActive = computed(() => {
  if (menuInjection) {
    return menuInjection.realValue.value === props.value;
  }
  return false;
});

const onItemClick = (ev: Event) => {
  ev.stopPropagation();

  if (props.disabled) {
    return;
  }

  if (isUndefined(props.value)) {
    return;
  }

  emits('click');

  menuInjection?.updateModelValue(props.value);
};

const depth = subMenuInjection ? subMenuInjection.depth + 1 : 1;
const paddingLeft = computed(() => `${(menuInjection?.levelIndent.value ?? 24) * depth}px`);

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});
</script>

<template>
  <li
    class="o-menu-item"
    :class="{ 'o-menu-item-active': isActive, 'o-menu-item-disabled': $props.disabled }"
    :style="{ 'padding-left': paddingLeft }"
    @click="onItemClick"
  >
    <slot></slot>
  </li>
</template>
