<docs lang="md">
<!-- zh-CN -->

### 左对齐

<!-- en-US -->

### Align Left
</docs>

<script setup lang="ts"></script>

<template>
  <OTab class="my-tab">
    <OTabPane label="Tab 1">Tab content 1</OTabPane>
    <OTabPane label="Tab 2">Tab content 2</OTabPane>
    <OTabPane label="Tab 3">Tab content 3</OTabPane>
  </OTab>
</template>

<style scoped lang="scss">
.my-tab {
  --tab-nav-justify: flex-start;
}
</style>
