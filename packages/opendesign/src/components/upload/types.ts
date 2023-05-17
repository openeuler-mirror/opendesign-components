import { ExtractPropTypes, PropType } from 'vue';
import { SizeT, RoundT, ColorT, VariantT } from '../_shared/types';

export interface UploadRequestT {
  abort: () => void; // 取消上传
}

export interface UploadFileT {
  id: string;
  name: string;
  file: File; // 上传文件
  status?: 'pending' | 'uploading' | 'finished' | 'failed'; // 校验/上传结果
  message?: string; // 提示
  retry?: boolean; // 是否重新上传
  percent?: number; // 上传进度 0~100,
  request?: UploadRequestT;
  icon?: any;
}
export interface UploadRequestOptionT {
  onProgress: (percent: number, event?: ProgressEvent) => void;
  onSuccess: (response?: any) => void;
  onError: (response?: any, retry?: boolean) => void;
  file: UploadFileT;
}

export const uploadProps = {
  /**
   * 颜色类型 ColorT
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * 按钮类型 VariantT
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * 按钮尺寸 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
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
   * 选择后触发
   */
  onAfterSelect: {
    type: Function as PropType<(fileList: FileList) => Promise<Array<UploadFileT>>>,
  },
  /**
   * 选择按钮文本
   */
  selectLabel: {
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
};

export type UploadPropsT = ExtractPropTypes<typeof uploadProps>;
