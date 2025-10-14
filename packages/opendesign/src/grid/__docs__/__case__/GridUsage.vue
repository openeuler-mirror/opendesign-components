<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>
<script setup lang="ts">
import { ORow, OCol } from '@opensig/opendesign';
</script>
<template>
  <ORow gap-x="16px" gap-y="12px" wrap="wrap">
    <OCol flex="33.3333%"><div class="box">1</div></OCol>
    <OCol flex="33.3333%"><div class="box">2</div></OCol>
    <OCol flex="33.3333%"><div class="box">3</div></OCol>
    <OCol flex="33.3333%"><div class="box">4</div></OCol>
    <OCol flex="33.3333%"><div class="box">5</div></OCol>
    <OCol flex="33.3333%"><div class="box">6</div></OCol>
    <OCol flex="50%"><div class="box">7</div></OCol>
    <OCol flex="50%"><div class="box">8</div></OCol>
  </ORow>
</template>
<style scoped lang="scss">
.box {
  background-color: yellowgreen;
  height: 80px;
  color: white;
  font-size: var(--o-font_size-h1);
  line-height: 80px;
  text-align: center;
}
</style>
