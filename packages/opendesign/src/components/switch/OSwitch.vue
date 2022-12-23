<script setup lang="ts">
import { isPromise } from '@vue/shared';

import { defaultSize, defaultShape } from '../_shared/global';
import { SwitchSizeT, SwitchShapeT } from './types';
import { IconLoading } from '../icons';

interface PropT {
  size?: SwitchSizeT;
  shape?: SwitchShapeT;
  modelValue?: boolean;
  disabled?: boolean;
  loading?: boolean;
  beforeChange?: (val: boolean) => Promise<boolean> | boolean;
}

const props = withDefaults(defineProps<PropT>(), {
  size: defaultSize.value,
  shape: defaultShape.value,
  modelValue: false,
  disabled: false,
  loading: false,
  beforeChange: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean, ev: MouseEvent): void;
  (e: 'change', val: boolean, ev: MouseEvent): void;
}>();

const isExpectType = (res: unknown) => {
  return isPromise(res) || typeof res === 'boolean';
};

const isChangeable = () => {
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
  return typeof res === 'boolean' ? Promise.resolve(res) : res;
};

const onClick = (ev: MouseEvent) => {
  isChangeable()
    .then((flag) => {
      if (flag) {
        const val = !props.modelValue;
        emit('update:modelValue', val, ev);
        emit('change', val, ev);
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
      `o-switch-size-${props.size}`,
      `o-switch-shape-${props.shape}`,
      { 'is-checked': props.modelValue },
      { 'is-disabled': props.disabled },
      { 'is-loading': props.loading },
    ]"
    @click="onClick"
  >
    <div class="o-switch-wrapper">
      <div class="o-switch-handler">
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
