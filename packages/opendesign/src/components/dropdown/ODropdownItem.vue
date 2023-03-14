<script setup lang="ts">
import { inject } from 'vue';
import { dropdownInjectKey } from './provide';
import { dropdownItemProps } from './types';

const props = defineProps(dropdownItemProps);
const dropdownInjection = inject(dropdownInjectKey, null);

const onItemClick = () => {
  console.log(1);
  if (props.disabled) {
    return;
  }

  dropdownInjection?.updateVisible(false);
};
</script>

<template>
  <li class="o-dropdown-item" :class="{ 'o-dropdown-disabled': props.disabled }" @click="onItemClick">
    <slot>{{ props.label || `${props.value}` }}</slot>
  </li>
</template>

<style lang="scss"></style>
