<script setup lang="ts">
import { isPromise, isBoolean } from '../_shared/is';

import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconLoading } from '../_shared/icons';

interface SwitchPropT {
  /**
   * 双向绑定值
   */
  modelValue?: boolean;
  /**
   * 开关尺寸："large" | "normal" | "small"
   */
  size?: SizeT;
  /**
   * 开关形状："normal" | "round"
   */
  shape?: ShapeT;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否加载中
   */
  loading?: boolean;
  /**
   *
   * 状态改变前的钩子函数
   */
  beforeChange?: (val: boolean) => Promise<boolean> | boolean;
}

const props = withDefaults(defineProps<SwitchPropT>(), {
  modelValue: false,
  size: undefined,
  shape: undefined,
  disabled: false,
  loading: false,
  beforeChange: undefined,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'change', val: boolean): void;
}>();

const isChangeable = (): Promise<boolean> => {
  if (props.loading || props.disabled) {
    return Promise.resolve(false);
  }

  if (!props.beforeChange) {
    return Promise.resolve(true);
  }

  const res = props.beforeChange(!props.modelValue);
  if (!(isPromise(res) || isBoolean(res))) {
    return Promise.reject('beforeChange should return  type `Promise<boolean>` or `boolean`');
  }

  return isBoolean(res) ? Promise.resolve(res) : res;
};

const onClick = () => {
  isChangeable()
    .then((flag) => {
      if (flag) {
        const val = !props.modelValue;
        emits('update:modelValue', val);
        emits('change', val);
      }
    })
    .catch((err) => {
      console.warn(`${err}`);
    });
};
</script>

<template>
  <div
    class="o-switch"
    :class="[
      `o-switch-size-${props.size || defaultSize}`,
      `o-switch-shape-${props.shape || defaultShape}`,
      { 'is-checked': props.modelValue },
      { 'is-disabled': props.disabled },
      { 'is-loading': props.loading },
    ]"
    @click="onClick"
  >
    <div class="o-switch-handler">
      <span v-if="props.loading" class="o-switch-icon_loading o-rotating">
        <IconLoading />
      </span>
    </div>
    <div v-if="$slots.on || $slots.off" class="o-switch-content">
      <slot v-if="props.modelValue" name="on"></slot>
      <slot v-else name="off"></slot>
    </div>
  </div>
</template>
