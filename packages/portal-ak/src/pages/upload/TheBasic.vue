<script setup lang="ts">
import { onAfterSelect, uploadRequest, onBeforeUpload } from './upload';
import { OUpload, UploadFileT } from '@components/index';

const defaultFileList2: UploadFileT[] = [
  {
    id: '1',
    name: 'test.png',
    status: 'finished',
  },
  {
    id: '2',
    name: 'test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2.png',
    status: 'failed',
    message: '上传失败',
  },
];

const onChange = (f: UploadFileT[]) => {
  const r = f.map((item) => `${item.name}:${item.status}`);
  console.log(r.join(', '));
};
</script>
<template>
  <h4>单文件上传</h4>
  <OUpload :on-after-select="onAfterSelect" :upload-request="uploadRequest" btn-label="上传(单选)" color="normal" variant="solid">
    <template #select-extra><div>只能上传doc、xlsm、pptx文件格式，且文件最大不超过1M</div></template>
  </OUpload>
  <h4>多文件上传</h4>
  <OUpload
    multiple
    btn-label="上传(多选)"
    :default-file-list="defaultFileList2"
    :on-after-select="onAfterSelect"
    :upload-request="uploadRequest"
    :on-before-upload="onBeforeUpload"
    @change="onChange"
  >
    <template #select-extra><div>只能上传doc、xlsm、pptx文件格式，且文件最大不超过1M</div></template>
  </OUpload>
  <h4>图片上传</h4>
  <OUpload multiple :on-after-select="onAfterSelect" :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" list-type="picture-card" />
  <h4>拖拽上传</h4>
  <OUpload multiple :on-after-select="onAfterSelect" :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" color="primary" draggable>
    <template #select-drag-extra><div>请不要上传个人敏感数据, 只能上传doc、xlsm、pptx文件格式，且文件最大不超过1M</div></template>
  </OUpload>
</template>
<style lang="scss" scoped></style>
