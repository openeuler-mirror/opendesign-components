<script setup lang="ts">
import { iconProps } from './types';
const props = defineProps(iconProps);
</script>
<template>
  <div class="o-icon">
    <slot>
      <component :is="props.icon" />
    </slot>
  </div>
</template>
