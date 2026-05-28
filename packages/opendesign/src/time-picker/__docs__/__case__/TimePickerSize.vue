<docs lang="md">
<!-- zh-CN -->

### 尺寸

<!-- en-US -->

### Size
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OTimePicker } from '@opensig/opendesign';

const val1 = ref('12:13:14');
</script>
<template>
  <div class="demo-time-picker-size-wrap">
    <div class="demo-time-picker-size">
      <span class="demo-label">L</span>
      <OTimePicker v-model="val1" size="large" clearable />
    </div>
    <div class="demo-time-picker-size">
      <span class="demo-label">M</span>
      <OTimePicker v-model="val1" size="medium" clearable />
    </div>
    <div class="demo-time-picker-size">
      <span class="demo-label">S</span>
      <OTimePicker v-model="val1" size="small" clearable />
    </div>
  </div>
</template>
<style lang="scss">
.demo-time-picker-size-wrap {
  .demo-time-picker-size {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .demo-label {
    flex-shrink: 0;
    width: 20px;
    margin-right: 16px;
    font-size: 16px;
  }
}
</style>
