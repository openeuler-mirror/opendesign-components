<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue';
import { messageProps } from './types';
import { IconWarning, IconDanger, IconLoading, IconInfo, IconSuccess, IconClose } from '../_utils/icons';
import { isFunction, isUndefined } from '../_utils/is';
import { isEmptySlot } from '../_utils/vue-utils';

const props = defineProps(messageProps);
const slots = useSlots();

const iconMap = {
  info: IconInfo.value,
  success: IconSuccess.value,
  warning: IconWarning.value,
  danger: IconDanger.value,
  loading: IconLoading.value,
};

const icon = computed(() => iconMap[props.status]);

const innerIsVisible = ref(props.visible ?? props.defaultVisible);
const isVisible = computed(() => props.visible ?? innerIsVisible.value);

const emits = defineEmits<{
  (e: 'duration-end'): void;
  (e: 'close', ev?: MouseEvent): void;
  (e: 'update:visible', val: boolean): void;
}>();

const hasTitle = computed(() => {
  return !isEmptySlot(slots.title) || props.title;
});
const hasContent = computed(() => {
  return !isEmptySlot(slots.default);
});

const isOnlyTitle = computed(() => {
  return hasTitle.value && !hasContent.value && props.colorful;
});
const isOnlyContent = computed(() => {
  return hasContent.value && !hasTitle.value && props.colorful;
});

let timer = 0;

const clearTimer = () => {
  if (timer) {
    window.clearTimeout(timer);
    timer = 0;
  }
};

const startTimer = () => {
  if (isUndefined(props.duration) || props.duration <= 0) {
    return;
  }

  timer = window.setTimeout(() => {
    emits('duration-end');
    innerIsVisible.value = false;
    emits('update:visible', innerIsVisible.value);
    clearTimer();
  }, props.duration);
};

const onClose = async (ev?: MouseEvent) => {
  ev?.stopPropagation();
  if (isFunction(props.beforeClose)) {
    const rlt = await props.beforeClose();
    if (rlt) {
      innerIsVisible.value = false;
      emits('update:visible', innerIsVisible.value);
      emits('close', ev);
      return;
    }
  }

  innerIsVisible.value = false;
  emits('update:visible', innerIsVisible.value);
  emits('close', ev);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearTimer();
});
defineExpose({
  close: onClose,
});
</script>

<template>
  <div
    v-if="isVisible"
    class="o-message"
    :class="[
      `o-message-${props.status}`,
      {
        'o-message-colorful': props.colorful,
        'o-messgage-both': hasTitle && hasContent,
        'o-message-only-title': isOnlyTitle,
        'o-message-only-content': isOnlyContent,
      },
    ]"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
  >
    <span class="o-message-icon">
      <slot name="icon">
        <component :is="icon" :class="{ 'o-rotating': props.status === 'loading' }" />
      </slot>
    </span>

    <div class="o-message-main">
      <span v-if="$slots.title || props.title" class="o-message-title">
        <slot name="title">
          {{ props.title }}
        </slot>
      </span>
      <span class="o-message-content">
        <slot></slot>
      </span>
    </div>

    <span v-if="props.closable" class="o-message-close" @click="onClose">
      <IconClose />
    </span>
  </div>
</template>
