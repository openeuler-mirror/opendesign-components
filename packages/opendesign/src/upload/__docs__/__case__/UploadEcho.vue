<docs lang="md">
<!-- zh-CN -->

### 表单回显

接口返回已上传的图片信息后，将数据回填到 `list-type="picture-card"` 模式进行展示。用户可在回显基础上继续上传或删除。

两种回填方式对比：

- `v-model`（受控）：双向绑定，回显数据随用户操作实时更新，适合表单场景
- `default-file-list`（非受控）：仅初始化一次，后续由组件内部管理，适合一次性回显

<!-- en-US -->

### Form Echo

After the API returns uploaded image info, fill the data into `list-type="picture-card"` mode for display. Users can continue uploading or removing based on the echoed list.

Two ways to fill:

- `v-model` (controlled): two-way binding, echoed data updates in real time as the user interacts, suitable for form scenarios
- `default-file-list` (uncontrolled): initialized once, then managed internally by the component, suitable for one-time echo
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OUpload, OForm, OFormItem, type UploadFileT } from '@opensig/opendesign';
import { onAfterSelect, uploadRequest, onBeforeUpload } from '../../__demo__/upload';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

// 模拟接口返回的已上传图片地址（使用 dummyimage 占位图，任何环境可访问）
const imgs = ['https://dummyimage.com/120x120/4a90e2/ffffff', 'https://dummyimage.com/120x120/7b61ff/ffffff'];

// 接口返回的初始文件列表（受控）
const fileList = ref<UploadFileT[]>([
  { id: '1', name: 'fenhuo_light.png', imgUrl: imgs[0] },
  { id: '2', name: 'tongYuan.png', imgUrl: imgs[1] },
]);

// 接口返回的初始文件列表（非受控，仅初始化一次）
const defaultFileList: UploadFileT[] = [
  { id: '1', name: 'fenhuo_light.png', imgUrl: imgs[0] },
  { id: '2', name: 'tongYuan.png', imgUrl: imgs[1] },
];
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="160px">
    <OFormItem label="v-model（受控）">
      <OUpload
        v-model="fileList"
        multiple
        list-type="picture-card"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
      />
      <template #extra>
        {{ fileList.map((f) => ({ id: f.id, name: f.name, imgUrl: f.imgUrl })) }}
      </template>
    </OFormItem>
    <OFormItem label="default-file-list（非受控）">
      <OUpload
        multiple
        list-type="picture-card"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        :default-file-list="defaultFileList"
        :on-after-select="onAfterSelect"
        :upload-request="uploadRequest"
        :on-before-upload="onBeforeUpload"
      />
    </OFormItem>
  </OForm>
</template>
