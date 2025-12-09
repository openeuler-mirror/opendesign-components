<script setup lang="ts">
import { computed, inject, ref, onMounted, useTemplateRef } from 'vue';
import { menuItemProps } from './types';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { isOverflown } from '../_utils/dom';
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

// 支持超出隐藏，hover时popover提示，当前不支持内容变化，动态刷新
const menuItemRef = useTemplateRef('menuItemRef');
const itemContentRef = useTemplateRef('itemContentRef');
const isContentOverflow = ref(false);
const content= ref('');

onMounted(() => {
  if (!itemContentRef.value) {
    return;
  }
  isContentOverflow.value = isOverflown(itemContentRef.value);
  content.value = itemContentRef.value?.innerText || '';
});

</script>

<template>
  <li
      :class="{
    'o-menu-item': true,
    'o-menu-item-selected': isSelected,
    'o-menu-item-disabled': $props.disabled ,
  }"
    :style="{
      '--menu-level': currentDepth,
    }"
    @click="onItemClick"
    ref="menuItemRef"
  >
    <div v-if="props.icon || $slots.icon" class="o-menu-item-icon">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </div>
    <div class="o-menu-item-content" ref="itemContentRef">
      <slot></slot>
    </div>
    <OPopover v-if="isContentOverflow" :offset="12" :target="menuItemRef" position="bottom" wrapClass="o-menu-popover">{{ content }}</OPopover>
  </li>
</template>
