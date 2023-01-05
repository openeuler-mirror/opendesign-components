<script lang="ts" setup>
import { provide, toRefs } from 'vue';
import { checkboxGroupInjectKey } from './provide';
import type { CheckboxGroupDirectionT } from './types';

interface CheckboxGroupPropT {
  modelValue?: Array<string | number>;
  disabled?: boolean;
  /**
   * 多选框组方向: 'horizontal' | 'vertical'
   */
  direction?: CheckboxGroupDirectionT;
}

const props = withDefaults(defineProps<CheckboxGroupPropT>(), {
  modelValue: () => [],
  disabled: false,
  direction: 'horizontal',
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>): void;
}>();

const { modelValue, disabled } = toRefs(props);

const onChange = (val: Array<string | number>) => {
  emits('update:modelValue', val);
  emits('change', val);
};

provide(checkboxGroupInjectKey, { modelValue, disabled, onChange });
</script>

<template>
  <div class="o-checkbox-group" :class="[`is-${props.direction}`]">
    <slot></slot>
  </div>
</template>
