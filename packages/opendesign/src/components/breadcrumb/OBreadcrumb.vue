<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue';
import { breadcrumbProps } from './types';
import { breadcrumbInjectKey } from './provide';

const props = defineProps(breadcrumbProps);
const { separator } = toRefs(props);

provide(
  breadcrumbInjectKey,
  reactive({
    separator,
  })
);
</script>

<template>
  <div class="o-breadcrumb">
    <slot></slot>
  </div>
</template>
