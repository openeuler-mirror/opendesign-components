<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { messageProps } from './types';
import { OIconAlert, OIconError, OIconPoint, OIconSuccess } from '../icon-svgs';

const props = defineProps(messageProps);

const iconMap = {
  info: OIconPoint,
  success: OIconSuccess,
  warning: OIconAlert,
  danger: OIconError,
};

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const icon = computed(() => iconMap[props.status]);

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
  <div class="o-message" :class="[`o-message-${props.status}`]" @mouseenter="clearTimer" @mouseleave="startTimer">
    <span class="o-message-icon">
      <slot name="icon">
        <component :is="icon" />
      </slot>
    </span>
    <span class="o-message-label">{{ props.content }}</span>
  </div>
</template>
