import { propsToAttrStr } from '../../../_demo/utils';
import { onAfterSelect, uploadRequest, onBeforeUpload, onBeforeRemove } from '../../__demo__/upload';
import {  reactive } from 'vue';
import type { UploadFileT } from '../../../../lib';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

// 该导出会作为该使用示例的文案，文案是markdown格式
export const docs = {
  'zh-CN':
    '用于上传文件到服务端。可设置项包含：  \n' +
    '- MIME类型`accept`  \n' +
    '- 是否禁用`disabled`  \n' +
    '- 是否支持多选`multiple`  \n' +
    '- 上传触发时机`lazyUpload`  \n' +
    '- 拖拽上传`draggable`  \n' +
    '- 文件列表类型`listType`  \n' +
    '- 按钮文本`btnLabel`等',
  'en-US':
    'Virtual scrolling is used to control the number of rendered items in a list to optimize rendering performance.Configurable options include:  \n' +
    '- list: the list data to render  \n' +
    '- defaultStartIndex: sets the default initial scroll position item  \n' +
    '- itemSize: defines the height of each item  \n' +
    '- defaultItemSize: specifies the default item height for variable-height items  \n' +
    '- buffer: sets front/render buffer padding  \n' +
    '- scrollbar: controls scrollbar behavior',
};

const imgs = [
  'https://www.openeuler.org/assets/fenhuo_light.8205c177.png',
  'https://www.openeuler.org/assets/tongYuan.fd26d7bf.png',
  'https://www.openeuler.org/assets/suse.37147e0c.png',
];

export const ctx = {
  onAfterSelect, uploadRequest, onBeforeUpload, onBeforeRemove,
  singleFileList: reactive<UploadFileT[]>([
    {
      id: '1',
      name: 'test.png',
      status: 'finished',
      imgUrl: imgs[0],
    },
  ])
};

export const schema = {
  accept: {
    type: 'string',
    default: 'image/jpeg,image/jpg,image/png,image/gif,video/mp4'
  },
  disabled: {
    type: 'boolean',
    default: false
  },
  multiple: {
    type: 'boolean',
    default: false,
  },
  btnLabel: {
    type: 'string',
    default: 'upload'
  },
  lazyUpload: {
    type: 'boolean',
    default: false
  },
  draggable: {
    type: 'boolean',
    default: true
  },
  dragLabel: {
    type: 'string',
    default: 'drag to upload'
  },
  dragHoverLabel: {
    type: 'string',
    default: 'put the file here'
  },
  listType: {
    type: 'list',
    list: ['text', 'picture', 'picture-card'] as const
  }
} satisfies Record<string, DocDemoSchema>;

export const template: DocDemoTemplate<typeof schema> = (_props) => {
  return `<OUpload
  v-model="ctx.singleFileList"
  ${propsToAttrStr(_props)}
  :on-after-select="ctx.onAfterSelect"
  :upload-request="ctx.uploadRequest"
  :btn-props="{ size: 'large' }"
  color="normal"
  variant="solid"
/>`;
};
