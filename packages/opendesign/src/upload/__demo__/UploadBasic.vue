<script setup lang="ts">
import { ref } from 'vue';
import { OUpload, UploadFileT } from '../index';
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

const defaultFileList: UploadFileT[] = [
  {
    id: '1',
    name: 'test.png',
    status: 'finished',
  },
];

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

const onProgress = (f: UploadFileT) => {
  console.log(f.name, f.percent);
};

const onChange = (f: UploadFileT[]) => {
  const r = f.map((item) => `${item.name}:${item.status}`);
  console.log(r.join(', '));
};
const onSelect = (f: UploadFileT[]) => {
  const r = f.map((item) => `${item.name}:${item.status}`);
  console.log(r.join(', '));
};
</script>
<template>
  <h4>Basic</h4>
  <section style="flex-wrap: wrap; align-items: flex-start">
    <div class="upload-item">
      <OUpload
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        btn-label="上传(单选)"
        :btn-props="{ size: 'large' }"
        color="normal"
        variant="solid"
        accept=".docx,.xlsx,.xls,.doc,.pdf"
      />
    </div>
    <div class="upload-item">
      <OUpload
        multiple
        btn-label="上传(多选)"
        accept=".jpg,.png,.svg"
        :default-file-list="defaultFileList2"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
        @select="onSelect"
        @change="onChange"
      />
    </div>
    <div class="upload-item">
      <OUpload
        multiple
        btn-label="上传(多选)"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
        color="primary"
      />
    </div>
    <div class="upload-item">
      <OUpload
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        btn-label="上传(单选)"
        :default-file-list="defaultFileList"
        disabled
        @select="onSelect"
        @progress="onProgress"
      />
    </div>
    <div class="upload-item">
      <OUpload multiple :on-after-select="onAfterSelect" :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" color="primary" draggable>
        <template #select-drag-extra><div>请不要上传个人敏感数据</div></template>
      </OUpload>
    </div>
    <div class="upload-item">
      <OUpload multiple :on-after-select="onAfterSelect" :upload-request="uploadRequest" :on-before-upload="onBeforeUpload" list-type="picture-card" />
    </div>
  </section>
  <section style="flex-wrap: wrap; align-items: flex-start">
    <div class="upload-item">
      <p>无进度上传</p>
      <OUpload
        multiple
        btn-label="上传(多选)"
        :on-after-select="onAfterSelect"
        :upload-request="(e) => uploadRequest(e, false)"
        :on-before-upload="onBeforeUpload"
      />
    </div>

    <div class="upload-item">
      <p>无进度上传</p>
      <OUpload
        multiple
        :on-after-select="onAfterSelect"
        :upload-request="(e) => uploadRequest(e, false)"
        :on-before-upload="onBeforeUpload"
        list-type="picture-card"
      />
    </div>
    <div class="upload-item">
      <p>延迟上传</p>
      <OButton class="btn" @click="doUpload">开始上传</OButton>
      <OUpload ref="uploadRef" multiple :upload-request="uploadRequest" lazy-upload btn-label="选择文件" />
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
