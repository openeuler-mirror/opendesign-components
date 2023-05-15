<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { defaultPrestColorPool } from '../_shared/global';
import HtmlTag from '../_shared/components/html-tag';
import OLayer from '../layer/OLayer.vue';

import { figureProps } from './types';

const props = defineProps(figureProps);

const emits = defineEmits<{ (e: 'error'): void }>();
const imgRef = ref<HTMLImageElement | null>(null);

const isLoading = ref(true);
const isError = ref(false);
const prestColor = props.colorful ? defaultPrestColorPool.value.pick() : '';

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
      const img = new Image();
      img.onload = onImgLoaded;
      img.onerror = onImgError;
      img.src = src;
    }
  },
  { immediate: true }
);
onMounted(() => {
  // 修复服务端渲染时，加载过快未刷新load状态问题
  if (imgRef.value && imgRef.value.complete) {
    onImgLoaded();
  }
});

// 全屏预览图片
const previewVisible = ref(false);
const preview = () => {
  previewVisible.value = true;
};
const onPreviewChange = () => {};

const onFigureClick = () => {
  if (props.preview) {
    preview();
  }
};

defineExpose({
  preview,
});
</script>
<template>
  <HtmlTag
    :tag="!!props.href ? 'a' : 'div'"
    class="o-figure"
    :href="props.href"
    :class="{
      'is-loading': isLoading,
      'is-error': isError,
      'is-colorful': props.colorful,
      'o-figure-hoverable': props.hoverable || !!props.href,
      'o-figure-previewable': props.preview,
    }"
    :style="{
      '--figure-prest-color': prestColor,
      '--figure-padding-top': paddingTop,
    }"
    @click="onFigureClick"
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
        <img
          v-if="!props.background && !isError"
          ref="imgRef"
          :src="props.src"
          :alt="props.alt"
          class="o-figure-img-ratio"
          @load="onImgLoaded"
          @error="onImgError"
        />
      </div>
      <img v-else-if="!isError" ref="imgRef" :src="props.src" :alt="props.alt" class="o-figure-img" @load="onImgLoaded" @error="onImgError" />
    </template>
    <slot></slot>
    <OLayer v-model:visible="previewVisible" class="o-figure-preview-layer" @change="onPreviewChange">
      <div class="o-figure-preview-img"><img :src="props.src" /></div>
    </OLayer>
  </HtmlTag>
</template>
