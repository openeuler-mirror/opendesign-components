import { ExtractPropTypes, PropType } from 'vue';
import { ButtonPropsT } from '../button/types';

export interface UploadRequestT {
  abort: () => void; // 取消上传
}

export const UploadFileStatusTypes = ['pending', 'uploading', 'finished', 'failed'] as const;
export type UploadFileStatusT = (typeof UploadFileStatusTypes)[number];

export type UploadBtnType = Partial<Pick<ButtonPropsT, 'size' | 'color' | 'variant' | 'round' | 'icon'>>;

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
   * 文件列表(受控)
   * v-model
   */
  modelValue: {
    type: Array as PropType<UploadFileT[]>,
  },
  /**
   * 文件列表(非受控)
   */
  defaultFileList: {
    type: Array as PropType<UploadFileT[]>,
  },
  /**
   * 文件选择 MIME类型
   * image/jpeg;image/jpg;image/png;image/gif;video/mp4;
   */
  accept: {
    type: String,
  },
  /**
   * 是否为禁用状态
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 是否支持多选
   */
  multiple: {
    type: Boolean,
  },
  /**
   * 选择文件前回调，根据返回值判断是否继续选择文件
   */
  beforeSelect: {
    type: Function as PropType<(value: UploadFileT[]) => Promise<boolean> | boolean>,
  },
  /**
   * 选择后触发
   */
  onAfterSelect: {
    type: Function as PropType<(fileList: FileList) => Promise<Array<UploadFileT>>>,
  },
  /**
   * 选择按钮文本
   */
  btnLabel: {
    type: String,
  },
  /**
   * 自定义上传请求
   */
  uploadRequest: {
    type: Function as PropType<(options: UploadRequestOptionT) => UploadRequestT>,
  },
  /**
   * true 选择完成后，手动触发上传；false 选择完成后自动上传
   */
  lazyUpload: {
    type: Boolean,
  },
  /**
   * 上传前触发
   */
  onBeforeUpload: {
    type: Function as PropType<(file: UploadFileT) => Promise<boolean | File>>,
  },
  /**
   * 删除前触发
   */
  onBeforeRemove: {
    type: Function as PropType<(file: UploadFileT) => Promise<boolean>>,
  },
  /**
   * 支持拖拽上传
   */
  draggable: {
    type: Boolean,
  },
  /**
   * 拖拽区域上传提示文本
   */
  dragLabel: {
    type: String,
  },
  /**
   * 拖拽区域拖拽中的提示文本
   */
  dragHoverLabel: {
    type: String,
  },
  /**
   * 文件列表类型
   */
  listType: {
    type: String as PropType<'text' | 'picture' | 'picture-card'>,
    default: 'text',
  },
  /**
   * 生成缩略图
   */
  createThumbnail: {
    type: Function as PropType<(file: File) => Promise<string>>,
  },
  /**
   * 上传按钮参数
   */
  btnProps: {
    type: Object as PropType<UploadBtnType>,
  },
};

export type UploadPropsT = ExtractPropTypes<typeof uploadProps>;
