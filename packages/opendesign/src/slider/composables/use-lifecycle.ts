import { nextTick, onMounted, ref, onUnmounted } from 'vue';
import { isArray, isNumber } from '../../_utils/is';

import type { sliderPropsT, SliderInitData } from '../types';

export const useLifecycle = (props: sliderPropsT, initData: SliderInitData, resetSize: () => void) => {
  const slider = ref<HTMLElement>();

  onMounted(async () => {
    if (props.range) {
      if (isArray(props.modelValue)) {
        initData.firstBtnVal = Math.max(props.min, props.modelValue[0]);
        initData.secondBtnVal = Math.min(props.max, props.modelValue[1]);
      } else {
        initData.firstBtnVal = props.min;
        initData.secondBtnVal = props.max;
      }
      initData.oldValue = [initData.firstBtnVal, initData.secondBtnVal];
    } else {
      if (!isNumber(props.modelValue)) {
        initData.firstBtnVal = props.min;
      } else {
        initData.firstBtnVal = Math.min(props.max, Math.max(props.min, props.modelValue));
      }
      initData.oldValue = initData.firstBtnVal;
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
