<script setup lang="ts">
import CNumberSwitch from './CNumberSwitch.vue';
import CLoadingIcon from './CLoadingIcon.vue';
</script>
<template>
  <div class="c-loading-icon">
    <CLoadingIcon />
    <div class="c-loading-numbers">
      <CNumberSwitch />
      <CNumberSwitch />
      <CNumberSwitch />
      <CNumberSwitch />
    </div>
  </div>
</template>
<style lang="scss">
.c-loading-numbers {
  position: absolute;
  width: var(--loading-icon-size);
  height: var(--loading-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  --number-size: calc(var(--loading-icon-size) / 8);
  > * {
    margin: 0 1px;
  }
}
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
