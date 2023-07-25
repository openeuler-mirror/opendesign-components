<script lang="ts" setup>
import { computed, inject, provide } from 'vue';
import { subMenuProps } from './types';
import { IconChevronRight } from '../_utils/icons';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';

const props = defineProps(subMenuProps);

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

// 是否展开
const isExpanded = computed(() => {
  if (isUndefined(props.value)) {
    return false;
  }

  if (menuInjection) {
    return menuInjection.realExpanded.value.includes(props.value);
  }

  return false;
});

// 是否关联选中
const isAssociatedSelected = computed(() => {
  if (menuInjection) {
    return menuInjection.activeNodes.value.includes(props.value);
  }

  return false;
});

// 是否选中
const isSelected = computed(() => {
  if (menuInjection) {
    return menuInjection.realValue.value === props.value;
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

  if (props.selectable) {
    menuInjection?.updateModelValue(props.value);
  }
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
  <li
    class="o-sub-menu"
    :class="{ 'o-sub-menu-selected': isSelected, 'o-sub-menu-associated-selected': isAssociatedSelected, 'o-sub-menu-expanded': isExpanded }"
    @click="onSubItemClick"
  >
    <div class="o-sub-menu-title" :style="style">
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
    <Transition @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave">
      <ul v-show="isExpanded" class="o-sub-menu-children">
        <slot></slot>
      </ul>
    </Transition>
  </li>
</template>
