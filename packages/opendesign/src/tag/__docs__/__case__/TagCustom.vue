<docs lang="md">
<!-- zh-CN -->

### 自定义

<!-- en-US -->

### Custom
</docs>

<script setup lang="ts">
import { OIconAdd, OTag } from '@opensig/opendesign';
</script>

<template>
  <div class="col">
    <OTag variant="outline" class="add-icon">
      <template #icon><OIconAdd /></template>
      添加标签
    </OTag>
    <OTag variant="outline" class="custom-color">
      <template #icon><OIconAdd /></template>
      添加标签
    </OTag>
  </div>
</template>

<style scoped lang="scss">
.col {
  background-color: var(--o-color-fill2);
  padding: var(--o-r-gap-4);
}
.add-icon {
  --tag-bd: 1px dashed var(--tag-bd-color);

  .o-svg-icon {
    color: var(--o-color-info2);
  }
}
.custom-color {
  --tag-color: var(--o-color-auxiliary1);
  --tag-bd-color: var(--o-color-auxiliary1);
}
</style>
