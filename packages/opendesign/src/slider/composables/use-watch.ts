import { watch } from 'vue';
import type { ComputedRef, SetupContext } from 'vue';
import type { sliderPropsT, SliderInitData, SliderEmits, Arrayable } from '../types';
import { isArray, isNumber } from '../../_utils/is';

export const useWatch = (
  props: sliderPropsT,
  initData: SliderInitData,
  minValue: ComputedRef<number>,
  maxValue: ComputedRef<number>,
  emit: SetupContext<SliderEmits>['emit'],
) => {
  const _emit = (val: Arrayable<number>) => {
    emit('update:modelValue', val);
    emit('input', val);
  };

  const valueChanged = () => {
    if (props.range) {
      return ![minValue.value, maxValue.value].every((item, index) => item === (initData.oldValue as number[])[index]);
    } else {
      return props.modelValue !== initData.oldValue;
    }
  };

  const setValues = () => {
    if (props.min > props.max) {
      return;
    }
    const val = props.modelValue;
    if (props.range && isArray(val)) {
      if (val[1] < props.min) {
        _emit([props.min, props.min]);
      } else if (val[0] > props.max) {
        _emit([props.max, props.max]);
      } else if (val[0] < props.min) {
        _emit([props.min, val[1]]);
      } else if (val[1] > props.max) {
        _emit([val[0], props.max]);
      } else {
        initData.firstBtnVal = val[0];
        initData.secondBtnVal = val[1];
        if (valueChanged()) {
          initData.oldValue = val.slice();
        }
      }
    } else if (!props.range && isNumber(val)) {
      if (val < props.min) {
        _emit(props.min);
      } else if (val > props.max) {
        _emit(props.max);
      } else {
        initData.firstBtnVal = val;
        if (valueChanged()) {
          initData.oldValue = val;
        }
      }
    }
  };

  setValues();

  watch(
    () => initData.isDragging,
    (val) => {
      if (!val) {
        setValues();
      }
    },
  );

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (
        initData.isDragging ||
        (isArray(val) &&
          isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]) &&
          initData.firstBtnVal === val[0] &&
          initData.secondBtnVal === val[1])
      ) {
        return;
      }
      setValues();
    },
    {
      deep: true,
    },
  );

  watch(
    () => [props.min, props.max],
    () => {
      setValues();
    },
  );
};
