<script setup lang="ts">
import { provide, ref, toRef, watch } from 'vue';
import { collapseProps } from './types';
import { collapseInjectKey } from './provide';
import { isArray } from '../_utils/is';

const props = defineProps(collapseProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>, ev: Event): void;
}>();

const realValue = ref(isArray(props.modelValue) ? props.modelValue : props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (isArray(val)) {
      realValue.value = val;
    }
  }
);

const updateModelValue = (val: Array<string | number>) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: Array<string | number>, ev: Event) => {
  emits('change', val, ev);
};

provide(collapseInjectKey, {
  realValue,
  accordion: toRef(props, 'accordion'),
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-collapse">
    <slot></slot>
  </div>
</template>
