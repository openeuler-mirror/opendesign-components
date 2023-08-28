<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { anchorItemProps } from './types';
import { anchorInjectKey } from './provide';
import {} from 'process';

const props = defineProps(anchorItemProps);
const anchorInjection = inject(anchorInjectKey, null);

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

onMounted(() => {
  addItem();
});

onUnmounted(() => {
  removeItem();
});
</script>

<template>
  <div
    :class="[
      'o-anchor-item',
      {
        'o-anchor-item-active': isActive,
      },
    ]"
  >
    <a :href="props.href" :target="props.target" class="o-anchor-item-link" @click="onClick">
      <slot name="title">{{ props.title }}</slot>
    </a>
    <slot></slot>
  </div>
</template>
