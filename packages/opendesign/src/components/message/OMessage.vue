<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { messageProps } from './types';
import { OIconWarning, OIconDanger, OIconLoading, OIconInfo, OIconSuccess, OIconX } from '../icon-components';
import { isFunction, isUndefined } from '../_shared/is';

const props = defineProps(messageProps);

const iconMap = {
  info: OIconInfo,
  success: OIconSuccess,
  warning: OIconWarning,
  danger: OIconDanger,
  loading: OIconLoading,
};

const icon = computed(() => iconMap[props.status]);

const _visible = ref(props.defaultVisible);
const isVisible = computed(() => props.visible ?? _visible.value);

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
    _visible.value = false;
    emits('update:visible', _visible.value);
    clearTimer();
  }, props.duration);
};

const onClose = async (ev?: MouseEvent) => {
  if (isFunction(props.beforeClose)) {
    const rlt = await props.beforeClose();
    if (rlt) {
      _visible.value = false;
      emits('update:visible', _visible.value);
      emits('close', ev);
      return;
    }
  }

  _visible.value = false;
  emits('update:visible', _visible.value);
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

    <span class="o-message-label">
      <slot></slot>
    </span>

    <span v-if="props.closable" class="o-message-close" @click="onClose">
      <OIconX />
    </span>
  </div>
</template>
