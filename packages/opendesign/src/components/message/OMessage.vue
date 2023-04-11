<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { messageProps } from './types';
import { IconAlert, IconError, IconPoint, IconSuccess } from '../icon';

const props = defineProps(messageProps);

const iconMap = {
  normal: IconPoint,
  primary: IconPoint,
  success: IconSuccess,
  warning: IconAlert,
  danger: IconError,
};

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const icon = computed(() => iconMap[props.color]);

let timer = 0;

const clearTimer = () => {
  if (timer) {
    window.clearTimeout(timer);
    timer = 0;
  }
};

const startTimer = () => {
  if (props.duration <= 0) {
    return;
  }

  timer = window.setTimeout(() => {
    emits('close');
    clearTimer();
  }, props.duration);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div class="o-message" :class="[`o-message-${props.color}`]" @mouseenter="clearTimer" @mouseleave="startTimer">
    <span class="o-message-icon">
      <component :is="icon" />
    </span>
    <span class="o-message-label">{{ props.content }}</span>
  </div>
</template>
