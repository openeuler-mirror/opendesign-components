<docs lang="md">
  <!-- zh-CN -->

#### 数字输入框

  <!-- en-US -->

#### Digital input box
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInputNumber } from '@opensig/opendesign';

const inputVal = ref();
const placeholder = '1~100';
</script>
<template>
  <div class="demo-input-number-wrap">
    <OInputNumber
      v-model="inputVal"
      :min="1"
      :max="100"
      :max-length="3"
      :input-on-outlimit="false"
      :placeholder="placeholder"
      show-length="none"
      controls="none"
      class="demo-input-number"
    >
    </OInputNumber>
    <span class="input-unit"> Mbite </span>
  </div>
</template>
<style lang="scss" scoped>
.demo-input-number {
  --_input-text-align: center;
  max-width: 82px;
}
.input-unit {
  margin-left: 8px;
  color: var(--o-color-info1);
}
</style>
