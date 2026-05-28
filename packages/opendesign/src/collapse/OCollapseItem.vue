<script setup lang="ts">
import { computed, inject } from 'vue';
import { collapseItemProps } from './types';
import { IconChevronRight } from '../_utils/icons';
import { collapseInjectKey } from './provide';
import { isUndefined } from '../_utils/is';

const props = defineProps(collapseItemProps);
const collapseInjection = inject(collapseInjectKey, null);

// 是否展开
const isExpanded = computed(() => {
  if (isUndefined(props.value)) {
    return false;
  }

  if (collapseInjection) {
    return collapseInjection.computedValue.value.includes(props.value);
  }

  return false;
});

const onClick = (evt: Event) => {
  evt.stopPropagation();

  if (isUndefined(props.value)) {
    return;
  }

  collapseInjection?.handleItemClick(props.value, evt);
};

// 过渡动画
// 使用 max-height + margin-bottom 联动，规避 height 在 auto 与具体值之间无法过渡的问题
const resetStyle = (el: HTMLElement) => {
  el.style.maxHeight = '';
  el.style.overflow = el.dataset.oldOverflow ?? '';
  el.style.marginBottom = el.dataset.oldMarginBottom ?? '';
};

const onBeforeEnter = (el: Element) => {
  const target = el as HTMLUListElement;
  target.dataset.oldOverflow = target.style.overflow;
  target.dataset.oldMarginBottom = target.style.marginBottom;
  target.style.maxHeight = '0';
  target.style.marginBottom = '0';
  target.style.overflow = 'hidden';
};
const onEnter = (el: Element) => {
  const target = el as HTMLUListElement;
  target.style.maxHeight = `${target.scrollHeight !== 0 ? target.scrollHeight : 0}px`;
  target.style.marginBottom = target.dataset.oldMarginBottom ?? '';
};
// 进入动画完成后清空 max-height，支持嵌套子菜单展开
const onAfterEnter = (el: Element) => {
  resetStyle(el as HTMLUListElement);
};
const onBeforeLeave = (el: Element) => {
  const target = el as HTMLUListElement;
  target.dataset.oldOverflow = target.style.overflow;
  target.dataset.oldMarginBottom = target.style.marginBottom;
  target.style.maxHeight = `${target.scrollHeight}px`;
  target.style.overflow = 'hidden';
};
const onLeave = (el: Element) => {
  const target = el as HTMLUListElement;
  if (target.scrollHeight !== 0) {
    target.style.maxHeight = '0';
    target.style.marginBottom = '0';
  }
};
const onAfterLeave = (el: Element) => {
  resetStyle(el as HTMLElement);
};
</script>

<template>
  <div class="o-collapse-item" :class="{ 'o-collapse-item-expanded': isExpanded }">
    <div class="o-collapse-item-header" @click="onClick">
      <span class="o-collapse-item-icon">
        <IconChevronRight />
      </span>
      <p v-if="props.title || $slots.title" class="o-collapse-item-title">
        <slot name="title">{{ props.title }}</slot>
      </p>
    </div>
    <Transition
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="isExpanded" class="o-collapse-item-body">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
