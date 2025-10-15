<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { messageProps } from './types';
import { IconWarning, IconDanger, IconLoading, IconInfo, IconSuccess, IconClose } from '../_utils/icons';
import { isFunction, isUndefined } from '../_utils/is';

const props = defineProps(messageProps);

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
    :class="[`o-message-${props.status}`, { 'o-message-colorful': props.colorful }]"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
  >
    <span class="o-message-icon">
      <slot name="icon">
        <component :is="icon" :class="{ 'o-rotating': props.status === 'loading' }" />
      </slot>
    </span>

    <span class="o-message-content">
      <slot></slot>
    </span>

    <span v-if="props.closable" class="o-message-close" @click="onClose">
      <IconClose />
    </span>
  </div>
</template>
