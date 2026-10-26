<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { defaultPrestColorPool } from '../_utils/global';
import HtmlTag from '../_components/html-tag';
import { OImageViewer } from '../image-viewer';
import { IconImageError, IconVideoPlay } from '../_utils/icons';
import { useIntersectionObserver } from '../hooks';

import { figureProps } from './types';
import { isArray, isObject, isUndefined } from '../_utils/is';
import { requestImage } from '../_utils/helper';
import { useScreen } from '../hooks';

const props = defineProps(figureProps);

const emits = defineEmits<{
  /**
   * @zh-CN 图片加载失败时触发
   * @en-US Triggered when the image fails to load
   */
  (e: 'error'): void;
  /**
   * @zh-CN 图片加载成功时触发
   * @en-US Triggered when the image loads successfully
   */
  (e: 'load'): void;
  /**
   * @zh-CN 图片预览可见状态变化时触发
   * @en-US Triggered when the image preview visibility changes
   */
  (e: 'preview', visible: boolean): void;
}>();

const slots = defineSlots<{
  /**
   * @zh-CN 默认插槽，渲染在图片下方的主内容区域
   * @en-US Default slot, rendered in the main content area below the image
   */
  default?(): any;
  /**
   * @zh-CN 图片加载失败时的自定义错误提示内容
   * @en-US Custom error display when the image fails to load
   */
  error?(): any;
  /**
   * @zh-CN 视频海报模式下的播放图标
   * @en-US Play icon for video poster mode
   */
  'play-icon'?(): any;
  /**
   * @zh-CN 自定义内容区域，渲染在图片上方
   * @en-US Custom content area, rendered above the image
   */
  content?(): any;
  /**
   * @zh-CN 内容区域内的标题
   * @en-US Title within the content area
   */
  title?(): any;
  /**
   * @zh-CN 自定义预览内容，替换默认的图片查看器 UI，透传 OImageViewer 的 preview 插槽作用域
   * @en-US Custom preview content, replaces the default image viewer UI, forwards OImageViewer's preview slot scope
   */
  preview?(props: {
    src: string;
    /**
     * @deprecated use src
     */
    image: string;
  }): any;
  /**
   * @zh-CN 预览层内的额外覆盖内容，透传至 OImageViewer 的默认插槽
   * @en-US Extra overlay content within the preview layer, forwarded to OImageViewer's default slot
   */
  'preview-extra'?(): any;
}>();

const imgRef = ref<HTMLImageElement | null>(null);

const { isPhonePad } = useScreen();
const isLoading = ref(true);
const isError = ref(false);

/**
 * 预制随机背景色，仅在图片加载完成前展示（colorful=true 时生效）。
 */
const prsetColor = ref('');

const imgSrc = ref<string | undefined>(undefined); // 当使用img标签时，图片地址
const bgUrl = computed(() => (props.background && imgSrc.value ? `url(${imgSrc.value})` : undefined));

/**
 * 从 preview prop 中提取 OImageViewer 的属性配置
 * @description preview 为 true 时使用空对象（OImageViewer 全部走默认值），为对象时浅拷贝透传。
 * 当存在 #preview 插槽（自定义预览内容，如视频播放器）且用户未明确指定 scalable 时，
 * 自动设为 false——自定义预览内容通常不适用图片缩放交互。
 */
const imageViewerConfig = computed(() => {
  const config = isObject(props.preview) ? { ...props.preview } : {};
  if (isUndefined(config.scalable) && slots.preview) {
    config.scalable = false;
  }
  return config;
});

const urlList = computed(() => {
  const { previewList } = imageViewerConfig.value;
  let tempList = [imgSrc.value as string];
  if (isArray(previewList) && previewList.length) {
    tempList = previewList;
  }
  return tempList;
});
const imgIndex = computed(() => {
  const startIndex = imageViewerConfig.value.currentIndex ?? 0;
  let previewIndex = startIndex;
  if (startIndex > urlList.value.length - 1 || startIndex < 0) {
    previewIndex = 0;
  }
  return previewIndex;
});

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
  if (props.colorful) {
    prsetColor.value = defaultPrestColorPool.value.pick();
  }

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

/**
 * 计算预览关闭方式列表
 * @description 未配置 previewClose 时，移动端默认 body+mask+button 三种方式，桌面端 mask+button
 */
const previewCloseTypes = computed(() => {
  if (!props.previewClose) {
    return isPhonePad.value ? ['body', 'mask', 'button'] : ['mask', 'button'];
  } else if (Array.isArray(props.previewClose)) {
    return props.previewClose;
  }
  return [props.previewClose];
});
const isMaskClose = computed(() => previewCloseTypes.value.includes('mask'));
const isButtonClose = computed(() => previewCloseTypes.value.includes('button'));
const isBodyClose = computed(() => previewCloseTypes.value.includes('body'));

/**
 * 传递给 OImageViewer 内部 OLayer 的属性配置
 * @description 根据 previewClose 计算遮罩点击关闭、关闭按钮、图片点击关闭的开关状态
 */
const imageViewerLayerOptions = computed(() => ({
  mask: true,
  maskClose: isMaskClose.value,
  buttonClose: isButtonClose.value,
  wrapper: 'body',
}));

const preview = (visible: boolean = true) => {
  if (canPreview.value) {
    previewVisible.value = visible;
  }
};

/**
 * 监听预览可见性变化，统一向父组件发射 preview 事件
 * @description 覆盖两条触发路径：
 * 1. 主动调用 preview() / 点击 figure → previewVisible 被直接赋值
 * 2. OImageViewer 内部关闭（遮罩点击 / 关闭按钮）→ v-model 回写 previewVisible
 */
watch(previewVisible, (val) => {
  emits('preview', val);
});

const onFigureClick = () => {
  if (props.preview) {
    preview();
  }
};

defineExpose({
  /**
   * @zh-CN 预览图片
   * @en-US Preview the image
   */
  preview,
});
</script>
<template>
  <HtmlTag
    ref="rootEl"
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
      'o-figure-bg': props.background,
      'o-figure-no-ratio': !props.ratio,
    }"
    :style="{
      '--figure-prest-color': prsetColor,
      '--figure-padding-top': paddingTop,
      '--figure-fit': props.fit,
      backgroundImage: bgUrl,
    }"
    @click="onFigureClick"
  >
    <div v-if="paddingTop || isError" class="o-figure-wrap">
      <div v-if="isError" class="o-figure-error-wrap">
        <slot name="error">
          <IconImageError />
        </slot>
      </div>
      <img
        v-else-if="!props.background && imgSrc"
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
      v-else-if="imgSrc && !props.background"
      ref="imgRef"
      :src="imgSrc"
      :alt="props.alt"
      class="o-figure-img"
      :loading="props.lazy === true ? 'lazy' : 'eager'"
      @load="onImgLoaded"
      @error="onImgError"
    />
    <div v-if="props.videoPoster || $slots.content || $slots.title || $slots.default" class="o-figure-main">
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

    <!--
      图片预览：OImageViewer 内部持有 OLayer，#preview 插槽可替换默认查看器 UI。
      仅透传与 OFigure 核心场景（视频海报 / 图片预览覆盖层）相关的两个插槽：
      - #preview       → OImageViewer #preview：整体替换预览 UI（如视频播放器）
      - #preview-extra → OImageViewer #default：在预览图上叠加覆盖内容（如播放控制按钮）
      OImageViewer 的 #toolbar / #progress / #error 不透传，原因：
      - #error 与 OFigure 自身 #error（缩略图加载失败）命名冲突，无法区分缩略图与预览大图的错误
      - #toolbar / #progress 属于预览层 UI 细节，深度定制应直接使用 OImageViewer 而非通过 OFigure 间接控制
    -->
    <OImageViewer
      v-if="canPreview"
      v-model:visible="previewVisible"
      v-bind="imageViewerConfig"
      class="o-figure-preview-layer"
      wrapper-class="o-figure-preview-wrapper"
      container-class="o-figure-preview-img"
      :current-index="imgIndex"
      :preview-list="urlList"
      :body-close="isBodyClose"
      :layer-options="imageViewerLayerOptions"
    >
      <template v-if="$slots.preview" #preview="scope">
        <slot name="preview" v-bind="scope" :image="scope.src"></slot>
      </template>
      <template v-if="$slots['preview-extra']" #default>
        <slot name="preview-extra"></slot>
      </template>
    </OImageViewer>
  </HtmlTag>
</template>
