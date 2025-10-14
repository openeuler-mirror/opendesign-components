<docs lang="md">
<!-- zh-CN -->

### 响应式断点

`ORow` 组件支持在不同的视口宽度下配置不同的 `gap`，目前支持的断点有：

- `pcS`: <= 1680px
- `laptop`: <= 1440px
- `pad`: <= 1200px
- `padV`: <= 840px
- `phone`: <= 600px

`OCol` 组件支持在不同的视口宽度下配置不同的 `flex`，目前支持的断点有同 `ORow`

<!-- en-US -->

### Responsive Breakpoints

The `ORow` component supports configuring different `gap` values at different viewport widths. The currently supported breakpoints are:

- `pcS`: <= 1680px
- `laptop`: <= 1440px
- `pad`: <= 1200px
- `padV`: <= 840px
- `phone`: <= 600px

The `OCol` component supports configuring different `flex` values at different viewport widths. The currently supported breakpoints are the same as `ORow`.
</docs>
<script setup lang="ts">
import { OCol, ORow } from '@opensig/opendesign';
</script>
<template>
  <ORow gap="32px 24px" :pc-s="{ gap: '24px 20px' }" :laptop="{ gap: '20px 16px' }" :pad="{ gap: '16px 12px' }" :phone="{ gap: '24px' }" wrap="wrap">
    <OCol
      v-for="item in 10"
      :key="item"
      flex="16.666667%"
      :pc-s="{ flex: '20%' }"
      :laptop="{ flex: '25%' }"
      :pad="{ flex: '33.333333%' }"
      :phone="{ flex: '50%' }"
    >
      <div class="box">{{ item }}</div>
    </OCol>
  </ORow>
</template>
<style scoped lang="scss">
.box {
  background-color: pink;
  height: 80px;
  color: white;
  font-size: var(--o-font_size-h1);
  line-height: 80px;
  text-align: center;
}
</style>
