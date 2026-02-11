import { computed, nextTick, ref, shallowRef } from 'vue';
import type { CSSProperties, Ref, SetupContext } from 'vue';
import type { SliderEmits, SliderInitData, sliderPropsT, Arrayable } from '../types';
import type { ButtonRefs, SliderButtonInstance } from '../types';

export const useSlide = (props: sliderPropsT, initData: SliderInitData, emit: SetupContext<SliderEmits>['emit']) => {
  const sliderRunway = shallowRef<HTMLElement>();

  const firstButton = ref<SliderButtonInstance>();

  const secondButton = ref<SliderButtonInstance>();

  const buttonRefs: ButtonRefs = {
    firstButton,
    secondButton,
  };

  const sliderDisabled = computed(() => {
    return props.disabled;
  });

  const minValue = computed(() => {
    return Math.min(initData.firstBtnVal, initData.secondBtnVal);
  });

  const maxValue = computed(() => {
    return Math.max(initData.firstBtnVal, initData.secondBtnVal);
  });

  const barSize = computed(() => {
    return props.range
      ? `${(100 * (maxValue.value - minValue.value)) / (props.max - props.min)}%`
      : `${(100 * (initData.firstBtnVal - props.min)) / (props.max - props.min)}%`;
  });

  const barStart = computed(() => {
    return props.range ? `${(100 * (minValue.value - props.min)) / (props.max - props.min)}%` : '-4px';
  });

  const runwayStyle = computed<CSSProperties>(() => {
    return props.direction === 'v' ? { height: props.height } : {};
  });

  const barStyle = computed<CSSProperties>(() => {
    return props.direction === 'v'
      ? {
          height: barSize.value,
          bottom: barStart.value,
        }
      : {
          width: barSize.value,
          left: barStart.value,
        };
  });

  const resetSize = () => {
    if (sliderRunway.value) {
      const rect = sliderRunway.value.getBoundingClientRect();
      initData.sliderSize = rect[props.direction === 'v' ? 'height' : 'width'];
    }
  };

  const getButtonRefByPercent = (percent: number): Ref<SliderButtonInstance | undefined> => {
    const targetValue = props.min + (percent * (props.max - props.min)) / 100;
    if (!props.range) {
      return firstButton;
    }
    let buttonRefName: 'firstButton' | 'secondButton';
    if (Math.abs(minValue.value - targetValue) < Math.abs(maxValue.value - targetValue)) {
      buttonRefName = initData.firstBtnVal < initData.secondBtnVal ? 'firstButton' : 'secondButton';
    } else {
      buttonRefName = initData.firstBtnVal > initData.secondBtnVal ? 'firstButton' : 'secondButton';
    }
    return buttonRefs[buttonRefName];
  };

  const setPosition = (percent: number): Ref<SliderButtonInstance | undefined> => {
    const buttonRef = getButtonRefByPercent(percent);
    buttonRef.value!.setPosition(percent);
    return buttonRef;
  };

  const setFirstValue = (firstValue: number | undefined) => {
    initData.firstBtnVal = firstValue || props.min;
    _emit(props.range ? [minValue.value, maxValue.value] : firstValue || props.min);
  };

  const setSecondValue = (secondValue: number) => {
    initData.secondBtnVal = secondValue;

    if (props.range) {
      _emit([minValue.value, maxValue.value]);
    }
  };

  const _emit = (val: Arrayable<number>) => {
    emit('update:modelValue', val);
    emit('input', val);
  };

  const emitChange = async () => {
    await nextTick();
    emit('change', props.range ? [minValue.value, maxValue.value] : props.modelValue);
  };

  const handleSliderPointerEvent = (event: MouseEvent | TouchEvent): Ref<SliderButtonInstance | undefined> | undefined => {
    if (sliderDisabled.value || initData.isDragging) {
      return;
    }
    resetSize();
    let newPercent = 0;
    if (props.direction === 'v') {
      const clientY = (event as TouchEvent).touches?.item(0)?.clientY ?? (event as MouseEvent).clientY;
      const sliderOffsetBottom = sliderRunway.value!.getBoundingClientRect().bottom;
      newPercent = ((sliderOffsetBottom - clientY) / initData.sliderSize) * 100;
    } else {
      const clientX = (event as TouchEvent).touches?.item(0)?.clientX ?? (event as MouseEvent).clientX;
      const sliderOffsetLeft = sliderRunway.value!.getBoundingClientRect().left;
      newPercent = ((clientX - sliderOffsetLeft) / initData.sliderSize) * 100;
    }
    if (newPercent < 0 || newPercent > 100) {
      return;
    }
    return setPosition(newPercent);
  };

  const onSliderWrapperPrevent = (event: TouchEvent) => {
    if (buttonRefs['firstButton'].value?.dragging || buttonRefs['secondButton'].value?.dragging) {
      event.preventDefault();
    }
  };

  const onSliderDown = async (event: MouseEvent | TouchEvent) => {
    const buttonRef = handleSliderPointerEvent(event);
    if (buttonRef) {
      await nextTick();
      buttonRef.value!.onButtonDown(event);
    }
  };

  const onSliderClick = (event: MouseEvent | TouchEvent) => {
    const buttonRef = handleSliderPointerEvent(event);
    if (buttonRef) {
      emitChange();
    }
  };

  const onSliderMarkerDown = (position: number) => {
    if (sliderDisabled.value || initData.isDragging) {
      return;
    }
    const buttonRef = setPosition(position);
    if (buttonRef) {
      emitChange();
    }
  };

  return {
    sliderRunway,
    firstButton,
    secondButton,
    sliderDisabled,
    minValue,
    maxValue,
    runwayStyle,
    barStyle,
    resetSize,
    setPosition,
    emitChange,
    onSliderWrapperPrevent,
    onSliderClick,
    onSliderDown,
    onSliderMarkerDown,
    setFirstValue,
    setSecondValue,
  };
};
