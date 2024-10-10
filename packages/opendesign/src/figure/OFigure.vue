<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { defaultPrestColorPool } from '../_utils/global';
import HtmlTag from '../_components/html-tag';
import { OLayer } from '../layer';
import { IconImageError, IconVideoPlay } from '../_utils/icons';

import { figureProps } from './types';

const props = defineProps(figureProps);

const emits = defineEmits<{
  (e: 'error'): void;
  (e: 'load'): void;
  (e: 'preview', visible: boolean): void;
}>();
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
  emits('load');
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
const canPreview = computed(() => props.preview || props.lazyPreiew);
const preview = () => {
  if (canPreview.value) {
    previewVisible.value = true;
  }
};
const onPreviewChange = (visible: boolean) => {
  emits('preview', visible);
};

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
      'o-figure-hoverable': props.hoverable || !!props.href || props.preview || props.videoPoster,
      'o-figure-previewable': props.preview,
      'o-figure-video-poster': props.videoPoster,
    }"
    :style="{
      '--figure-prest-color': prestColor,
      '--figure-padding-top': paddingTop,
      '--figure-fit': props.fit,
    }"
    @click="onFigureClick"
  >
    <template v-if="props.src">
      <div
        v-if="paddingTop || isError"
        class="o-figure-wrap"
        :class="{
          'o-figure-bg': props.background,
        }"
        :style="{
          backgroundImage: bgSrc,
        }"
      >
        <div v-if="isError" class="o-figure-error-wrap">
          <slot name="error"><IconImageError /></slot>
        </div>
        <img v-else-if="!props.background" ref="imgRef" :src="props.src" :alt="props.alt" class="o-figure-img-ratio" @load="onImgLoaded" @error="onImgError" />
      </div>
      <img v-else-if="!isError" ref="imgRef" :src="props.src" :alt="props.alt" class="o-figure-img" @load="onImgLoaded" @error="onImgError" />
    </template>
    <div class="o-figure-main">
      <slot></slot>
      <div v-if="props.videoPoster" class="o-figure-mask">
        <slot name="play-icon">
          <div class="o-figure-play-icon">
            <IconVideoPlay />
          </div>
        </slot>
      </div>
      <div v-if="$slots.content || $slots.title" class="o-figure-content">
        <slot name="content">
          <div class="o-figure-title">
            <slot name="title"></slot>
          </div>
        </slot>
      </div>
    </div>

    <OLayer v-if="canPreview" v-model:visible="previewVisible" class="o-figure-preview-layer" @change="onPreviewChange">
      <div class="o-figure-preview-img"><img :src="props.src" /></div>
    </OLayer>
  </HtmlTag>
</template>
