<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue';

import { ODivider } from '../../divider';
import { timePickerInjectKey } from '../../time-picker/provide.ts';
import TimeColumns from '../../time-picker/components/TimeColumns.vue';

const { format } = inject(timePickerInjectKey)!;

const timeColumnsRef = ref<InstanceType<typeof TimeColumns>>();

const defaultTime = computed(() => (format.value === 'HH:mm' ? '00:00' : '00:00:00'));
const currentTimeDisplay = ref(defaultTime.value);

const getValue = () => timeColumnsRef.value?.getValue() ?? defaultTime.value;

const setValue = (value: string) => {
  currentTimeDisplay.value = value;
  if (timeColumnsRef.value) {
    timeColumnsRef.value.setValue(value);
    // 用吸附后的值更新 header，保持与列的视觉一致
    currentTimeDisplay.value = timeColumnsRef.value.getValue() || value;
  } else {
    nextTick(() => {
      timeColumnsRef.value?.setValue(value);
      if (timeColumnsRef.value) {
        currentTimeDisplay.value = timeColumnsRef.value.getValue() || value;
      }
      timeColumnsRef.value?.scrollAllToSelected(false);
    });
  }
};

const reset = () => {
  currentTimeDisplay.value = defaultTime.value;
  nextTick(() => {
    timeColumnsRef.value?.setValue(defaultTime.value);
    timeColumnsRef.value?.scrollAllToSelected(false);
  });
};

const emits = defineEmits<{
  (e: 'change'): void;
}>();

const handleTimeColumnsChange = (val: string | undefined) => {
  if (val) currentTimeDisplay.value = val;
  emits('change');
};

defineExpose({ getValue, setValue, reset });
</script>

<template>
  <div class="o-date-panel-time-aside">
    <div class="o-date-panel-header">
      <span class="o-data-panel-header-time-label">{{ currentTimeDisplay }}</span>
    </div>
    <ODivider class="o-date-panel-divider" />
    <div class="o-date-panel-time-columns">
      <div class="o-time-panel-content">
        <TimeColumns ref="timeColumnsRef" @change="handleTimeColumnsChange" />
      </div>
    </div>
  </div>
</template>
