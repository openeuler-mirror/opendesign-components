<script lang="ts" setup>
import { computed, inject, provide } from 'vue';
import { subMenuProps } from './types';
import { IconChevronRight } from '../icons';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_shared/is';

const props = defineProps(subMenuProps);

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

const isExpanded = computed(() => {
  if (isUndefined(props.value)) {
    return false;
  }

  if (menuInjection) {
    return menuInjection.realExpanded.value.includes(props.value);
  }

  return false;
});

const isActive = computed(() => {
  if (menuInjection) {
    return menuInjection.activeNodes.value.includes(props.value);
  }

  return false;
});

const onSubItemClick = (ev: Event) => {
  ev.stopPropagation();

  if (isUndefined(props.value)) {
    return;
  }

  let set = menuInjection ? new Set([...menuInjection.realExpanded.value]) : new Set([]);

  if (isExpanded.value && set.has(props.value)) {
    set.delete(props.value);
  }

  if (!isExpanded.value && !set.has(props.value)) {
    if (menuInjection?.accordion.value) {
      const siblings = menuInjection?.menuTree.getSiblings(props.value) || [];
      siblings.forEach((val) => {
        set.delete(val as string);
      });
    }
    set.add(props.value);
  }

  const expandedVal = Array.from(set);

  menuInjection?.updateExpanded(expandedVal);
};

const depth = subMenuInjection ? subMenuInjection.depth + 1 : 1;

const paddingLeft = computed(() => `${(menuInjection?.levelIndent.value ?? 24) * depth}px`);

provide(subMenuInjectKey, { value: props.value, depth });

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});

// 过渡动画
const onBeforeEnter = (el: HTMLUListElement) => {
  el.style.height = '0px';
};
const onEnter = (el: HTMLUListElement) => {
  el.style.height = `${el.scrollHeight}px`;
};
const onAfterEnter = (el: HTMLUListElement) => {
  el.style.height = 'auto';
};
const onBeforeLeave = (el: HTMLUListElement) => {
  el.style.height = `${el.offsetHeight}px`;
};
const onLeave = (el: HTMLUListElement) => {
  el.style.height = '0px';
};
</script>

<template>
  <li class="o-sub-menu" :class="{ 'o-sub-menu-active': isActive, 'o-sub-menu-expanded': isExpanded }" @click="onSubItemClick">
    <div class="o-sub-menu-title" :style="{ 'padding-left': paddingLeft }">
      <span v-if="$slots.icon" class="o-sub-menu-title-icon">
        <slot name="icon"></slot>
      </span>
      <span class="o-sub-menu-title-content">
        <slot name="title"></slot>
      </span>
      <span class="o-sub-menu-title-arrow">
        <IconChevronRight />
      </span>
    </div>
    <transition
      name="sub-menu-children"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <ul v-show="isExpanded" class="o-sub-menu-children">
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>
