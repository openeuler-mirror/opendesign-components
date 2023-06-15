<script setup lang="ts">
import { computed, inject } from 'vue';
import { menuItemProps } from './types';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_shared/is';

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

const depth = subMenuInjection ? subMenuInjection.depth + 1 : 1;

const style = computed(() => {
  if (depth === 1) {
    return {};
  } else {
    return {
      paddingLeft: `${(menuInjection?.levelIndent.value ?? 20) * depth}px`,
    };
  }
});

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});
</script>

<template>
  <li class="o-menu-item" :class="{ 'o-menu-item-selected': isSelected, 'o-menu-item-disabled': $props.disabled }" :style="style" @click="onItemClick">
    <span v-if="props.icon || $slots.icon" class="o-menu-item-icon">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <span class="o-menu-item-content">
      <slot></slot>
    </span>
  </li>
</template>
