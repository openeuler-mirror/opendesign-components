import { ExtractPropTypes, PropType } from 'vue';
export interface UploadRequestT {
  abort: () => void; // 取消上传
}

export const UploadFileStatusTypes = ['pending', 'uploading', 'finished', 'failed'] as const;
export type UploadFileStatusT = (typeof UploadFileStatusTypes)[number];

export interface UploadFileT {
  id: string;
  name: string;
  file?: File; // 上传文件
  status?: UploadFileStatusT; // 校验/上传结果
  message?: string; // 提示
  messageClass?: string; // 提示消息类名
  retry?: boolean; // 是否重新上传
  percent?: number; // 上传进度 0~100,
  request?: UploadRequestT;
  icon?: any;
  imgUrl?: any;
}
export interface UploadRequestOptionT {
  onProgress: (percent: number, event?: ProgressEvent) => void;
  onSuccess: (response?: any) => void;
  onError: (response?: any, retry?: boolean) => void;
  file: UploadFileT;
}

export const UploadListTypes = ['text', 'picture', 'picture-card'] as const;
export type UploadListTypeT = (typeof UploadListTypes)[number];

export const uploadProps = {
  /**
   * @zh-CN 文件列表(受控)
   * @en-US File List (Controlled).
   */
  modelValue: {
    type: Array as PropType<UploadFileT[]>,
  },
  /**
   * @zh-CN 文件列表(非受控)
   * @en-US File list (uncontrolled).
   */
  defaultFileList: {
    type: Array as PropType<UploadFileT[]>,
  },
  /**
   * @zh-CN 文件选择，MIME类型：image/jpeg;image/jpg;image/png;image/gif;video/mp4
   * @en-US File selection, MIME type: image/jpeg; image/jpg; image/png; image/gif; video/mp4.
   */
  accept: {
    type: String,
  },
  /**
   * @zh-CN 是否为禁用状态
   * @en-US Disable uploading.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否支持多文件上传
   * @en-US Support multi-file upload.
   */
  multiple: {
    type: Boolean,
  },
  /**
   * @zh-CN 选择文件前回调，根据返回值判断是否继续选择文件
   * @en-US Before selecting a file, there is a callback. Based on the return value, determine whether to continue selecting the file.
   */
  beforeSelect: {
    type: Function as PropType<(value: UploadFileT[]) => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 选择后触发
   * @en-US Triggered after selection.
   */
  onAfterSelect: {
    type: Function as PropType<(fileList: FileList) => Promise<Array<UploadFileT>>>,
  },
  /**
   * @zh-CN 上传按钮文本
   * @en-US Upload button text.
   */
  btnLabel: {
    type: String,
  },
  /**
   * @zh-CN 自定义上传请求
   * @en-US Customize upload requests.
   */
  uploadRequest: {
    type: Function as PropType<(options: UploadRequestOptionT) => UploadRequestT>,
  },
  /**
   * @zh-CN true 选择完成后，手动触发上传；false 选择完成后自动上传
   * @en-US After the true selection is completed, manually trigger the upload. false: Automatically upload after selection is completed.
   */
  lazyUpload: {
    type: Boolean,
  },
  /**
   * @zh-CN 上传前触发
   * @en-US Triggered before upload.
   */
  onBeforeUpload: {
    type: Function as PropType<(file: UploadFileT) => Promise<boolean | File>>,
  },
  /**
   * @zh-CN 删除前触发
   * @en-US Triggered before deletion.
   */
  onBeforeRemove: {
    type: Function as PropType<(file: UploadFileT) => Promise<boolean>>,
  },
  /**
   * @zh-CN 支持拖拽上传
   * @en-US Supports drag-and-drop upload.
   */
  draggable: {
    type: Boolean,
  },
  /**
   * @zh-CN 拖拽区域上传提示文本
   * @en-US Drag the area to upload the prompt text.
   */
  dragLabel: {
    type: String,
  },
  /**
   * @zh-CN 拖拽区域拖拽中的提示文本
   * @en-US The prompt text in the drag-and-drop area.
   */
  dragHoverLabel: {
    type: String,
  },
  /**
   * @zh-CN 文件列表类型
   * @en-US File list type.
   * @default 'text'
   */
  listType: {
    type: String as PropType<'text' | 'picture' | 'picture-card'>,
    default: 'text',
  },
  /**
   * @zh-CN 生成缩略图
   * @en-US Generate thumbnails.
   */
  createThumbnail: {
    type: Function as PropType<(file: File) => Promise<string>>,
  },
};

export type UploadPropsT = ExtractPropTypes<typeof uploadProps>;
