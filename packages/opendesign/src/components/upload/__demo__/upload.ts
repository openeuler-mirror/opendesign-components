import { UploadRequestOptionT, UploadFileT } from '../index';

export const onAfterSelect = (fileList: FileList): Promise<UploadFileT[]> => {
  const files: File[] = [];
  const nofiles: string[] = [];
  Array.from(fileList).forEach((f) => {
    if (f.size < 1024 * 1024 * 5) {
      files.push(f);
    } else {
      nofiles.push(f.name);
    }
  });

  if (nofiles.length > 0) {
    console.warn(`Filterd by size: ${nofiles.join(', ')}`);
  }
  return Promise.resolve(
    files.map((file) => {
      return {
        id: file.name,
        name: file.name,
        file: file,
        retry: false,
      };
    })
  );
};

export const mockUpload = (file: File, onProgress: (p: number) => void, onFinished: (success: boolean) => void) => {
  let c = 0;
  const size = file.size;
  const speed = Math.floor(size * 0.01);
  const timer = setInterval(() => {
    const r = Math.random();
    if (r > 0.999) {
      console.log(r);

      clearInterval(timer);
      onFinished(false);
    } else {
      c += speed;
      if (c >= size) {
        onProgress(100);
        clearInterval(timer);
        onFinished(true);
      } else {
        onProgress(Math.floor((c * 100) / size));
      }
    }
  }, 200);
  return () => {
    clearInterval(timer);
    onFinished(false);
  };
};

export const uploadRequest = (options: UploadRequestOptionT) => {
  const { onSuccess, onProgress, onError, file } = options;

  const abort = mockUpload(file.file, onProgress, (success) => {
    if (success) {
      onSuccess(success);
    } else {
      onError(
        {
          message:
            '上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败上传失败',
        },
        true
      );
    }
  });

  return {
    abort: () => {
      abort();
    },
  };
};

export const onBeforeUpload = (file: UploadFileT) => {
  return Promise.resolve(file.file);
};

export const onBeforeRemove = (file: UploadFileT) => {
  const r = window.confirm(`确认删除文件:${file.name}`);
  return Promise.resolve(r);
};
