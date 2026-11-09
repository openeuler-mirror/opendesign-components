<script lang="ts" setup>
import { skeletonTextProps } from './types';

const props = defineProps(skeletonTextProps);
</script>

<template>
  <ul class="o-skeleton-item o-skeleton-text" aria-hidden="true">
    <li v-for="item in props.rows" :key="item" class="o-skeleton-line"></li>
  </ul>
</template>
