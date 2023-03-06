<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { switchProps } from './types';
import { defaultSize, defaultShape } from '../_shared/global';
import { IconLoading } from '../_shared/icons';
import { isPromise, isBoolean, isUndefined } from '../_shared/is';

const props = defineProps(switchProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean): void;
}>();

// 是否选中
const _checked = ref(props.defaultChecked);
const isChecked = computed(() => {
  if (!isUndefined(props.modelValue)) {
    return props.checkedValue === props.modelValue;
  }

  return _checked.value;
});

watch(
  isChecked,
  (val) => {
    _checked.value = val;
  },
  { immediate: true }
);

const isChangeable = (): Promise<boolean> => {
  if (props.loading || props.disabled) {
    return Promise.resolve(false);
  }

  if (!props.beforeChange) {
    return Promise.resolve(true);
  }

  const res = props.beforeChange(!isChecked.value);
  if (!(isPromise(res) || isBoolean(res))) {
    return Promise.reject('beforeChange should return  type `Promise<boolean>` or `boolean`');
  }

  return isBoolean(res) ? Promise.resolve(res) : res;
};

const onClick = () => {
  isChangeable()
    .then((flag) => {
      if (flag) {
        const checked = !isChecked.value;
        _checked.value = checked;
        const val = checked ? props.checkedValue : props.uncheckedValue;
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
      { 'is-checked': isChecked },
      { 'is-disabled': props.disabled },
      { 'is-loading': props.loading },
    ]"
    @click="onClick"
  >
    <div class="o-switch-wrapper">
      <div class="o-switch-handler">
        <span v-if="props.loading" class="o-switch-icon-loading o-rotating">
          <IconLoading />
        </span>
      </div>
      <div v-if="$slots.on || $slots.off" class="o-switch-content">
        <slot v-if="isChecked" name="on"></slot>
        <slot v-else name="off"></slot>
      </div>
    </div>
  </div>
</template>
