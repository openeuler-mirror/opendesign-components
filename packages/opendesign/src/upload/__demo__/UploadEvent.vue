<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { OUpload, UploadFileT } from '../index';
import { onAfterSelect, uploadRequest, onBeforeUpload } from './upload';

const imgs = [
  '//soft.uesou.cn/statics/images/landpage122/type1/8.jpg',
  '//soft.uesou.cn/statics/images/landpage122/type1/3.jpg',
  '//soft.uesou.cn/statics/images/landpage122/type1/2.jpg',
];

const fileList = ref<UploadFileT[]>([
  {
    id: '1',
    name: 'test.png',
    status: 'finished',
    imgUrl: imgs[0],
  },
  {
    id: '2',
    name: 'test2.png',
    status: 'failed',
    message: '上传失败',
  }, {
    id: '3',
    name: 'test3.png',
    status: 'finished',
    imgUrl: imgs[2],
  },
]);
const uploadRef = useTemplateRef('uploadRef');

const onProgress = (f: UploadFileT) => {
  console.log(f.name, f.percent);
};
const onSuccess = (v: UploadFileT) => {
  console.log('onSuccess', v);
};
const onError = (v: UploadFileT) => {
  console.log('onError', v);
};
const onItemRemove = (v: UploadFileT) => {
  console.log('onItemRemove', v );
};
const onItemClick = (v: UploadFileT, evt:Event) => {
  console.log('onItemClick', evt, v );
  uploadRef.value?.previewItemById(v.id);
};
const onItemRetry = (v: UploadFileT) => {
  console.log('onItemRetry', v );
};
const onItemReplace = (v: UploadFileT) => {
  console.log('onItemReplace', v );
};
const onItemPreview = (v: UploadFileT) => {
  console.log('onItemPreview', v );
};

const onChange = (f: UploadFileT[]) => {
  const r = f.map((item) => `${item.name}:${item.status}`);
  console.log(r.join(', '));
  console.log('onChange', fileList.value);
};
const onSelect = (f: UploadFileT[]) => {
  const r = f.map((item) => `${item.name}:${item.status}`);
  console.log(r.join(', '));
  console.log('onSelect', fileList.value);
};


</script>
<template>
  <h4>Event</h4>
  <p>上传成功率85%  上传时间：10秒</p>
  <section style="flex-wrap: wrap; align-items: flex-start">
    <div class="upload-item">
      <OUpload
        multiple
        btn-label="上传(多选)"
        accept=".jpg,.png,.svg"
        v-model="fileList"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
        @select="onSelect"
        @change="onChange"
        @progress="onProgress"
        @success="onSuccess"
        @error="onError"
        @item-remove="onItemRemove"
        @item-retry="onItemRetry"
        @item-replace="onItemReplace"
        @item-click="onItemClick"
      />
    </div>
    <div class="upload-item">
      <OUpload
        multiple
        btn-label="上传(多选)"
        accept=".jpg,.png,.svg"
        v-model="fileList"
        list-type="picture"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
        ref="uploadRef"
        @select="onSelect"
        @change="onChange"
        @progress="onProgress"
        @success="onSuccess"
        @error="onError"
        @item-remove="onItemRemove"
        @item-retry="onItemRetry"
        @item-replace="onItemReplace"
        @item-click="onItemClick"
      />
    </div>
    <div class="upload-item">
      <OUpload
        multiple
        btn-label="上传(多选)"
        accept=".jpg,.png,.svg"
        v-model="fileList"
        list-type="picture-card"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
        @select="onSelect"
        @change="onChange"
        @progress="onProgress"
        @success="onSuccess"
        @error="onError"
        @item-remove="onItemRemove"
        @item-retry="onItemRetry"
        @item-replace="onItemReplace"
        @item-preview="onItemPreview"
        @item-click="onItemClick"
      />
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
