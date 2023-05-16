<script setup lang="ts">
import { OUpload } from '../index';
import { onAfterSelect, uploadRequest, onBeforeUpload, onBeforeRemove } from './upload';
</script>
<template>
  <h4>Basic</h4>
  <section style="flex-wrap: wrap; align-items: flex-start">
    <div class="upload-item">
      <OUpload :on-after-select="onAfterSelect" :upload-request="uploadRequest" select-label="上传(单选)" />
    </div>
    <div class="upload-item">
      <OUpload multiple select-label="上传(多选)" :on-after-select="onAfterSelect" :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" />
    </div>
    <div class="upload-item">
      <p>上传显示加载图标 show-uploading-icon</p>
      <OUpload multiple :upload-request="uploadRequest" show-uploading-icon />
    </div>
    <div class="upload-item">
      <p>删除前确认 onBeforeRemove</p>
      <OUpload multiple :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" :on-before-remove="onBeforeRemove" />
    </div>
  </section>
</template>
<style lang="scss" scoped>
p {
  font-size: 14px;
  margin: 16px 0 12px;
  color: var(--o-color-info2);
}
.upload-item {
  width: calc(50% - 16px);
  flex-shrink: 0;
}
</style>
