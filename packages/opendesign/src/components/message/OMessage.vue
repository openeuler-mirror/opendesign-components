<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { messageProps } from './types';

const props = defineProps(messageProps);

const emits = defineEmits<{
  (e: 'close'): void;
}>();

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
  <div class="o-message" :class="[`o-message-${props.color}`]" @mouseenter="clearTimer" @mouseleave="startTimer">{{ props.content }}</div>
</template>
