<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { switchProps } from './types';
import { defaultSize } from '../_shared/global';
import { getRoundClass } from '../_shared/style-class';
import { IconLoading } from '../_shared/icons';
import { isPromise, isBoolean, isUndefined } from '../_shared/is';

const props = defineProps(switchProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

const round = getRoundClass(props, 'switch');

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

const onClick = (ev: Event) => {
  isChangeable()
    .then((flag) => {
      if (flag) {
        const checked = !isChecked.value;
        _checked.value = checked;
        const val = checked ? props.checkedValue : props.uncheckedValue;
        emits('update:modelValue', val);
        emits('change', val, ev);
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
      `o-switch-${props.size || defaultSize}`,
      round.class.value,
      { 'o-switch-checked': isChecked },
      { 'o-switch-disabled': props.disabled },
      { 'o-switch-loading': props.loading },
    ]"
    :style="round.style.value"
    @click="onClick"
  >
    <div class="o-switch-wrap">
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
