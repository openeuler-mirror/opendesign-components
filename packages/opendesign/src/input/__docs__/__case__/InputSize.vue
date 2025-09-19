<docs lang="md">
<!-- zh-CN -->

#### 尺寸

<!-- en-US -->

#### Size
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '@opensig/opendesign';

const placeholder = '请输入...';
const largeInputVal = ref('');
const mediumInputVal = ref('');
</script>
<template>
  <div class="demo-input-size-wrap">
    <div class="demo-input-size">
      <div class="size-label">L</div>
      <OInput v-model="largeInputVal" class="input-large" size="large" round="pill" :placeholder="placeholder" />
    </div>
    <div class="demo-input-size">
      <div class="size-label">M</div>
      <OInput v-model="mediumInputVal" class="input-medium" size="medium" round="pill" :placeholder="placeholder" />
    </div>
  </div>
</template>
<style lang="scss">
.demo-input-size-wrap {
  .demo-input-size {
    display: flex;
    &:first-child {
      margin-bottom: 16px;
    }
  }
  .size-label {
    width: 80px;
    margin-right: 24px;
    margin-bottom: 0;
  }
  .input-large {
    width: 480px;
  }
  .input-medium {
    width: 320px;
  }
}
</style>
