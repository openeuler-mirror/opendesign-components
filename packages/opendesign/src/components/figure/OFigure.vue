<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { PrestColorPool } from '../_shared/utils';

import { figureProps } from './types';

const props = defineProps(figureProps);

const emits = defineEmits<{ (e: 'error'): void }>();

const isLoading = ref(true);
const isError = ref(false);
const prestColor = PrestColorPool.pick();

const bgSrc = computed(() => {
  if (props.background && props.ratio) {
    return `url(${props.src})`;
  }
  return '';
});

const paddingTop = computed(() => {
  if (props.ratio) {
    return `${((1 / props.ratio) * 100).toFixed(2)}%`;
  }
  return '';
});

const fit = computed(() => props.fit);
const position = computed(() => props.position);

const onImgLoaded = () => {
  isLoading.value = false;
  isError.value = false;
};
const onImgError = () => {
  isLoading.value = false;
  isError.value = true;
  emits('error');
};

watch(
  () => props.src,
  (src?: string) => {
    if (src && props.background) {
      const img = document.createElement('img');
      img.onload = onImgLoaded;
      img.onerror = onImgError;
      img.src = src;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div
    class="o-figure"
    :class="{
      'is-loading': isLoading,
      'is-error': isError,
    }"
  >
    <template v-if="props.src">
      <div
        v-if="paddingTop"
        class="o-figure-wrapper"
        :class="{
          'o-figure-bg': props.background,
        }"
        :style="{
          backgroundImage: bgSrc,
        }"
      >
        <img v-if="!props.background && !isError" :src="props.src" :alt="props.alt" class="o-figure-img-ratio" @load="onImgLoaded" @error="onImgError" />
      </div>
      <img v-else-if="!isError" :src="props.src" :alt="props.alt" class="o-figure-img" @load="onImgLoaded" @error="onImgError" />
    </template>
    <slot></slot>
  </div>
</template>
<style lang="scss">
.o-figure {
  display: inline-flex;
  overflow: hidden;
  transition: background-color var(--o-duration-m2);
  &.is-loading {
    background-color: v-bind(prestColor);
    img {
      opacity: 0;
    }
  }
  img {
    opacity: 1;
    transition: opacity var(--o-duration-m2);
  }
  &.is-error {
    background-color: var(--o-color-control4);
  }
}
.o-figure-wrapper {
  position: relative;
  width: 100%;
  padding-top: v-bind(paddingTop);
}
.o-figure-bg {
  background-size: v-bind(fit);
  background-position: v-bind(position);
  background-repeat: no-repeat;
}
.o-figure-img-ratio {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: v-bind(fit);
  object-position: v-bind(position);
}
</style>
