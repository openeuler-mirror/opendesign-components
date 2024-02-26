<script lang="ts" setup>
import { skeletonProps } from './types';

import OSkeletonText from './OSkeletonText.vue';

const props = defineProps(skeletonProps);
</script>

<template>
  <div v-if="props.loading" :class="['o-skeleton', { 'o-skeleton-animation': props.animation }]">
    <slot name="template">
      <OSkeletonText :rows="props.rows" />
    </slot>
  </div>
  <slot v-else></slot>
</template>
