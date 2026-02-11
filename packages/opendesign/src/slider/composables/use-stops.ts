import { computed } from 'vue';

import type { CSSProperties, ComputedRef } from 'vue';
import type { SliderInitData, sliderPropsT } from '../types';

type Stops = {
  stops: ComputedRef<Array<{ step: number; reached: boolean }>>;
  getStopStyle: (position: number) => CSSProperties;
};

export const useStops = (props: sliderPropsT, initData: SliderInitData, minValue: ComputedRef<number>, maxValue: ComputedRef<number>): Stops => {
  const stops = computed(() => {
    if (!props.showStops || props.min > props.max) {
      return [];
    }
    if (props.step === 0) {
      return [];
    }

    const stopCount = Math.ceil((props.max - props.min) / props.step);
    const stepWidth = (100 * props.step) / (props.max - props.min);
    const result = Array.from<number>({ length: stopCount + 1 }).map((_, index) => index * stepWidth);

    if (props.range) {
      return result.map((step) => {
        const notReached =
          step < (100 * (minValue.value - props.min)) / (props.max - props.min) || step > (100 * (maxValue.value - props.min)) / (props.max - props.min);

        return {
          step,
          reached: !notReached,
        };
      });
    } else {
      return result.map((step) => {
        const notReached = step > (100 * (initData.firstBtnVal - props.min)) / (props.max - props.min);
        return {
          step,
          reached: !notReached,
        };
      });
    }
  });

  const getStopStyle = (position: number): CSSProperties => {
    return props.direction === 'v' ? { bottom: `${position}%` } : { left: `${position}%` };
  };

  return {
    stops,
    getStopStyle,
  };
};
