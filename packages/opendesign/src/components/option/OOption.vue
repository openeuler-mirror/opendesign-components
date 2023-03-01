<script setup lang="ts">
import { computed, inject } from 'vue';
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

if (props.value === currentVal.value) {
  if (selectInject) {
    selectInject.update({
      label: props.label || `${props.value}`,
      value: props.value,
    });
  }
}

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
