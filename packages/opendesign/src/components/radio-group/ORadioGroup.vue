<script lang="ts" setup>
import { provide, toRefs } from 'vue';
import { radioGroupInjectKey } from './provide';
import type { RadioGroupDirectionT } from './types';

interface RadioGroupPropT {
  modelValue?: string | boolean | number;
  disabled?: boolean;
  /**
   * 单选框组方向: 'horizontal' | 'vertical'
   */
  direction?: RadioGroupDirectionT;
}

const props = withDefaults(defineProps<RadioGroupPropT>(), {
  modelValue: undefined,
  disabled: false,
  direction: 'horizontal',
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

const { modelValue, disabled } = toRefs(props);

const onChange = (val: string | number | boolean) => {
  emits('update:modelValue', val);
  emits('change', val);
};

provide(radioGroupInjectKey, { modelValue, disabled, onChange });
</script>

<template>
  <div class="o-radio-group" :class="[`is-${props.direction}`]">
    <slot></slot>
  </div>
</template>
