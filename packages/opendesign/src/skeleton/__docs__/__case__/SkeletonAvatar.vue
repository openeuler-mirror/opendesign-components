<docs lang="md">
  <!-- zh-CN -->

### 带头像的骨架屏

  <!-- en-US -->

### A skeleton screen with a leading figure.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
const size = ref('medium');
</script>
<template>
  <div class="demo-skeleton-avatar-wrap">
    <ORadioGroup v-model="size" class="radio-group">
      <ORadio value="large">large</ORadio>
      <ORadio value="medium">medium</ORadio>
      <ORadio value="small">small</ORadio>
      <ORadio value="mini">mini</ORadio>
    </ORadioGroup>
    <OSkeleton>
      <template #template>
        <OSkeletonAvatar :size="size" />
        <OSkeletonText :rows="4" />
      </template>
    </OSkeleton>
  </div>
</template>
<style lang="scss">
.demo-skeleton-avatar-wrap {
  .radio-group {
    margin-bottom: 24px;
  }
}
</style>
