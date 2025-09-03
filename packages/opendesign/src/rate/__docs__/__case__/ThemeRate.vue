<docs lang="md">
<!-- zh-CN -->

### 鲲鹏、昇腾及欧拉主题规范

可操作星星，使用 `ORate` 组件：

- 尺寸为 `L`：`size` 属性 设置为 `large`
- 颜色为红色：`color` 属性设置为 `primary`

纯展示星星，使用 `OIconStar` 组件：

- 尺寸为 `M`：类选择器 `c-star-full` 或 `c-star-empty` 中具有该尺寸的样式声明
- 无评分颜色为灰色：设置类名 `c-star-empty`
- 有评分颜色为红色：设置类名 `c-star-full`

<!-- en-US -->

### Kunpeng, Ascend, and Openeuler Theme Specifications

For interactive stars, use the `ORate` component:

- Size `L`: Set the `size` prop to `large`
- Color red: Set the `color` prop to `primary`

For display-only stars, use the `OIconStar` component:

- Size `M`: The class selectors `c-star-full` or `c-star-empty` contain the corresponding style declarations for this size
- No rating value (gray color): Apply the class name `c-star-empty`
- With rating value (red color): Apply the class name `c-star-full`
</docs>
<script setup lang="ts">
import { ORate, OIconStar } from '@opensig/opendesign';
const labels = ['非常不满意', '不满意', ' 一般', '满意', '非常满意'];
</script>
<template>
  <div class="box"><OIconStar class="c-star-full only-show" />4.0</div>
  <div class="box"><OIconStar class="c-star-empty only-show" />暂无评分</div>
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
.only-show {
  margin-right: 8px;
}
</style>
