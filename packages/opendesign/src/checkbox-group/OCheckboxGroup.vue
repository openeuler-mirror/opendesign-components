<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue';
import { checkboxGroupProps } from './types';
import { checkboxGroupInjectKey } from './provide';
import { isArray, isUndefined } from '../_utils/is';
import { useFormField } from '../_composables/use-form-field';

const props = defineProps(checkboxGroupProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>, ev: Event): void;
}>();

// 表单注入，用于规则校验
const { effectiveDisabled, onChange: onFormItemChange } = useFormField(props);

const realValue = ref(isArray(props.modelValue) ? props.modelValue : props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (isArray(val)) {
      realValue.value = val;
    }
  },
);

const isMinimum = computed(() => (isUndefined(props.min) ? false : realValue.value.length <= props.min));

const isMaximum = computed(() => (isUndefined(props.max) ? false : realValue.value.length >= props.max));

const updateModelValue = (val: Array<string | number>) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: Array<string | number>, ev: Event) => {
  emits('change', val, ev);
  onFormItemChange();
};

provide(checkboxGroupInjectKey, {
  realValue,
  disabled: effectiveDisabled,
  isMinimum,
  isMaximum,
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-checkbox-group" :class="`o-checkbox-group-${props.direction}`">
    <slot></slot>
  </div>
</template>
