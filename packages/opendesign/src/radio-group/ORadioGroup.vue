<script lang="ts" setup>
import { provide, ref, watch } from 'vue';
import { radioGroupProps } from './types';
import { radioGroupInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { useFormField } from '../_composables/use-form-field';

const props = defineProps(radioGroupProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

// 表单注入，用于规则校验
const { effectiveDisabled, onChange: onFormItemChange } = useFormField(props);

const realValue = ref(props.modelValue ?? props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  },
);

const updateModelValue = (val: string | number | boolean) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean, ev: Event) => {
  emits('change', val, ev);
  onFormItemChange();
};

provide(radioGroupInjectKey, {
  realValue,
  disabled: effectiveDisabled,
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-${props.direction}`]">
    <slot></slot>
  </div>
</template>
