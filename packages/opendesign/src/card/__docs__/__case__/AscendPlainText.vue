<docs lang="md">
<!-- zh-CN -->

### 昇腾主题规范

可交互卡片需满足以下视觉要求：

鼠标悬停或按下时

- 阴影：设置`:hoverable="true"`
- 极光色：给 `OCard` 添加 `c-card-ascend-hover` 类名

昇腾主题中卡片圆角有 XL 和 L 两种尺寸（默认为 L 尺寸），若使用 XL 尺寸，则添加`c-card-ascend-xl-radius`类名

注意事项：`OCard`具有`href`属性时默认开启阴影效果，不用再设置`:hoverable="true"`

#### 文本卡片 & 图标卡片

<!-- en-US -->

### Ascend Theme Specifications

Interactive cards must meet the following visual requirements:

On hover or press:

- Shadow: Set `:hoverable="true"`
- Ascend Color: Add the `c-card-ascend-hover` class to `OCard`

The Ascend theme supports two border-radius sizes for cards: XL and L (default is L). To use the XL size, add the `c-card-ascend-xl-radius` class.

Note: When the `OCard` has an `href` attribute, the shadow effect is enabled by default. There is no need to set `:hoverable="true"`.

#### Text Cards & Icon Cards
</docs>

<script setup lang="ts">
import { OCard, ORate, OIconTime, OIconSkill } from '@opensig/opendesign';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
</script>
<template>
  <OCard title="Text card title" detail="Text card with XL radius" hoverable cursor="pointer" class="c-card-ascend-hover c-card-ascend-xl-radius">
    <template #footer>
      <div class="footer-box">
        <div class="left">
          <ORate color="primary" :default-value="1" readonly :count="1" />
          <span class="rate-label">4.0</span>
        </div>
        <div class="right">
          <div v-for="i in 3" :key="i" class="right-item">
            <OIconTime class="item-icon" />
            <span class="item-label">Label</span>
          </div>
        </div>
      </div>
    </template>
  </OCard>
  <OCard title="Icon card title" :detail="LOREM" :detail-max-row="2" :detail-row="2" :icon="OIconSkill" href="/" class="c-card-ascend-hover" />
  <OCard layout="h" title="Icon card title" :detail="LOREM" :detail-max-row="2" :detail-row="2" :icon="OIconSkill" href="/" class="c-card-ascend-hover" />
</template>
<style lang="scss" scoped>
.c-card-ascend-hover + .c-card-ascend-hover {
  margin-top: var(--o-gap-4);
}
.footer-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right {
  display: flex;
}
.item-icon {
  font-size: var(--o-icon_size-xs);
}
.rate-label,
.item-label {
  margin-left: var(--o-gap-2);
}
.right-item + .right-item {
  margin-left: var(--o-gap-4);
}
</style>
