<script setup lang="ts">
import { OScroller } from '../index';
</script>
<template>
  <h4>Scroller body</h4>
  <section class="sec">123123</section>
  <OScroller :target="" />
</template>
<style lang="scss" scoped>
.container {
  width: 300px;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
}
.native {
  overflow: auto;
}

.sec {
  height: 200vh;
}
</style>
