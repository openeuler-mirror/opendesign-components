import { nextTick, onMounted, ref, onUnmounted } from 'vue';
import { isArray, isNumber } from '../../_utils/is';

import type { sliderPropsT, SliderInitData } from '../types';

export const useLifecycle = (props: sliderPropsT, initData: SliderInitData, resetSize: () => void) => {
  const slider = ref<HTMLElement>();

  onMounted(async () => {
    if (props.range) {
      if (isArray(props.modelValue)) {
        initData.firstValue = Math.max(props.min, props.modelValue[0]);
        initData.secondValue = Math.min(props.max, props.modelValue[1]);
      } else {
        initData.firstValue = props.min;
        initData.secondValue = props.max;
      }
      initData.oldValue = [initData.firstValue, initData.secondValue];
    } else {
      if (!isNumber(props.modelValue)) {
        initData.firstValue = props.min;
      } else {
        initData.firstValue = Math.min(props.max, Math.max(props.min, props.modelValue));
      }
      initData.oldValue = initData.firstValue;
    }
    window.addEventListener('resize', resetSize);

    await nextTick();
    resetSize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resetSize);
  });

  return {
    slider,
  };
};
