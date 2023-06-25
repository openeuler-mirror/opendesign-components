import { UploadFileT, UploadRequestT, UploadRequestOptionT } from './types';
import { isFunction } from '../_utils/is';
import { Slots } from 'vue';

interface OptionsT {
  uploadRequest?: (options: UploadRequestOptionT) => UploadRequestT;
  onBeforeUpload?: (file: UploadFileT) => Promise<boolean | File>;
  onProgress?: (file: UploadFileT) => void;
  onSuccess?: (file: UploadFileT) => void;
  onError?: (file: UploadFileT) => void;
}

export const UploadLabel = {
  btnLabel: '上传文件',
  dragLabel: '点击或拖拽文件到此处上传',
};

/**
 * 发起上传请求
 */
export const requestUploadFile = (file: UploadFileT, options: OptionsT): Promise<UploadFileT> => {
  return new Promise((resolve) => {
    if (isFunction(options.uploadRequest)) {
      file.status = 'uploading';

      file.request = options.uploadRequest({
        file: file,
        onProgress(percent: number) {
          file.percent = percent;
          if (isFunction(options.onProgress)) {
            options.onProgress(file);
          }
        },
        onSuccess() {
          file.status = 'finished';
          file.retry = false;
          resolve(file);
          if (isFunction(options.onSuccess)) {
            options.onSuccess(file);
          }
        },
        onError(response?: any, retry?: boolean) {
          file.status = 'failed';
          file.message = response?.message;
          file.retry = retry;
          if (file.percent) {
            file.percent = 0;
          }
          resolve(file);
          if (isFunction(options.onError)) {
            options.onError(file);
          }
        },
      });
    } else {
      resolve(file);
    }
  });
};

/**
 * 上传单个文件
 */
export const doUploadFile = (file: UploadFileT, options: OptionsT) => {
  file.retry = false;
  file.message = '';

  if (isFunction(options.onBeforeUpload)) {
    return options.onBeforeUpload(file).then((res) => {
      if (res === false) {
        return;
      }

      if (res instanceof File) {
        file.file = res;
      }

      return requestUploadFile(file, options);
    });
  } else {
    return requestUploadFile(file, options);
  }
};

/**
 * 上传所有文件
 */
export const doUploadFileList = (fileList: UploadFileT[], options: OptionsT) => {
  if (fileList.length === 0) {
    return;
  }

  const rlt = fileList.map((f) => {
    if (f.status && ['finished', 'uploading'].includes(f.status)) {
      return Promise.resolve(f);
    }
    return doUploadFile(f, options);
  });

  return Promise.allSettled(rlt).then(() => {
    return fileList;
  });
};

/**
 * 过滤插槽
 */
export const filterSlots = (slots: Slots, slotNames: string[]) => {
  return Object.keys(slots).filter((item) => slotNames.includes(item));
};

export function isImageType(file: File): boolean {
  return file.type?.includes('image/');
}

export function generateImageDataUrl(file: File | string): string {
  if (typeof file === 'string') {
    return file;
  }
  if (isImageType(file)) {
    return URL.createObjectURL(file);
  } else {
    return '';
  }
}

export function isPictureType(type?: string): boolean {
  return !!type && ['picture', 'picture-card'].includes(type);
}
