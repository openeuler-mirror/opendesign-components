<script lang="ts" setup>
import { provide, toRefs } from 'vue';
import { radioGroupInjectKey } from './provide';
import type { RadioGroupDirectionT } from './types';

interface RadioGroupPropT {
  modelValue?: string | boolean | number;
  disabled?: boolean;
  /**
   * 单选组方向: 'horizontal' | 'vertical'
   */
  direction?: RadioGroupDirectionT;
}

const props = withDefaults(defineProps<RadioGroupPropT>(), {
  modelValue: undefined,
  disabled: false,
  direction: 'horizontal',
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

const { modelValue, disabled } = toRefs(props);

const onChange = (val: string | number | boolean) => {
  emit('update:modelValue', val);
  emit('change', val);
};

provide(radioGroupInjectKey, { modelValue, disabled, onChange });
</script>

<template>
  <div class="o-radio-group" :class="[`is-${props.direction}`]">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
