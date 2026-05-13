<script lang="ts" setup>
import { computed, reactive, toRefs, inject, ref, CSSProperties, ComputedRef, watch, onMounted, onUnmounted } from 'vue';
import { OPopover } from '../popover';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Home, End, pageDown, pageUp } from '../_utils/keycode';
import { mergeClass } from '../_utils/vue-utils';
import { sliderInjectKey } from './provide';
import { sliderButtonProps, type SliderButtonInitData } from './types';

const props = defineProps(sliderButtonProps);
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const initData = reactive<SliderButtonInitData>({
  hovering: false,
  dragging: false,
  isClick: false,
  startX: 0,
  currentX: 0,
  startY: 0,
  currentY: 0,
  startPosition: 0,
  newPosition: 0,
  oldValue: props.modelValue,
});

const { disabled, min, max, step, sliderSize, emitChange, resetSize, updateDragging } = inject(sliderInjectKey)!;

const button = ref<HTMLDivElement>();

const { hovering, dragging } = toRefs(initData);

const formatValue = computed(() => {
  return props.modelValue;
});

const showToolTip = computed(() => {
  return initData.hovering || initData.dragging;
});

const currentPosition = computed(() => {
  return `${((props.modelValue - min.value) / (max.value - min.value)) * 100}%`;
});

const wrapperStyle: ComputedRef<CSSProperties> = computed(() => {
  return { left: currentPosition.value };
});

const handleMouseEnter = () => {
  initData.hovering = true;
};

const handleMouseLeave = () => {
  initData.hovering = false;
};

const onButtonDown = (event: MouseEvent | TouchEvent) => {
  if (disabled.value) {
    return;
  }
  event.preventDefault();
  handleDragStart(event);
  window.addEventListener('mousemove', handleDragging);
  window.addEventListener('touchmove', handleDragging);
  window.addEventListener('mouseup', handleDragEnd);
  window.addEventListener('touchend', handleDragEnd);
  window.addEventListener('contextmenu', handleDragEnd);
  button.value!.focus();
};

const incrementPosition = (amount: number) => {
  if (disabled.value) {
    return;
  }
  initData.newPosition = Number.parseFloat(currentPosition.value) + (amount / (max.value - min.value)) * 100;
  setPosition(initData.newPosition);
  emitChange();
};

const onLeftKeyDown = () => {
  incrementPosition(-step.value);
};

const onRightKeyDown = () => {
  incrementPosition(step.value);
};

const onPageDownKeyDown = () => {
  incrementPosition(-step.value * 4);
};

const onPageUpKeyDown = () => {
  incrementPosition(step.value * 4);
};

const onHomeKeyDown = () => {
  if (disabled.value) {
    return;
  }
  setPosition(0);
  emitChange();
};

const onEndKeyDown = () => {
  if (disabled.value) {
    return;
  }
  setPosition(100);
  emitChange();
};

const onKeyDown = (event: KeyboardEvent) => {
  const code = event.code;
  let isPreventDefault = true;

  switch (code) {
    case ArrowLeft.key:
    case ArrowDown.key:
      onLeftKeyDown();
      break;
    case ArrowRight.key:
    case ArrowUp.key:
      onRightKeyDown();
      break;
    case Home.key:
      onHomeKeyDown();
      break;
    case End.key:
      onEndKeyDown();
      break;
    case pageDown.key:
      onPageDownKeyDown();
      break;
    case pageUp.key:
      onPageUpKeyDown();
      break;
    default:
      isPreventDefault = false;
      break;
  }

  isPreventDefault && event.preventDefault();
};

const getClientXY = (event: MouseEvent | TouchEvent) => {
  let clientX: number;
  let clientY: number;
  if (event.type.startsWith('touch')) {
    clientY = (event as TouchEvent).touches[0].clientY;
    clientX = (event as TouchEvent).touches[0].clientX;
  } else {
    clientY = (event as MouseEvent).clientY;
    clientX = (event as MouseEvent).clientX;
  }
  return {
    clientX,
    clientY,
  };
};

const handleDragStart = (event: MouseEvent | TouchEvent) => {
  initData.dragging = true;
  initData.isClick = true;
  const { clientX, clientY } = getClientXY(event);
  if (props.direction === 'v') {
    initData.startY = clientY;
  } else {
    initData.startX = clientX;
  }
  initData.startPosition = Number.parseFloat(currentPosition.value);
  initData.newPosition = initData.startPosition;
};

const handleDragging = (event: MouseEvent | TouchEvent) => {
  if (initData.dragging) {
    initData.isClick = false;
    resetSize();
    let diff: number;
    const { clientX, clientY } = getClientXY(event);
    if (props.direction === 'v') {
      initData.currentY = clientY;
      diff = ((initData.startY - initData.currentY) / sliderSize.value) * 100;
    } else {
      initData.currentX = clientX;
      diff = ((initData.currentX - initData.startX) / sliderSize.value) * 100;
    }
    initData.newPosition = initData.startPosition + diff;
    setPosition(initData.newPosition);
  }
};

const handleDragEnd = () => {
  if (initData.dragging) {
    setTimeout(() => {
      initData.dragging = false;
      if (!initData.isClick) {
        setPosition(initData.newPosition);
      }
      emitChange();
    }, 0);
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('touchmove', handleDragging);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);
    window.removeEventListener('contextmenu', handleDragEnd);
  }
};

const clamp = (num: number, lower: number, upper: number) => {
  return Math.max(lower, Math.min(num, upper));
};

const setPosition = async (newPosition: number) => {
  if (newPosition === null || Number.isNaN(+newPosition)) {
    return;
  }

  newPosition = clamp(newPosition, 0, 100);
  const fullSteps = Math.floor((max.value - min.value) / step.value);
  const fullRangePercentage = ((fullSteps * step.value) / (max.value - min.value)) * 100;
  const threshold = fullRangePercentage + (100 - fullRangePercentage) / 2;
  let value;
  if (newPosition < fullRangePercentage) {
    const valueBetween = fullRangePercentage / fullSteps;
    const steps = Math.round(newPosition / valueBetween);
    value = min.value + steps * step.value;
  } else if (newPosition < threshold) {
    value = min.value + fullSteps * step.value;
  } else {
    value = max.value;
  }
  value = Number.parseFloat(value.toFixed());

  if (value !== props.modelValue) {
    emit('update:modelValue', value);
  }

  if (!initData.dragging && props.modelValue !== initData.oldValue) {
    initData.oldValue = props.modelValue;
  }
};

watch(
  () => initData.dragging,
  (val) => {
    updateDragging(val);
  },
);

onMounted(() => {
  button.value?.addEventListener('touchstart', onButtonDown, { passive: false });
});

onUnmounted(() => {
  button.value?.removeEventListener('touchstart', onButtonDown);
});

defineExpose({
  onButtonDown,
  onKeyDown,
  setPosition,
  hovering,
  dragging,
});
</script>

<template>
  <div
    ref="button"
    class="o-slider-btn-wrap"
    :class="{ 'o-slider-btn-wrap-hover': showToolTip && !props.showSolidCircle && !disabled }"
    :style="wrapperStyle"
    :tabindex="disabled ? undefined : 0"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown="onKeyDown"
  >
    <div class="o-slider-btn" :class="{ 'o-slider-btn-hover': showToolTip && !props.showSolidCircle && !disabled }">
      <div v-if="props.showSolidCircle" class="o-slider-circle"></div>
    </div>
  </div>

  <OPopover
    v-if="showPopover"
    trigger="none"
    :position="props.position"
    :visible="showToolTip && !disabled"
    :adjust-width="false"
    :adjust-min-width="false"
    :target="button"
    :wrapper="button"
    :wrap-class="mergeClass('o-slider-popover', props.wrapClass)"
  >
    {{ formatValue }}
  </OPopover>
</template>
