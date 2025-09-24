<docs lang="md">
<!-- zh-CN -->

### 纵向滚动条

<!-- en-US -->

### Vertical scroll bar
</docs>
<script setup lang="ts">
import { ref } from 'vue';
const container1 = ref();
const container2 = ref();
</script>
<template>
  <div class="demo-scrollbar-v-wrapper">
    <div class="demo-scrollbar-v">
      <div class="container" ref="container1">
        <div class="section"></div>
      </div>
      <OScrollbar :target="container1" :disabledX="true" size="medium" show-type="always" />
    </div>
    <div class="demo-scrollbar-v">
      <div class="container" ref="container2">
        <div class="section"></div>
      </div>
      <OScrollbar :target="container2" :disabledX="true" size="small" show-type="always" />
    </div>
  </div>
</template>
<style lang="scss">
.demo-scrollbar-v-wrapper {
  display: flex;
  .demo-scrollbar-v {
    position: relative;
    width: 100px;
    margin-right: 24px;
    .container {
      height: 200px;
      overflow: auto;
    }
    .section {
      height: 200%;
    }
  }
}
</style>
