<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { menuItemProps } from './types';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { isOverflown } from '../_utils/dom.ts';

const props = defineProps(menuItemProps);

const emits = defineEmits<{
  (e: 'click', ev: Event): void;
}>();

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

const { size = ref('medium'), showTooltip, hideTooltip } = menuInjection || {};

const isSelected = computed(() => {
  if (menuInjection) {
    return menuInjection.realValue.value === props.value;
  }
  return false;
});

const onItemClick = (ev: MouseEvent) => {
  ev.stopPropagation();

  if (props.disabled) {
    return;
  }

  if (isUndefined(props.value)) {
    return;
  }

  emits('click', ev);

  menuInjection?.updateModelValue(props.value);
};

const depth = subMenuInjection ? subMenuInjection.depth + 1 : 1;


const cssVars = computed(() => {
  return {
    '--menu-item-level': depth,
  };
});

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});

const itemContentRef = ref<HTMLSpanElement>();
const handleMouseenter = (e: MouseEvent) => {
  if (!e.target || !isOverflown(itemContentRef.value)) {
    return;
  }
  showTooltip?.({ el: e.target as HTMLElement, content: itemContentRef.value?.innerText });
};
const handleMouseleave = () => {
  hideTooltip?.();
};
</script>

<template>
  <li class="o-menu-item" :class="{ 'o-menu-item-selected': isSelected, 'o-menu-item-disabled': $props.disabled }"
    :style="cssVars" @click="onItemClick" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
    <span v-if="size !== 'small' && (props.icon || $slots.icon)" class="o-menu-item-icon">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <span class="o-menu-item-content" ref="itemContentRef">
      <slot></slot>
    </span>
  </li>
</template>
