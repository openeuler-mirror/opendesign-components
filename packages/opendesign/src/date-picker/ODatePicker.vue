<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defaultSize } from '../_utils/global';
import { datePickerProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { OInput } from '../input';

const props = defineProps(datePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'clear', evt: Event): void;
}>();

const round = getRoundClass(props, 'textarea');

const value1 = ref<string>('');
</script>
<template>
  <label
    class="o-date-picker"
    :class="[
      `o-date-picker-${props.color}`,
      `o-date-picker-${props.variant}`,
      `o-date-picker-size-${props.size || defaultSize}`,
      {
        'o-date-picker-disabled': props.disabled,
      },
      round.class.value,
    ]"
    :style="round.style.value"
  >
    <div class="o-date-picker-wrap">
      <div class="o-date-picker-input1">
        <input v-model="value1" type="text" />
      </div>
    </div>
  </label>
</template>
