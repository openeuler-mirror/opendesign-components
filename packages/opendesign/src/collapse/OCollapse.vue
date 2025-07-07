<script setup lang="ts">
import { provide, ref, computed, nextTick } from 'vue';
import { collapseProps } from './types';
import { collapseInjectKey } from './provide';
import { isArray, isArrayEqual } from '../_utils/is';

const props = defineProps(collapseProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>, evt?: Event): void;
}>();

const _innerValue = ref(props.defaultValue);
const computedValue = computed(() => {
  const value = props.modelValue ?? _innerValue.value;
  if (!isArray(value)) {
    return [value];
  }
  return value;
});

const handleItemClick = (value: string | number, e: Event) => {
  let realValue: Array<string | number> = [];
  if (props.accordion) {
    if (!computedValue.value.includes(value)) {
      realValue = [value];
    }
  } else {
    realValue = [...computedValue.value];
    const idx = realValue.indexOf(value);
    if (idx > -1) {
      realValue.splice(idx, 1);
    } else {
      realValue.push(value);
    }
  }
  _innerValue.value = realValue;
  emits('update:modelValue', realValue);
  emitChange(realValue, e);
};

const emitChange = (val: Array<string | number>, e: Event) => {
  nextTick(() => {
    if (isArrayEqual(val, computedValue.value)) {
      emits('change', computedValue.value, e);
    }
  });
};

provide(collapseInjectKey, {
  computedValue,
  handleItemClick,
});
</script>

<template>
  <div class="o-collapse">
    <slot></slot>
  </div>
</template>
