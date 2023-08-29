<script setup lang="ts">
import CNumberSwitch from './CNumberSwitch.vue';
</script>
<template>
  <div class="c-loading-number-icon">
    <svg viewBox="0 0 24 24" class="o-svg-icon o-rotating type-fill">
      <path
        d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 2c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z"
        opacity=".15"
      />
      <path d="M12 1c6.075 0 11 4.925 11 11a1 1 0 0 1-2 0 9 9 0 0 0-9-9 1 1 0 0 1 0-2z" />
    </svg>
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
  width: var(--loading-number-icon-size);
  height: var(--loading-number-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  --number-size: calc(var(--loading-number-icon-size) / 8);

  > * {
    margin: 0 1px;
  }
}
.c-loading-number-icon {
  width: 1em;
  height: 1em;
  font-size: var(--loading-number-icon-size);
  background-size: contain;
  display: flex;
  position: relative;
}
</style>
