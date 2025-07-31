<docs lang="md">
<!--zh-CN-->
### Slots

<!--en-US-->
### Slots
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { OUpload, type UploadFileT, OIconCalendar, OButton } from '@opensig/opendesign';
import { uploadRequest } from '../../__demo__/upload';

const onAfterSelect2 = (fileList: FileList): Promise<UploadFileT[]> => {
  return Promise.resolve(
    Array.from(fileList).map((file) => {
      return {
        id: file.name,
        name: file.name,
        file: file,
        retry: false,
        icon: shallowRef(OIconCalendar),
      };
    })
  );
};
</script>
<template>
  <section>
    <div class="upload-item">
      <p>自定义上传区域</p>
      <OUpload :upload-request="uploadRequest" show-uploading-icon>
        <div style="width: 200px; height: 100px; background-color: #ccc; display: flex; justify-content: center; align-items: center">这是自定义上传区域</div>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>自定义上传按钮</p>
      <OUpload :upload-request="uploadRequest" show-uploading-icon>
        <OButton color="primary" size="large" variant="solid">这是自定义上传按钮</OButton>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>上传说明</p>
      <OUpload :upload-request="uploadRequest" show-uploading-icon>
        <template #select-extra>这是上传说明</template>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>通过自定义文件列表文件图标2</p>
      <OUpload multiple :on-after-select="onAfterSelect2" :upload-request="uploadRequest" show-uploading-icon />
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
.diy-icon {
  margin-left: 8px;
}
.prefix-icon {
  margin-right: 8px;
}
.done {
  color: green;
}
</style>
