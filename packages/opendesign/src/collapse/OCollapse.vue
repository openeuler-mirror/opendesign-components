<script setup lang="ts">
import { provide, ref, computed, nextTick } from 'vue';
import { collapseProps } from './types';
import { collapseInjectKey } from './provide';
import { isArray, isArrayEqual } from '../_utils/is';

const props = defineProps(collapseProps);

const emits = defineEmits<{
  /**
   * @zh-CN 折叠面板选中值变化时触发
   * @en-US Triggered when the collapse selected value changes
   */
  (e: 'update:modelValue', val: Array<string | number>): void;
  /**
   * @zh-CN 折叠面板展开/折叠时触发
   * @en-US Triggered when a collapse panel is expanded or collapsed
   */
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

const emitChange = (val: Array<string | number>, e: Event) => {
  nextTick(() => {
    if (isArrayEqual(val, computedValue.value)) {
      emits('change', computedValue.value, e);
    }
  });
};

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
