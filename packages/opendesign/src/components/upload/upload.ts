import { UploadFileT, UploadRequestT, UploadRequestOptionT } from './types';
import { isFunction } from '../_shared/is';

interface OptionsT {
  uploadRequest?: (options: UploadRequestOptionT) => UploadRequestT;
  onBeforeUpload?: (file: UploadFileT) => Promise<boolean | File>;
}
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
        },
        onSuccess() {
          file.status = 'finished';
          file.retry = false;
          resolve(file);
        },
        onError(response?: any, retry?: boolean) {
          file.status = 'failed';
          file.message = response?.message;
          file.retry = retry;
          file.percent = 0;
          resolve(file);
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
export const doUploadAll = (fileList: UploadFileT[], options: OptionsT) => {
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
