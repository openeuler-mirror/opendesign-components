<docs lang="md">
<!-- zh-CN -->

### 横向滚动条

<!-- en-US -->

### Horizontal scroll bar
</docs>
<script setup lang="ts">
import { ref } from 'vue';
const container1 = ref();
const container2 = ref();
</script>
<template>
  <div class="demo-scrollbar-h-wrapper">
    <div class="container" ref="container1">
      <div class="section"></div>
    </div>
    <OScrollbar :target="container1" :disabledY="true" size="medium" show-type="always" />
  </div>
  <div class="demo-scrollbar-h-wrapper">
    <div class="container" ref="container2">
      <div class="section"></div>
    </div>
    <OScrollbar :target="container2" :disabledY="true" size="small" show-type="always" />
  </div>
</template>
<style lang="scss">
.demo-scrollbar-h-wrapper {
  position: relative;
  margin-bottom: 24px;
  width: 240px;
  .container {
    height: 30px;
    overflow: auto;
  }
  .section {
    width: 200%;
  }
}
</style>
