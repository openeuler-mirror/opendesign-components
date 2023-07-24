<script setup lang="ts">
import { provide, toRef } from 'vue';
import { breadcrumbProps } from './types';
import { breadcrumbInjectKey } from './provide';

const props = defineProps(breadcrumbProps);

provide(breadcrumbInjectKey, {
  separator: toRef(props, 'separator'),
});
</script>

<template>
  <div class="o-breadcrumb">
    <slot></slot>
  </div>
</template>
