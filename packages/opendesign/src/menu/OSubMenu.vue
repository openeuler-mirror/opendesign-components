<script lang="ts" setup>
import { computed, inject, onMounted, provide, ref } from 'vue';
import { subMenuProps } from './types';
import { IconChevronDownBold } from '../_utils/icons';
import { menuInjectKey, subMenuInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { isOverflown } from '../_utils/dom.ts';
import { OPopover } from '../popover';

const props = defineProps(subMenuProps);

const menuInjection = inject(menuInjectKey, null);
const subMenuInjection = inject(subMenuInjectKey, null);

const { arrowPosition } = menuInjection || {};

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

// 当前节点深度
const currentDepth = subMenuInjection ? subMenuInjection.parentDepth + 1 : 0;

provide(subMenuInjectKey, {
  value: props.value,
  parentDepth: currentDepth,
});

menuInjection?.menuTree.addChild({
  value: props.value as string,
  parentVal: subMenuInjection?.value,
});


// 支持超出隐藏，hover时popover提示，当前不支持内容变化，动态刷新
const subMenuTitleRef = ref<HTMLDivElement>();
const itemContentRef = ref<HTMLDivElement>();
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
      'o-sub-menu': true,
      'o-sub-menu-selected': isSelected,
      'o-sub-menu-associated-selected': isAssociatedSelected,
      'o-sub-menu-expanded': isExpanded,
    }"
    :style="{ '--menu-level': currentDepth }"
    :data-level="currentDepth"
    @click="onSubItemClick"
  >
    <div class="o-sub-menu-title" ref="subMenuTitleRef">
      <div class="o-sub-menu-arrow" v-if="arrowPosition === 'left'">
        <IconChevronDownBold />
      </div>
      <div v-if="$slots.icon || props.icon" class="o-sub-menu-title-icon">
        <slot name="icon">
          <component :is="props.icon" />
        </slot>
      </div>
      <div ref="itemContentRef" class="o-sub-menu-title-content">
        <slot name="title"></slot>
      </div>
      <div class="o-sub-menu-arrow" v-if="!arrowPosition || arrowPosition === 'right'">
        <IconChevronDownBold />
      </div>
    </div>
      <ul class="o-sub-menu-children" :class="{'expanded': isExpanded}">
        <div class="o-sub-menu-children-wrap">
          <slot></slot>
        </div>
      </ul>

    <OPopover v-if="isContentOverflow" :offset="12" :target="subMenuTitleRef" position="bottom" wrapClass="o-menu-popover">{{ content }}</OPopover>
  </li>
</template>
