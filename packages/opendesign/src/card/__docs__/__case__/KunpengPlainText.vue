<docs lang="md">
<!-- zh-CN -->

### 鲲鹏主题规范

可交互卡片需满足以下视觉要求：

鼠标悬停或按下时

- 文字颜色：红色（需设置`:hoverable="true"`和`cursor="pointer"`）
- 图标颜色：红色（需设置`:hoverable="true"`）
- 阴影：禁用

注意事项：

1. 必须添加`c-card-kunpeng`类名以应用主题样式
2. `OCard`具有`href`属性时默认开启文字及图标交互效果，不用再设置`:hoverable="true"`及`cursor="pointer"`属性

#### 文本卡片 & 图标卡片

<!-- en-US -->

### Kunpeng Theme Specifications

Interactive cards must meet the following visual requirements:

On hover or press:

- Text color: Red (requires setting `:hoverable="true"` and `cursor="pointer"`)
- Icon color: Red (requires setting `:hoverable="true"`)
- Shadow: Disabled

Notes:

1. The `c-card-kunpeng` class name must be added to apply theme styles
2. When the `OCard` has an `href` attribute, text and icon interaction effects are enabled by default.
   There is no need to set the `:hoverable="true"` and `cursor="pointer"` properties

#### Text Cards & Icon Cards
</docs>

<script setup lang="ts">
import { OCard, ORate, OIconTime, OIconSkill } from '@opensig/opendesign';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
</script>
<template>
  <OCard title="Text card title" detail="Text card detail" hoverable cursor="pointer" class="c-card-kunpeng">
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
  <OCard title="Icon card title" :detail="LOREM" :detail-max-row="2" :detail-row="2" :icon="OIconSkill" href="/" class="c-card-kunpeng" />
  <OCard layout="h" title="Icon card title" :detail="LOREM" :detail-max-row="2" :detail-row="2" :icon="OIconSkill" href="/" class="c-card-kunpeng" />
</template>
<style lang="scss" scoped>
.c-card-kunpeng + .c-card-kunpeng {
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
