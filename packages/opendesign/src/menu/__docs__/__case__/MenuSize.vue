<docs lang="md"><!-- zh-CN -->

### 不同尺寸

**注意**：在 `small` 尺寸下

- 展开/收起图标移至左侧，并增加左侧分割线以增强层级区分。
- 不再支持自定义左侧图标（即 `icon` 属性及 `icon` 插槽无效）。

<!-- en-US -->

### Different Sizes

**Note**: In the `small` size

- The expand/collapse icon is moved to the left and a left divider is added to enhance hierarchical distinction.
- Custom left icons are no longer supported (i.e., the `icon` prop and `icon` slot are invalid).</docs>
<script setup lang="ts">
import { ref, resolveComponent, type Component } from 'vue';
import { OMenu, OSubMenu, OMenuItem } from '@opensig/opendesign';

const sizes = ['medium', 'small'] as const;
const DocIconMenu = resolveComponent('DocIconMenu') as Component;

const selected = ref('2-1');
const expanded = ref(['2', '2-2', '2-2-2']);
</script>
<template>
  <div class="menu-group">
    <OMenu v-for="size in sizes" v-model="selected" v-model:expanded="expanded" :size="size" :key="size">
      <OSubMenu :icon="DocIconMenu" value="1">
        <template #title>Sub menu 1</template>
        <OMenuItem value="1-1">Item 1-1</OMenuItem>
        <OMenuItem value="1-2">Item 1-2</OMenuItem>
      </OSubMenu>
      <OSubMenu :icon="DocIconMenu" value="2">
        <template #title>Sub menu 2</template>
        <OMenuItem value="2-1">Item 2-1</OMenuItem>
        <OSubMenu :icon="DocIconMenu" value="2-2">
          <template #title>Sub menu 2-2</template>
          <OMenuItem value="2-2-1" disabled>Item 2-2-1</OMenuItem>
          <OSubMenu :icon="DocIconMenu" value="2-2-2">
            <template #title>Sub menu 2-2-2</template>
            <OMenuItem value="2-2-2-1">Item 2-2-2-1</OMenuItem>
          </OSubMenu>
        </OSubMenu>
      </OSubMenu>
      <OMenuItem value="3">Item 3</OMenuItem>
    </OMenu>
    <OMenu v-for="size in sizes" v-model="selected" v-model:expanded="expanded" :size="size" :key="size"
      arrow-position="left">
      <OSubMenu :icon="DocIconMenu" value="1">
        <template #title>Sub menu 1</template>
        <OMenuItem value="1-1">Item 1-1</OMenuItem>
        <OMenuItem value="1-2">Item 1-2</OMenuItem>
      </OSubMenu>
      <OSubMenu :icon="DocIconMenu" value="2">
        <template #title>Sub menu 2</template>
        <OMenuItem value="2-1">Item 2-1</OMenuItem>
        <OSubMenu :icon="DocIconMenu" value="2-2">
          <template #title>Sub menu 2-2</template>
          <OMenuItem value="2-2-1" disabled>Item 2-2-1</OMenuItem>
          <OSubMenu :icon="DocIconMenu" value="2-2-2">
            <template #title>Sub menu 2-2-2</template>
            <OMenuItem value="2-2-2-1">Item 2-2-2-1</OMenuItem>
          </OSubMenu>
        </OSubMenu>
      </OSubMenu>
      <OMenuItem value="3">Item 3</OMenuItem>
    </OMenu>
  </div>
</template>
<style scoped lang="scss">
.menu-group {
  display: flex;
  gap: 64px;
}
</style>
