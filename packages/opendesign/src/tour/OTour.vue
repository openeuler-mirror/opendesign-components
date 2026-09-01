<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, toRef, useSlots, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { createTopZIndex } from '../_utils/z-index';
import ClientOnly from '../_components/client-only';
import { useScreen } from '../hooks';
import { OPopup } from '../popup';
import type { VirtualElement } from '../popup';
import { useTarget } from './composables/use-target';
import { useMask } from './composables/use-mask';
import { useAnchorImageColor } from './composables/use-anchor-image-color';
import { tourProps } from './types';
import type { TourStepPropsT } from './types';
import { tourKey } from './provide';
import OTourSteps from './OTourSteps';
import type { TourPositionT } from './types';

defineOptions({
  name: 'OTour',
});

const props = defineProps(tourProps);
/**
 * @zh-CN 是否显示漫游引导，双向绑定值
 * @en-US Whether to show the tour, bidirectional binding value.
 * @default false
 */
const visibleModel = defineModel<boolean>('visible', { default: false });
/**
 * @zh-CN 当前步骤索引，双向绑定值
 * @en-US Current step index, bidirectional binding value.
 * @default 0
 */
const currentModel = defineModel<number>('current', { default: 0 });

const emit = defineEmits<{
  (e: 'close', current: number): void;
  (e: 'finish'): void;
  (e: 'change', current: number): void;
}>();

const { gtPadV } = useScreen();

const showTour = computed(() => visibleModel.value && gtPadV.value);

const total = ref(0);
const currentStep = ref<TourStepPropsT>();

const currentTarget = computed(() => currentStep.value?.target);

const imgVisible = computed(() => !!currentStep.value?.img);

const mergedPosition = computed<TourPositionT>(() => currentStep.value?.position || props.position);

const mergedContentStyle = computed(() => currentStep.value?.contentStyle ?? props.contentStyle);

const mergedMask = computed(() => currentStep.value?.mask ?? props.mask);
const mergedShowMask = computed(() => mergedMask.value && visibleModel.value);

const mergedShowArrow = computed(() => !!currentTarget.value && (currentStep.value?.showArrow ?? props.showArrow));

const nowZIndex = createTopZIndex();
const maskZIndex = computed(() => nowZIndex - 1);
const { mergedPosInfo: pos, triggerTarget } = useTarget(currentTarget, visibleModel, ref(12), toRef(props, 'spotlightRadius'), mergedMask);

const { path, maskStyle, pathStyle, viewBox } = useMask(pos, maskZIndex);

/**
 * @description 采样箭头中心点在 Tour 图片上的像素色，作为箭头背景色
 * 失败时 anchorBg 为 null，由 SCSS var(--_tour-anchor-bg, var(--popup-bg-color)) 回退
 */
const rootEl = ref<HTMLElement | null>(null);
const { anchorBg } = useAnchorImageColor({
  visible: visibleModel,
  currentStep,
  rootEl,
});
const tourStyle = computed(() => (anchorBg.value ? { '--_tour-anchor-bg': anchorBg.value } : {}));

/**
 * @description 传给 OPopup 的 targetRect，当遮罩存在时为含间隙区域的 VirtualElement
 */
const popupTargetRect = computed<VirtualElement | null>(() => {
  if (!showTour.value) return null;
  return triggerTarget.value ?? null;
});

watch(
  currentModel,
  (newVal, oldVal) => {
    if (!visibleModel.value || newVal === oldVal) return;
    emit('change', newVal);
  },
  { flush: 'post' },
);

/**
 * @description 用户主动关闭（visible 切到 false）时回到第 0 步并清空当前步骤数据，
 * 下次打开从头开始且不残留旧步骤的高亮定位
 */
watch(visibleModel, (val) => {
  if (!val) {
    if (currentModel.value !== 0) {
      currentModel.value = 0;
    }
    currentStep.value = undefined;
  }
});

watch(
  () => showTour.value && mergedMask.value,
  (val) => {
    document.body.classList.toggle('o-tour-open', val);
  },
);

onBeforeUnmount(() => {
  document.body.classList.remove('o-tour-open');
});

/**
 * @description ESC 键关闭
 */
const onKeydown = (e: KeyboardEvent) => {
  if (props.closeOnPressEscape && visibleModel.value && e.key === 'Escape') {
    visibleModel.value = false;
    emit('close', currentModel.value);
  }
};

useEventListener('keydown', onKeydown);

const onUpdateTotal = (val: number) => {
  total.value = val;
};

provide(tourKey, {
  currentStep,
  current: currentModel,
  total,
  showClose: toRef(props, 'showClose'),
  slots: useSlots(),
  updateVisible(value: boolean) {
    visibleModel.value = value;
  },
  onClose() {
    emit('close', currentModel.value);
  },
  onFinish() {
    emit('finish');
  },
});
</script>
<template>
  <ClientOnly>
    <Teleport :to="props.wrapper">
      <div
        v-if="showTour"
        ref="rootEl"
        class="o-tour"
        :style="tourStyle"
        :class="{ 'o-tour-center': !currentTarget, 'o-tour-not-mask': !mergedShowMask, 'o-tour-img-close': imgVisible }"
        v-bind="$attrs"
      >
        <div v-if="mergedShowMask" class="o-tour-mask" :style="maskStyle">
          <svg style="width: 100%; height: 100%" :viewBox="viewBox">
            <path class="o-tour-mask-hollow" fill-rule="evenodd" :style="pathStyle" :d="path" />
          </svg>
        </div>

        <OPopup
          trigger="none"
          class="o-tour-popup"
          :visible="showTour"
          :target-rect="popupTargetRect"
          :position="mergedPosition"
          :anchor="mergedShowArrow"
          :anchor-class="'o-popover-anchor' + (props.arrowClass ? ' ' + props.arrowClass : '')"
          :wrap-class="'o-tour-popup-wrap' + (props.popupClass ? ' ' + props.popupClass : '')"
          :offset="12"
          :edge-offset="4"
          :adaptive="true"
          :unmount-on-hide="false"
          :adjust-min-width="false"
          :adjust-width="false"
          :wrapper="null"
          transition=""
        >
          <div class="o-tour-content" :style="mergedContentStyle" tabindex="-1">
            <OTourSteps :current="currentModel" @update-total="onUpdateTotal">
              <slot />
            </OTourSteps>
          </div>
        </OPopup>
      </div>
    </Teleport>
  </ClientOnly>
</template>
