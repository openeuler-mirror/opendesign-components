<docs lang="md">
<!-- zh-CN -->

### 使用

用于上传文件到服务端。可设置项包含：

MIME类型 `accept`；

是否禁用 `disabled`；

是否支持多选 `multiple`；

上传触发时机 `lazyUpload`；

拖拽上传 `draggable`；

文件列表类型 `listType`；

按钮文本 `btnLabel` 等。

<!-- en-US -->

Used for uploading files to the server. The settable items include

MIME type `accept`;

Whether to disable `disabled`;

Whether multiple selection `multiple` is supported;

Upload trigger time `lazyUpload`;

Drag and drop upload `draggable`;

File list type `listType`;

Button text such as `btnLabel`, etc.

### Usage
</docs>

<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { onAfterSelect, uploadRequest, onBeforeUpload, onBeforeRemove, downloadFile } from '../../__demo__/upload';
import { reactive } from 'vue';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

const imgs = [
  'https://www.openeuler.org/assets/fenhuo_light.8205c177.png',
  'https://www.openeuler.org/assets/tongYuan.fd26d7bf.png',
  'https://www.openeuler.org/assets/suse.37147e0c.png',
];
const _oCtx = {
  onAfterSelect,
  uploadRequest,
  onBeforeUpload,
  onBeforeRemove,
  downloadFile,
  singleFileList: reactive([]),
};

const _oSchema = {
  accept: {
    type: 'string',
    default: 'image/jpeg,image/jpg,image/png,image/gif,video/mp4',
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  multiple: {
    type: 'boolean',
    default: false,
  },
  btnLabel: {
    type: 'string',
    default: 'upload',
  },
  lazyUpload: {
    type: 'boolean',
    default: false,
  },
  draggable: {
    type: 'boolean',
    default: false,
  },
  dragLabel: {
    type: 'string',
    default: 'drag to upload',
  },
  dragHoverLabel: {
    type: 'string',
    default: 'put the file here',
  },
  listType: {
    type: 'list',
    list: ['text', 'picture', 'picture-card'] as const,
  },
  showProgress: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OUpload
  v-model="ctx.singleFileList"
  ${propsToAttrStr(props)}
  :on-after-select="ctx.onAfterSelect"
  :upload-request="ctx.uploadRequest"
  :download-file="ctx.downloadFile"
  color="normal"
  variant="solid"
/>`;
};
</script>
