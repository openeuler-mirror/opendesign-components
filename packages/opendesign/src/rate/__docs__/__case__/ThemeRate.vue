<docs lang="md">
<!-- zh-CN -->

### 鲲鹏、昇腾及欧拉主题规范

可操作星星，使用 `ORate` 组件：

- 尺寸为 `L`：`size` 属性 设置为 `large`
- 颜色为红色：`color` 属性设置为 `primary`

纯展示星星，尺寸使用 `medium`，添加属性 `readonly`，通过属性 `default-value` 控制星星是实星还是空星。

<!-- en-US -->

### Kunpeng, Ascend, and Openeuler Theme Specifications

For interactive stars, use the `ORate` component:

- Size `L`: Set the `size` prop to `large`
- Color red: Set the `color` prop to `primary`

Purely display the stars, use `medium` for the size, add the attribute `readonly`, and control whether the star is a real star or an empty star through the attribute `default-value`.
</docs>
<script setup lang="ts">
import { ORate } from '@opensig/opendesign';
const labels = ['非常不满意', '不满意', ' 一般', '满意', '非常满意'];
</script>
<template>
  <div class="box">
    <ORate :default-value="1" :count="1" color="primary" size="medium" readonly />
    <span class="result">4.0</span>
  </div>
  <div class="box">
    <ORate :count="1" color="primary" size="medium" readonly />
    <span class="result">暂无评分</span>
  </div>
  <div class="box operator">
    <ORate :default-value="1" :count="5" color="primary" size="large" />
  </div>
  <div class="box operator with-tip">
    <ORate :default-value="1" :count="5" color="primary" size="large" :labels="labels" />
  </div>
</template>
<style scoped lang="scss">
.box + .box {
  margin-top: 12px;
}
.result {
  margin-left: 8px;
}
</style>
