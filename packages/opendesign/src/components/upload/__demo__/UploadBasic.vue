<script setup lang="ts">
import { ref } from 'vue';
import { OUpload } from '../index';
import { OButton } from '../../button';
import '../../button/style';
import { onAfterSelect, uploadRequest, onBeforeUpload, onBeforeRemove } from './upload';

const uploadRef = ref<InstanceType<typeof OUpload> | null>(null);
const doUpload = () => {
  uploadRef.value?.upload()?.then((res) => {
    const s = res.filter((item) => item.status === 'finished');
    const f = res.filter((item) => item.status === 'failed');
    console.log('Success:', s.map((item) => item.name).join(', '));
    console.log('Failed', f.map((item) => item.name).join(', '));
  });
};
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
      <p>无进度上传</p>
      <OUpload
        multiple
        select-label="上传(多选)"
        :on-after-select="onAfterSelect"
        :upload-request="(e) => uploadRequest(e, false)"
        :on-before-upload="onBeforeUpload"
      />
    </div>
    <div class="upload-item">
      <p>延迟上传</p>
      <OButton class="btn" @click="doUpload">开始上传</OButton>
      <OUpload ref="uploadRef" multiple :upload-request="uploadRequest" lazy-upload select-label="选择文件" />
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
.btn {
  margin-bottom: 8px;
}
</style>
