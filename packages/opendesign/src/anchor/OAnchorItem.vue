<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, provide, watch } from 'vue';
import { anchorItemProps } from './types';
import { anchorInjectKey, anchorItemInjectKey } from './provide';

const props = defineProps(anchorItemProps);
const anchorInjection = inject(anchorInjectKey, null);
const anchorItemInjection = inject(anchorItemInjectKey, null);

const isActive = computed(() => {
  return props.href === anchorInjection?.activeLink.value;
});

const addItem = () => {
  if (!props.href) {
    return;
  }
  anchorInjection?.addLink(props.href);
};

const removeItem = () => {
  if (!props.href) {
    return;
  }
  anchorInjection?.removeLink(props.href);
};

const onClick = (ev: MouseEvent) => {
  anchorInjection?.handleClick(ev, props.href);
};

watch(
  () => props.href,
  (newVal, oldVal) => {
    nextTick(() => {
      anchorInjection?.removeLink(oldVal);
      anchorInjection?.addLink(newVal);
    });
  }
);

const depth = anchorItemInjection ? anchorItemInjection.depth + 1 : 1;

provide(anchorItemInjectKey, { depth });

onMounted(() => {
  addItem();
});

onUnmounted(() => {
  removeItem();
});
</script>

<template>
  <div class="o-anchor-item">
    <a
      :href="props.href"
      :target="props.target"
      class="o-anchor-item-link"
      :class="{ 'is-active': isActive }"
      :style="{ '--anchor-item-depth': depth - 1 }"
      @click="onClick"
    >
      <slot name="title">{{ props.title }}</slot>
    </a>
    <slot></slot>
  </div>
</template>
