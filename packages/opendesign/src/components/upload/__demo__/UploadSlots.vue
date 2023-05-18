<script setup lang="ts">
import { shallowRef } from 'vue';
import { OUpload, UploadFileT } from '../index';
import { OIcon } from '../../icon';
import { OIconDone, OIconStar, OIconCalendar } from '../../icon-components';
import { uploadRequest } from './upload';

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
  <h4>Slots</h4>
  <section>
    <div class="upload-item">
      <p>自定义上传区域</p>
      <OUpload :upload-request="uploadRequest" show-uploading-icon>
        <div style="width: 200px; height: 100px; background-color: #ccc; display: flex; justify-content: center; align-items: center">这是自定义上传区域</div>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>上传说明</p>
      <OUpload :upload-request="uploadRequest" show-uploading-icon>
        <template #select-extra>这是上传说明</template>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>自定义文件列表后缀图标</p>
      <OUpload multiple :upload-request="uploadRequest" show-uploading-icon>
        <template #item-suffix="{ item }">
          <OIcon class="diy-icon" :icon="OIconStar" />
          <OIcon v-if="item.status === 'finished'" class="diy-icon done" :icon="OIconDone" />
        </template>
      </OUpload>
    </div>
    <div class="upload-item">
      <p>通过slot添加文件列表前缀图标</p>
      <OUpload multiple :upload-request="uploadRequest" show-uploading-icon>
        <template #item-prefix="{ item }">
          <OIcon class="prefix-icon" :class="item.name" :icon="OIconStar" />
        </template>
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
