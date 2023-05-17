<script setup lang="ts">
import { defaultSize } from '../_shared/global';
import { IconLoading, IconAdd, IconLinkPrefix, IconRefresh, IconDelete } from '../_shared/icons';
import { uploadProps, UploadFileT } from './types';
import OButton from '../button/OButton.vue';
import { computed, ref } from 'vue';
import { isFunction } from '../_shared/is';
import { OIcon } from '../icon';

// TODO 控制按钮样式、拖拽上传、图片上传

const props = defineProps(uploadProps);

const Label = {
  upload: '上传文件',
};
const selectLabel = computed(() => {
  if (props.selectLabel !== undefined) {
    return props.selectLabel;
  }
  return Label.upload;
});

const inputRef = ref<HTMLInputElement | null>(null);
const onSelectClick = () => {
  inputRef.value?.click();
};

const fileList = ref<UploadFileT[]>([]);

/**
 * 发起上传请求
 */
const requestUploadFile = (file: UploadFileT): Promise<UploadFileT> => {
  return new Promise((resolve) => {
    if (isFunction(props.uploadRequest)) {
      file.status = 'uploading';

      file.request = props.uploadRequest({
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
const doUploadFile = (file: UploadFileT) => {
  file.retry = false;
  file.message = '';

  if (isFunction(props.onBeforeUpload)) {
    return props.onBeforeUpload(file).then((res) => {
      if (res === false) {
        return;
      }

      if (res instanceof File) {
        file.file = res;
      }

      return requestUploadFile(file);
    });
  } else {
    return requestUploadFile(file);
  }
};

/**
 * 上传所有文件
 */
const doUpload = () => {
  if (fileList.value.length === 0) {
    return;
  }

  const rlt = fileList.value.map((f) => {
    if (f.status && ['finished', 'uploading'].includes(f.status)) {
      return Promise.resolve(f);
    }
    return doUploadFile(f);
  });

  return Promise.allSettled(rlt).then(() => {
    return fileList.value;
  });
};

const onInputChange = function (e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  if (target.files.length === 0) {
    return;
  }

  if (isFunction(props.onAfterSelect)) {
    props.onAfterSelect(target.files).then((files) => {
      fileList.value = files;

      if (!props.lazyUpload) {
        doUpload();
      }
    });
  } else {
    fileList.value = Array.from(target.files).map((item) => {
      return {
        id: item.name,
        name: item.name,
        file: item,
      };
    });
    if (!props.lazyUpload) {
      doUpload();
    }
  }
};

const onFileRemove = (file: UploadFileT) => {
  if (isFunction(props.onBeforeRemove)) {
    props.onBeforeRemove(file).then((res) => {
      if (res !== false) {
        fileList.value = fileList.value.filter((f) => f.file.name !== file.file.name);
        if (file.request) {
          file.request.abort();
        }
      }
    });
  } else {
    fileList.value = fileList.value.filter((f) => f.file.name !== file.file.name);
    if (file.request) {
      file.request.abort();
    }
  }
};

const onFileUploadRetry = (file: UploadFileT) => {
  console.log('retry file upload', file.file.name);

  doUploadFile(file);
};

const showLoading = (item: UploadFileT): boolean => {
  if (item.status !== 'uploading') {
    return false;
  }

  if (!item.percent && item.percent !== 0) {
    return true;
  }
  return false;
};
defineExpose({
  upload: doUpload,
});
</script>
<template>
  <div class="o-upload">
    <div class="o-upload-select" @click="onSelectClick">
      <input ref="inputRef" type="file" class="o-upload-select-input" :multiple="props.multiple" @change="onInputChange" />
      <slot name="select">
        <OButton>
          <template #icon><IconAdd /></template>{{ selectLabel }}
        </OButton>
      </slot>
    </div>
    <div v-if="$slots.tip" class="o-upload-tip">
      <slot name="tip"></slot>
    </div>
    <div class="o-upload-file-result">
      <div v-for="item in fileList" :key="item.id" class="o-upload-file-item">
        <slot name="file-item" :item="item">
          <div
            class="o-upload-file-item-wrap"
            :class="{
              'is-error': item.status === 'failed',
            }"
          >
            <slot name="file-item-prefix" :item="item"> </slot>
            <div v-if="item.icon !== false" class="o-upload-icon-link">
              <component :is="item.icon" v-if="item.icon" />
              <IconLinkPrefix v-else />
            </div>
            <div class="o-upload-file-label">{{ item.name }}</div>
            <div class="o-upload-icons">
              <OIcon v-if="showLoading(item)" class="o-upload-icon-loading">
                <IconLoading class="o-rotating" />
              </OIcon>
              <OIcon
                v-if="item.retry"
                button
                class="o-upload-icon o-upload-item-hover-in o-upload-icon-retry"
                :icon="IconRefresh"
                @click="onFileUploadRetry(item)"
              />
              <OIcon button class="o-upload-icon o-upload-icon-remove o-upload-item-hover-in" :icon="IconDelete" @click="onFileRemove(item)" />
            </div>

            <div v-if="item.status === 'uploading' && item.percent" class="o-upload-file-progress">
              <div class="o-upload-file-progress-bar" :style="{ width: item.percent + '%' }"></div>
            </div>
            <slot name="file-item-suffix" :item="item"></slot>
          </div>

          <slot name="file-item-tip" :item="item">
            <div
              v-if="item.message"
              class="o-upload-file-item-tip"
              :class="{
                'is-error': item.status === 'failed',
              }"
            >
              {{ item.message }}
            </div>
          </slot>
        </slot>
      </div>
    </div>
  </div>
</template>
