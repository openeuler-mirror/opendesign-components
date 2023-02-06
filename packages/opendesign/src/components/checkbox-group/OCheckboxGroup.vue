<script lang="ts" setup>
import { computed, provide, toRefs } from 'vue';
import { checkboxGroupInjectKey } from './provide';
import type { DirectionT } from '../_shared/global';

interface CheckboxGroupPropT {
  /**
   * 多选框组双向绑定值
   */
  modelValue?: Array<string | number>;
  /**
   * 多选框组是否禁用
   */
  disabled?: boolean;
  /**
   * 多选框组方向
   * 'horizontal' | 'vertical'
   */
  direction?: DirectionT;
  /**
   * 多选框组支持选中的最小多选框数量
   */
  min?: number;
  /**
   * 多选框组支持选中的最大多选框数量
   */
  max?: number;
}

const props = withDefaults(defineProps<CheckboxGroupPropT>(), {
  modelValue: () => [],
  disabled: false,
  direction: 'horizontal',
  min: undefined,
  max: undefined,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>): void;
}>();

const { modelValue, disabled, min, max } = toRefs(props);

const isMinimum = computed(() => (min.value === undefined ? false : modelValue.value.length <= min.value));
const isMaximum = computed(() => (max.value === undefined ? false : modelValue.value.length >= max.value));

const updateModelValue = (val: Array<string | number>) => {
  emits('update:modelValue', val);
};

const onChange = (val: Array<string | number>) => {
  emits('change', val);
};

provide(checkboxGroupInjectKey, { modelValue, disabled, isMinimum, isMaximum, updateModelValue, onChange });
</script>

<template>
  <div class="o-checkbox-group" :class="`o-checkbox-group-direction-${props.direction}`">
    <slot></slot>
  </div>
</template>
