<script lang="ts" setup>
import { provide, ref, toRefs, watch } from 'vue';
import { radioGroupInjectKey } from './provide';
import type { DirectionT } from '../_shared/global';

interface RadioGroupPropT {
  /**
   * 单选框组双向绑定值
   */
  modelValue?: string | number | boolean;
  /**
   * 非受控状态时，单选框组默认值
   */
  defaultValue?: string | number | boolean;
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
  defaultValue: '',
  disabled: false,
  direction: 'horizontal',
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

const { modelValue, disabled } = toRefs(props);

const realValue = ref(modelValue.value ?? props.defaultValue);

watch(modelValue, (val) => {
  realValue.value = val as string | number | boolean;
});

const updateModelValue = (val: string | number | boolean) => {
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean) => {
  emits('change', val);
};

provide(radioGroupInjectKey, { realValue, disabled, updateModelValue, onChange });
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-direction-${props.direction}`]">
    <slot></slot>
  </div>
</template>
