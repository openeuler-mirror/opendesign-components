<script lang="ts" setup>
import { computed, inject, provide, ref } from 'vue';
import { subMenuProps } from './types';
import { IconChevronDown } from '../_utils/icons';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { isOverflown } from '../_utils/dom.ts';

const props = defineProps(subMenuProps);

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

const { size = ref('medium'), showTooltip, hideTooltip } = menuInjection || {};

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

provide(subMenuInjectKey, {
  value: props.value,
  depth,
});

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});

// 过渡动画
const onBeforeEnter = (el: Element) => {
  (el as HTMLUListElement).style.height = '0px';
};
const onEnter = (el: Element) => {
  (el as HTMLUListElement).style.height = `${el.scrollHeight}px`;
};
// 进入动画完成后高度设置为auto，支持嵌套子菜单展开
const onAfterEnter = (el: Element) => {
  (el as HTMLUListElement).style.height = 'auto';
};
const onBeforeLeave = (el: Element) => {
  (el as HTMLUListElement).style.height = `${(el as HTMLUListElement).offsetHeight}px`;
};
const onLeave = (el: Element) => {
  (el as HTMLUListElement).style.height = '0px';
};


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
  <li class="o-sub-menu"
    :class="{ 'o-sub-menu-selected': isSelected, 'o-sub-menu-associated-selected': isAssociatedSelected, 'o-sub-menu-expanded': isExpanded }"
    :style="{ '--sub-menu-level': depth }" @click="onSubItemClick">
    <div class="o-sub-menu-title" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
      <template v-if="size === 'small'">
        <span class="o-sub-menu-title-arrow o-sub-menu-title-icon">
          <IconChevronDown />
        </span>
        <span ref="itemContentRef" class="o-sub-menu-title-content">
          <slot name="title"></slot>
        </span>
      </template>
      <template v-else>
        <span v-if="$slots.icon" class="o-sub-menu-title-icon">
          <slot name="icon"></slot>
        </span>
        <span ref="itemContentRef" class="o-sub-menu-title-content">
          <slot name="title"></slot>
        </span>
        <span class="o-sub-menu-title-arrow">
          <IconChevronDown />
        </span>
      </template>
    </div>
    <Transition @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave"
      @leave="onLeave">
      <ul v-show="isExpanded" class="o-sub-menu-children">
        <slot></slot>
      </ul>
    </Transition>
  </li>
</template>
