<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';

import { menuItemProps } from './types';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { useElementOverflown } from '../hooks';
import { OPopover } from '../popover';

const props = defineProps(menuItemProps);

const emits = defineEmits<{
  (e: 'click', ev: Event): void;
}>();

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

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

// 当前节点深度
const currentDepth = subMenuInjection ? subMenuInjection.parentDepth + 1 : 0;

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});
menuInjection?.notifyTreeChange();

const menuItemRef = useTemplateRef('menuItemRef');
const itemContentRef = useTemplateRef('itemContentRef');
const isContentOverflow = useElementOverflown(itemContentRef);
</script>

<template>
  <li
    ref="menuItemRef"
    :class="{
      'o-menu-item': true,
      'o-menu-item-selected': isSelected,
      'o-menu-item-disabled': $props.disabled,
    }"
    :style="{
      '--menu-level': currentDepth,
    }"
    :data-level="currentDepth"
    @click="onItemClick"
  >
    <div v-if="props.icon || $slots.icon" class="o-menu-item-icon">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </div>
    <div ref="itemContentRef" class="o-menu-item-content">
      <slot></slot>
    </div>
    <OPopover v-if="isContentOverflow" :offset="12" :target="menuItemRef" position="bottom" wrap-class="o-menu-popover">
      <slot></slot>
    </OPopover>
  </li>
</template>
