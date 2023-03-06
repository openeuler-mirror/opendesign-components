<script lang="ts" setup>
import { provide, ref, toRef, watch } from 'vue';
import { radioGroupProps } from './types';
import { radioGroupInjectKey } from './provide';
import { isUndefined } from '../_shared/is';

const props = defineProps(radioGroupProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

const realValue = ref(props.modelValue ?? props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  }
);

const updateModelValue = (val: string | number | boolean) => {
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean) => {
  emits('change', val);
};

provide(radioGroupInjectKey, {
  realValue,
  disabled: toRef(props, 'disabled'),
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-direction-${props.direction}`]">
    <slot></slot>
  </div>
</template>
