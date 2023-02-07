<script lang="ts" setup>
import { provide, toRefs } from 'vue';
import { radioGroupInjectKey } from './provide';
import type { DirectionT } from '../_shared/global';

interface RadioGroupPropT {
  /**
   * 单选框组双向绑定值
   */
  modelValue?: string | boolean | number;
  /**
   * 单选框组是否禁用
   */
  disabled?: boolean;
  /**
   * 单选框组方向
   * 'horizontal' | 'vertical'
   */
  direction?: DirectionT;
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

const updateModelValue = (val: string | number | boolean) => {
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean) => {
  emits('change', val);
};

provide(radioGroupInjectKey, { modelValue, disabled, updateModelValue, onChange });
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-direction-${props.direction}`]">
    <slot></slot>
  </div>
</template>
