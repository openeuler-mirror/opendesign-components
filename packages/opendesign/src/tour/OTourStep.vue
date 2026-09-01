<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { OButton } from '../button';
import { IconClose } from '../_utils/icons';
import { ArrowLeft, ArrowRight } from '../_utils/keycode';
import { useI18n } from '../locale';
import { tourStepProps } from './types';
import { tourKey } from './provide';
import type { TourBtnProps } from './types';

defineOptions({
  name: 'OTourStep',
});

const props = defineProps(tourStepProps);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineSlots<{
  /**
   * 左侧内容区
   * Left content area
   */
  left(): void;
  /**
   * 图片区域，默认渲染 props.img 对应的 <img>
   * Image area, renders <img> from props.img by default
   */
  img(): void;
  /**
   * 标题区域，默认渲染 props.title
   * Title area, renders props.title by default
   */
  title(): void;
  /**
   * 详情区域，默认渲染 props.detail
   * Detail area, renders props.detail by default
   */
  detail(): void;
  /**
   * 跳过按钮区域
   * Skip button area
   */
  skip(): void;
  /**
   * 步骤指示器，接收当前步骤索引与步骤总数
   * Step indicator, receives current step index and total step count
   */
  indicators(props: { current: number; total: number }): void;
  /**
   * 底部按钮区域，接收当前步骤索引、步骤总数及上一步/下一步方法；覆盖默认按钮时需自行调用 onPrev/onNext
   * Footer button area, receives current step index, total count and prev/next methods; call onPrev/onNext manually when overriding default buttons
   */
  footer(props: { current: number; total: number; onPrev: () => void; onNext: () => void }): void;
}>();

const { t } = useI18n();

const tour = inject(tourKey)!;
const { currentStep, current, total, showClose, slots: tourSlots, updateVisible, onClose: tourOnClose, onFinish: tourOnFinish } = tour;

/**
 * @description 当前步骤激活时，将自己的 props 写入 Tour 的 currentStep
 */
watch(
  props,
  (val) => {
    currentStep.value = val;
  },
  { immediate: true },
);

const mergedShowClose = computed(() => props.showClose ?? showClose.value);

/**
 * @description 过滤按钮属性，排除 children 和 onClick
 */
const filterButtonProps = (btnProps?: TourBtnProps) => {
  if (!btnProps) return;
  const { children, onClick, ...rest } = btnProps;
  return rest;
};

const onPrev = () => {
  current.value -= 1;
  props.prevButtonProps?.onClick?.();
};

const onFinish = () => {
  updateVisible(false);
  tourOnFinish();
};

const onClose = () => {
  updateVisible(false);
  tourOnClose();
  emit('close');
};

const onNext = () => {
  if (current.value >= total.value - 1) {
    onFinish();
  } else {
    current.value += 1;
  }
  props.nextButtonProps?.onClick?.();
};

/**
 * @description 键盘导航：左右箭头切换步骤
 */
const handleKeydown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement | null;
  // 输入控件内的方向键保留给文本编辑，不切换步骤
  const tag = target?.tagName;
  if (target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  if (e.key === ArrowLeft.key) {
    e.preventDefault();
    current.value > 0 && onPrev();
  } else if (e.key === ArrowRight.key) {
    e.preventDefault();
    onNext();
  }
};

useEventListener('keydown', handleKeydown);
</script>
<template>
  <div class="o-tour-step">
    <div v-if="mergedShowClose" class="o-tour-close" :class="{ 'o-tour-img-close': props.img }" @click="onClose">
      <IconClose />
    </div>
    <div class="o-tour-step-content">
      <slot name="left"></slot>
      <div class="o-tour-step-content-card">
        <slot name="img">
          <img v-if="props.img" :src="props.img" class="o-tour-img" />
        </slot>
        <div class="o-tour-body">
          <div v-if="props.title || tourSlots.title" class="o-tour-title">
            <slot name="title">
              {{ props.title }}
            </slot>
          </div>
          <div v-if="props.detail || tourSlots.detail" class="o-tour-detail">
            <slot name="detail">
              {{ props.detail }}
            </slot>
          </div>
        </div>
        <div class="o-tour-footer">
          <div class="o-tour-skip">
            <slot name="skip"></slot>
          </div>
          <div v-if="total > 1 || $slots.indicators" class="o-tour-indicators">
            <slot name="indicators" :current="current" :total="total"> {{ current + 1 }}/{{ total }} </slot>
          </div>
          <div class="o-tour-buttons">
            <slot name="footer" :current="current" :total="total" :on-prev="onPrev" :on-next="onNext">
              <OButton v-if="current > 0" size="small" color="primary" variant="text" v-bind="filterButtonProps(props.prevButtonProps)" @click="onPrev">
                {{ props.prevButtonProps?.children ?? t('tour.prev') }}
              </OButton>
              <OButton
                v-if="total > 0 && current <= total - 1"
                size="small"
                color="primary"
                variant="solid"
                round="pill"
                v-bind="filterButtonProps(props.nextButtonProps)"
                @click="onNext"
              >
                {{ props.nextButtonProps?.children ?? (current === total - 1 ? t('tour.finish') : t('tour.next')) }}
              </OButton>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
