<script setup lang="ts">
import CLoadingIcon from './CLoadingIcon.vue';
</script>
<template>
  <div class="c-loading-icon">
    <CLoadingIcon />
  </div>
</template>

<style lang="scss">
.c-loading-icon {
  width: var(--loading-icon-size);
  height: var(--loading-icon-size);
  background-size: contain;
  display: flex;
  > img {
    width: 100%;
  }
}
</style>
