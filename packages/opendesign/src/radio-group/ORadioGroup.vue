<script lang="ts" setup>
import { provide, ref, toRef, watch, inject } from 'vue';
import { radioGroupProps } from './types';
import { radioGroupInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { formItemInjectKey } from '../form/provide';

const props = defineProps(radioGroupProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

const realValue = ref(props.modelValue ?? props.defaultValue);

// 表单注入，用于规则校验
const formItemInjection = inject(formItemInjectKey, null);

watch(
  () => props.modelValue,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  }
);

const updateModelValue = (val: string | number | boolean) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean, ev: Event) => {
  emits('change', val, ev);
  formItemInjection?.fieldHandlers.onChange?.(val);
};

provide(radioGroupInjectKey, {
  realValue,
  disabled: toRef(props, 'disabled'),
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-${props.direction}`]">
    <slot></slot>
  </div>
</template>
