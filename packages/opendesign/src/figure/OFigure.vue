<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import { defaultPrestColorPool } from '../_utils/global';
import HtmlTag from '../_components/html-tag';
import { OLayer } from '../layer';
import { IconImageError, IconVideoPlay } from '../_utils/icons';
import { useIntersectionObserver } from '../hooks';

import { figureProps } from './types';
import { isObject } from '../_utils/is';
import { requestImage } from '../_utils/helper';
import { useScreen } from '../hooks';

const props = defineProps(figureProps);

const emits = defineEmits<{
  (e: 'error'): void;
  (e: 'load'): void;
  (e: 'preview', visible: boolean): void;
}>();
const imgRef = ref<HTMLImageElement | null>(null);

const { isPhonePad } = useScreen();
const isLoading = ref(true);
const isError = ref(false);
const prestColor = props.colorful ? defaultPrestColorPool.value.pick() : '';

const imgSrc = ref<string | undefined>(undefined); // 当使用img标签时，图片地址
const bgUrl = computed(() => (props.background && imgSrc.value ? `url(${imgSrc.value})` : undefined));
const useObserver = (props.lazy && props.background) || isObject(props.lazy); // 使用IntersectionObserver检测是否开始加载图片

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

// 请求图片
watchEffect(() => {
  if (!props.src) {
    return;
  }

  // 不设置懒加载
  if (props.lazy === false) {
    imgSrc.value = props.src;
  } else {
    // 懒加载判断使用浏览器原生属性，则直接赋值
    if (!useObserver) {
      imgSrc.value = props.src;
    }
  }

  if (props.background && imgSrc.value) {
    requestImage(imgSrc.value).then(onImgLoaded).catch(onImgError);
  }
});

// 处理背景图片懒加载
let io: ReturnType<typeof useIntersectionObserver> | null = null;
const rootEl = ref<InstanceType<typeof HtmlTag> | null>(null);

onMounted(() => {
  // 修复服务端渲染时，加载过快未刷新load状态问题
  if (imgRef.value && imgRef.value.complete && imgSrc.value) {
    onImgLoaded();
  }

  if (useObserver) {
    io = useIntersectionObserver(isObject(props.lazy) ? props.lazy : {});
    if (rootEl.value) {
      io?.observe(rootEl.value.$el, (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          imgSrc.value = props.src;
        }
      });
    }
  }
});

// 指定长宽比
const paddingTop = computed(() => {
  if (props.ratio) {
    return `${((1 / props.ratio) * 100).toFixed(2)}%`;
  }
  return '';
});

// 全屏预览图片
const previewVisible = ref(false);
const canPreview = computed(() => props.preview || props.lazyPreview);
const previewCloseTypes = computed(() => {
  if (!props.previewClose) {
    return isPhonePad.value ? ['image', 'mask', 'button'] : ['mask', 'button'];
  } else if (Array.isArray(props.previewClose)) {
    return props.previewClose;
  }
  return [props.previewClose];
});
const isMaskClose = computed(() => previewCloseTypes.value.includes('mask'));
const isButtonClose = computed(() => previewCloseTypes.value.includes('button'));
const isBodyClose = computed(() => previewCloseTypes.value.includes('body'));
const preview = (visible: boolean = true) => {
  if (canPreview.value) {
    previewVisible.value = visible;
  }
};
const onPreviewChange = (visible: boolean) => {
  emits('preview', visible);
};
const onPreviewImgClick = () => {
  if (isBodyClose.value) {
    previewVisible.value = false;
  }
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
    ref="rootEl"
  >
    <template v-if="imgSrc">
      <div
        v-if="paddingTop || isError"
        class="o-figure-wrap"
        :class="{
          'o-figure-bg': props.background,
        }"
        :style="{
          backgroundImage: bgUrl,
        }"
      >
        <div v-if="isError" class="o-figure-error-wrap">
          <slot name="error"><IconImageError /></slot>
        </div>
        <img
          v-else-if="!props.background"
          ref="imgRef"
          :src="imgSrc"
          :alt="props.alt"
          class="o-figure-img-ratio"
          :loading="props.lazy === true ? 'lazy' : 'eager'"
          @load="onImgLoaded"
          @error="onImgError"
        />
      </div>
      <img
        v-else-if="!isError"
        ref="imgRef"
        :src="imgSrc"
        :alt="props.alt"
        class="o-figure-img"
        :loading="props.lazy === true ? 'lazy' : 'eager'"
        @load="onImgLoaded"
        @error="onImgError"
      />
    </template>
    <div class="o-figure-main" v-if="props.videoPoster || $slots.content || $slots.title || $slots.default">
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

    <OLayer
      v-if="canPreview"
      v-model:visible="previewVisible"
      class="o-figure-preview-layer"
      @change="onPreviewChange"
      :mask-close="isMaskClose"
      :button-close="isButtonClose"
    >
      <div class="o-figure-preview-wrapper" @click="onPreviewImgClick">
        <slot name="preview" :image="imgSrc">
          <div class="o-figure-preview-img">
            <img :src="imgSrc" />
          </div>
          <slot name="preview-extra"></slot>
        </slot>
      </div>
    </OLayer>
  </HtmlTag>
</template>
