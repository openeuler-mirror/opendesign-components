<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { isFunction, isUndefined } from '../_utils/is';
import { toastProps, Duration } from './types';

const props = defineProps(toastProps);

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

const onClose = async (ev: MouseEvent) => {
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
  <div v-if="isVisible" class="o-toast">
    <slot>{{ message }}</slot>
  </div>
</template>
