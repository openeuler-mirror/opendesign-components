<docs lang="md">
<!-- zh-CN -->

### 自定义页签头

<!-- en-US -->

### Custom Tab Header
</docs>
<script setup lang="ts">
import { OTab, OTabPane, OIcon, OIconSearch } from '@opensig/opendesign';
</script>
<template>
  <OTab>
    <template #prefix>Prefix</template>
    <template #suffix>Suffix</template>
    <OTabPane>
      <template #nav><OIcon :icon="OIconSearch" />Search</template>
      <div>Search Content</div>
    </OTabPane>
    <OTabPane label="Tab 2">
      <div>Tab 2 Content</div>
    </OTabPane>
  </OTab>
</template>
