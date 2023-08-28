<script setup lang="ts">
import { computed, inject, nextTick } from 'vue';
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
    return collapseInjection.realValue.value.includes(props.value);
  }

  return false;
});

const onClick = (ev: Event) => {
  ev.stopPropagation();

  if (isUndefined(props.value)) {
    return;
  }

  let set = collapseInjection ? new Set([...collapseInjection.realValue.value]) : new Set([]);

  if (isExpanded.value) {
    if (collapseInjection.accordion.value) {
      set.clear();
    }
    set.delete(props.value);
  } else {
    if (collapseInjection.accordion.va) {
      set.clear();
    }
    set.add(props.value);
  }

  const val = Array.from(set);

  collapseInjection?.updateModelValue(val);

  nextTick(() => {
    collapseInjection?.onChange(val, ev);
  });
};

// 过渡动画
const onBeforeEnter = (el: HTMLUListElement) => {
  el.style.height = '0px';
};
const onEnter = (el: HTMLUListElement) => {
  console.log(el.scrollHeight);
  el.style.height = `${el.scrollHeight}px`;
};
const onAfterEnter = (el: HTMLUListElement) => {
  el.style.height = 'auto';
};
const onBeforeLeave = (el: HTMLUListElement) => {
  console.log(el.offsetHeight);
  el.style.height = `${el.offsetHeight}px`;
};
const onLeave = (el: HTMLUListElement) => {
  el.style.height = '0px';
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
    <Transition @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave">
      <div v-show="isExpanded" class="o-collapse-item-body">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
