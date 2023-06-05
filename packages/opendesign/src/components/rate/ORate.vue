<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { OPopover } from '../popover';
import { rateProps } from './types';
import { defaultSize } from '../_shared/global';
import { isArray, isUndefined } from '../_shared/is';
import ORateItem from './ORateItem.vue';

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

const showLabel = computed(() => {
  if (!isArray(props.labels)) {
    return false;
  }
  return props.labels.length === props.count;
});
</script>

<template>
  <div
    class="o-rate"
    :class="[`o-rate-${props.color}`, `o-rate-${props.size || defaultSize}`, { 'o-rate-readonly': props.readonly }]"
    @mouseleave="resetHoverIndex"
  >
    <template v-if="showLabel">
      <OPopover v-for="(item, idx) in count" :key="item" :adjust-width="false" :adjust-min-width="false" :visible="false" wrap-class="o-rate-popover">
        <template #target>
          <ORateItem
            :status="iconStatus[idx]"
            @hover="
              (isHalf) => {
                setHoverIndex(idx, isHalf);
              }
            "
            @change="
              (isHalf) => {
                setValue(idx, isHalf);
              }
            "
          >
            <slot name="icon" :index="idx" :status="iconStatus[idx]"> </slot>
          </ORateItem>
        </template>
        <span>{{ labels && labels[idx] }}</span>
      </OPopover>
    </template>

    <template v-else>
      <ORateItem
        v-for="(item, idx) in count"
        :key="item"
        :index="idx"
        :status="iconStatus[idx]"
        @hover="
          (isHalf) => {
            setHoverIndex(idx, isHalf);
          }
        "
        @change="
          (isHalf) => {
            setValue(idx, isHalf);
          }
        "
      >
        <slot name="icon" :index="idx" :status="iconStatus[idx]"> </slot>
      </ORateItem>
    </template>
  </div>
</template>
