<docs lang="md">
<!-- zh-CN -->

#### 仅数字输入

通过 `only-numeric-input` 限制输入框仅接收数字字符（可包含负号 `-` 与小数点 `.`）。普通文本输入不受该属性影响，可自由输入任意字符。

<!-- en-US -->

#### Numeric Input Only

Restrict the input to accept only numeric characters (including `-` and `.`) via `only-numeric-input`. Regular text input is not affected and accepts any character.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '@opensig/opendesign';

const numericVal = ref('');
const textVal = ref('');
</script>
<template>
  <div class="demo-input-only-numeric-wrap">
    <div class="demo-row">
      <div class="demo-label">仅数字输入</div>
      <OInput v-model="numericVal" only-numeric-input clearable placeholder="可输入 -、数字与小数点，如 -1.5" />
      <div class="demo-extra">当前值：{{ numericVal || '空' }}</div>
    </div>
    <div class="demo-row">
      <div class="demo-label">普通文本输入</div>
      <OInput v-model="textVal" clearable placeholder="可输入任意字符，如 a..b" />
      <div class="demo-extra">当前值：{{ textVal || '空' }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.demo-input-only-numeric-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .demo-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .demo-label {
    font-size: var(--o-font_size-text1, 14px);
    line-height: var(--o-line_height-text1, 20px);
    color: var(--o-color-info1);
  }

  .demo-extra {
    font-size: var(--o-font_size-text2, 12px);
    line-height: var(--o-line_height-text2, 18px);
    color: var(--o-color-info3);
  }
}
</style>
