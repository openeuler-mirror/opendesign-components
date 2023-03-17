<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { rateProps } from './types';
import { defaultSize } from '../_shared/global';
import { IconStar } from '../icons';
import { isUndefined } from '../_shared/is';

const props = defineProps(rateProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'change', val: number): void;
}>();

const realValue = ref(props.modelValue ?? props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  }
);

const hoverIndex = ref(-1);

const setHoverIndex = (index: number, isTopIcon: boolean) => {
  if (props.readonly) {
    return;
  }

  hoverIndex.value = props.allowHalf && isTopIcon ? index + 0.5 : index + 1;
};

const resetHoverIndex = () => {
  hoverIndex.value = -1;
};

const setValue = (index: number, isTopIcon: boolean) => {
  if (props.readonly) {
    return;
  }

  if (props.clearable && realValue.value === hoverIndex.value) {
    resetHoverIndex();
    realValue.value = 0;
    emits('update:modelValue', 0);
    emits('change', 0);
  } else {
    hoverIndex.value = props.allowHalf && isTopIcon ? index + 0.5 : index + 1;
    realValue.value = hoverIndex.value;
    emits('update:modelValue', hoverIndex.value);
    emits('change', hoverIndex.value);
  }
};

// 记录图标状态
const iconStatus = computed(() => {
  const statusArr = new Array(props.count).fill('');
  for (let i = 0; i < props.count; i++) {
    const val = hoverIndex.value === -1 ? realValue.value ?? -1 : hoverIndex.value;

    if (!props.allowHalf) {
      if (i + 1 <= val) {
        statusArr[i] = 'full';
      }
    } else {
      if (i + 1 <= Math.floor(val)) {
        statusArr[i] = 'full';
      } else if (i + 1 === Math.ceil(val)) {
        statusArr[i] = 'half';
      }
    }
  }
  return statusArr;
});
</script>

<template>
  <div class="o-rate" :class="[`o-rate-${props.color}`, `o-rate-${props.size || defaultSize}`]" @mouseleave="resetHoverIndex">
    <div
      v-for="(item, key) in count"
      :key="key"
      class="o-rate-item"
      :class="{ 'is-full-active': iconStatus[key] === 'full', 'is-half-active': iconStatus[key] === 'half' }"
    >
      <span class="o-rate-icon o-rate-icon-top" @mouseenter="setHoverIndex(key, true)" @click="setValue(key, true)">
        <slot name="icon">
          <IconStar />
        </slot>
      </span>
      <span class="o-rate-icon o-rate-icon-bottom" @mouseenter="setHoverIndex(key, false)" @click="setValue(key, false)">
        <slot name="icon">
          <IconStar />
        </slot>
      </span>
    </div>
  </div>
</template>
