import { computed } from 'vue';

import type { sliderPropsT, sliderMarksPropsT } from '../types';

export interface Mark extends sliderMarksPropsT {
  point: number;
  position: number;
}

export const useMarks = (props: sliderPropsT) => {
  return computed(() => {
    if (!props.marks) {
      return [];
    }

    const marksKeys = Object.keys(props.marks);
    return marksKeys
      .map(Number.parseFloat)
      .sort((a, b) => a - b)
      .filter((point) => point <= props.max && point >= props.min)
      .map(
        (point): Mark => ({
          point,
          position: ((point - props.min) * 100) / (props.max - props.min),
          mark: props.marks![point],
        }),
      );
  });
};
