<script setup lang="ts">
import { isPromise, isBoolean } from '../_shared/utils';

import { defaultSize, defaultShape } from '../_shared/global';
import type { SizeT, ShapeT } from '../_shared/global';
import { IconLoading } from '../_shared/icons';

// TODO:
// 1. props 参数注释需要补全
// 2. 增加chang事件的示例
interface SwitchPropT {
  /**
   * 开关尺寸: 'large' | 'normal' | 'small'
   */
  size?: SizeT;
  /**
   * 开关形状: 'normal' | 'round'
   */
  shape?: ShapeT;
  modelValue?: boolean;
  disabled?: boolean;
  loading?: boolean;
  beforeChange?: (val: boolean) => Promise<boolean> | boolean;
}

const props = withDefaults(defineProps<SwitchPropT>(), {
  size: undefined,
  shape: undefined,
  modelValue: false,
  disabled: false,
  loading: false,
  beforeChange: undefined,
});

const emits = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'change', val: boolean): void;
}>();
// TODO：这个函数命名太宽泛了，建议明确下如：isExpectBeforeChangeType，或者如果只在一个地方使用，就不用抽取函数了
const isExpectType = (res: unknown) => {
  return isPromise(res) || isBoolean(res);
};

const isChangeable = (): Promise<boolean> => {
  if (props.loading || props.disabled) {
    return Promise.resolve(false);
  }

  if (!props.beforeChange) {
    return Promise.resolve(true);
  }

  const res = props.beforeChange(!props.modelValue);
  if (!isExpectType(res)) {
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
    <div class="o-switch-wrapper">
      <div class="o-switch-handler">
        <!-- TODO：尽量不要使用语义不对应的标签，无语义的使用span就好了 -->
        <i v-if="props.loading" class="o-switch-icon_loading">
          <IconLoading />
        </i>
      </div>
      <div v-if="$slots.on || $slots.off" class="o-switch-content">
        <slot v-if="props.modelValue" name="on"></slot>
        <slot v-else name="off"></slot>
      </div>
    </div>
  </div>
</template>
