<script setup lang="ts">
import { OScrollbar } from '../index';
</script>
<template>
  <h4>resize observer</h4>

  <div class="container native">
    <div class="section">1</div>
    <div class="section">2</div>
    <div class="section">3</div>
  </div>

  <OScrollbar class="container">
    <div class="section">1</div>
    <div class="section">2</div>
    <div class="section">3</div>
  </OScrollbar>
</template>
<style lang="scss" scoped>
.container {
  width: 300px;
  height: 300px;
  border: 4px solid red;
}
.native {
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.section {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid blue;
}
</style>
