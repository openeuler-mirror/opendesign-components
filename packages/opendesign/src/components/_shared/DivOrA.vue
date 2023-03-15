<script setup lang="ts">
const props = defineProps({
  isA: {
    type: Boolean,
  },
});
</script>
<template>
  <a v-if="props.isA">
    <slot></slot>
  </a>
  <div v-else>
    <slot></slot>
  </div>
</template>
