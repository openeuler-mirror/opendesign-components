<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { optionProps } from './types';

const props = defineProps(optionProps);

const selectInject = inject(selectOptionInjectKey, null);

const currentVal = computed(() => {
  if (selectInject) {
    return selectInject.value.value;
  }
  return '';
});

watch(
  () => currentVal.value,
  (v) => {
    if (props.value === v) {
      if (selectInject) {
        // 初始化select的值、相应modelValue变化
        selectInject.update(
          {
            label: props.label || `${props.value}`,
            value: props.value,
          },
          false
        );
      }
    }
  },
  { immediate: true }
);

const clickOption = () => {
  if (!props.disabled) {
    if (selectInject) {
      selectInject.update(
        {
          label: props.label || `${props.value}`,
          value: props.value,
        },
        true
      );
    }
  }
};
</script>
<template>
  <div
    class="o-option"
    :class="[
      {
        active: currentVal === props.value,
        'o-option-disabled': props.disabled,
      },
    ]"
    @click="clickOption"
  >
    <slot>{{ props.label || `${props.value}` }}</slot>
  </div>
</template>
