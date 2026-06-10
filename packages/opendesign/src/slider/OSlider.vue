<script lang="ts" setup>
import { computed, provide, reactive, toRefs, onMounted, onUnmounted, useSlots } from 'vue';
import { OInputNumber } from '../input-number';
import OSliderButton from './OSliderButton.vue';
import OSliderMarker from './OSliderMarker.vue';
import { isEmptySlot } from '../_utils/vue-utils';
import { useLifecycle, useMarks, useSlide, useStops, useWatch } from './composables';
import { sliderInjectKey } from './provide';
import { sliderProps, type SliderInitData, sliderEmits } from './types';

/**
 * TODO
 * 1、垂直方向滑动条
 * 2、popover方向问题
 */
const props = defineProps(sliderProps);
const emit = defineEmits(sliderEmits);

const slots = useSlots();

const initData = reactive<SliderInitData>({
  firstBtnVal: 0,
  secondBtnVal: 0,
  oldValue: 0,
  isDragging: false,
  sliderSize: 1,
});

const {
  sliderRunway,
  firstButton: firstSliderBtn,
  secondButton: secondSliderBtn,
  sliderDisabled,
  minValue: minVal,
  maxValue: maxVal,
  runwayStyle: sliderRunwayStyle,
  barStyle: sliderBarStyle,
  resetSize: resetSliderSize,
  emitChange: onInputChange,
  onSliderWrapperPrevent,
  onSliderClick,
  onSliderDown,
  onSliderMarkerDown,
  setFirstValue,
  setSecondValue,
} = useSlide(props, initData, emit);

const { stops, getStopStyle } = useStops(props, initData, minVal, maxVal);

const markList = useMarks(props);

useWatch(props, initData, minVal, maxVal, emit);

const hasUnit = computed(() => {
  return !isEmptySlot(slots.unit) || props.unit;
});

const { slider } = useLifecycle(props, initData, resetSliderSize);

const { firstBtnVal, secondBtnVal, sliderSize } = toRefs(initData);

const updateDragging = (val: boolean) => {
  initData.isDragging = val;
};

onMounted(() => {
  slider.value?.addEventListener('touchstart', onSliderWrapperPrevent, { passive: false });
  slider.value?.addEventListener('touchmove', onSliderWrapperPrevent, { passive: false });
});

onUnmounted(() => {
  slider.value?.removeEventListener('touchstart', onSliderWrapperPrevent);
  slider.value?.removeEventListener('touchmove', onSliderWrapperPrevent);
});

provide(sliderInjectKey, {
  ...toRefs(props),
  sliderSize,
  disabled: sliderDisabled,
  emitChange: onInputChange,
  resetSize: resetSliderSize,
  updateDragging,
});

defineExpose({
  /**
   * 点击滑轨时触发滑块移动
   */
  onSliderClick,
});
</script>

<template>
  <div
    ref="slider"
    class="o-slider"
    :class="{
      'o-slider-vertical': props.direction === 'v',
      'o-slider-with-stops': props.showStops,
      'o-slider-with-input': props.showInput,
      'o-slider-disabled': sliderDisabled,
    }"
  >
    <div class="o-slider-runway-wrap">
      <div ref="sliderRunway" class="o-slider-runway" :style="sliderRunwayStyle" @mousedown="onSliderDown" @touchstart.passive="onSliderDown">
        <div class="o-slider-bar" :style="sliderBarStyle"></div>
        <OSliderButton
          ref="firstSliderBtn"
          :model-value="firstBtnVal"
          :direction="direction"
          :wrap-class="wrapClass"
          :position="position"
          :show-solid-circle="showStops"
          :show-popover="showPopover"
          @update:model-value="setFirstValue"
        />
        <OSliderButton
          v-if="range"
          ref="secondSliderBtn"
          :model-value="secondBtnVal"
          :direction="direction"
          :wrap-class="wrapClass"
          :position="position"
          :show-solid-circle="showStops"
          :show-popover="showPopover"
          @update:model-value="setSecondValue"
        />
        <div v-if="showStops">
          <div
            v-for="(item, key) in stops"
            :key="key"
            class="o-slider-stop"
            :style="getStopStyle(item.step)"
            :class="{ 'o-slider-stop-reached': item.reached }"
          ></div>
        </div>
        <template v-if="markList.length > 0">
          <div class="o-slider-marks">
            <OSliderMarker
              v-for="(item, key) in markList"
              :key="key"
              :mark="item.mark"
              :style="getStopStyle(item.position)"
              @mousedown.stop="onSliderMarkerDown(item.position)"
            />
          </div>
        </template>
      </div>
    </div>

    <div v-if="showInput && !range" class="o-slider-input-wrap">
      <OInputNumber
        ref="input"
        class="o-slider-input"
        round="pill"
        controls="never"
        :model-value="firstBtnVal"
        :step="step"
        :disabled="sliderDisabled"
        :min="min"
        :max="max"
        :size="props.inputSize"
        :clear-value="0"
        @update:model-value="setFirstValue"
        @change="onInputChange"
      />
      <div v-if="hasUnit" class="o-slider-input-unit">
        <slot name="unit">{{ props.unit }}</slot>
      </div>
    </div>
  </div>
</template>
