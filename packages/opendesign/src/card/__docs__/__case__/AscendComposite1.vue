<docs lang="md">
<!-- zh-CN -->

#### 复合卡片

昇腾主题文本按钮有特殊的交互效果：

参考：[文本按钮](/zh-CN/components/button?__skin=a#文本按钮（无背景，无线框）)

<!-- en-US -->

#### Composite Cards

The Ascend theme provides special interaction effects for text buttons:

Reference: [Text Button](/en-US/components/button?__skin=a#text-buttons(no-background,no-border))
</docs>
<script setup lang="ts">
import { OCard, OLink } from '@opensig/opendesign';
</script>
<template>
  <OCard title="Composite card title" detail="Composite card detail" cover="/card-cover.jpg" class="c-card-kunpeng composite-image-card">
    <template #footer>
      <OLink tag="span" hover-underline class="row-item c-link-ascend"
        >Text Button<template #suffix><OIconChevronRight /></template
      ></OLink>
      <OLink hover-underline class="row-item c-link-ascend"
        >Text Arrow Button<template #suffix><div class="c-link-ascend-arrow"></div></template
      ></OLink>
    </template>
  </OCard>
</template>
<style lang="scss" scoped>
.composite-image-card {
  max-width: 360px;
}
.row-item + .row-item {
  margin-left: 16px;
}
</style>
