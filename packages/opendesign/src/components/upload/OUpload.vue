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
const requestUploadFile = (file: UploadFileT) => {
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
      },
      onError(response?: any, retry?: boolean) {
        file.status = 'failed';
        file.message = response?.message;
        file.retry = retry;
        file.percent = 0;
      },
    });
  }
};

/**
 * 上传单个文件
 */
const doUploadFile = (file: UploadFileT) => {
  if (isFunction(props.onBeforeUpload)) {
    props.onBeforeUpload(file).then((res) => {
      if (res === false) {
        return;
      }

      if (res instanceof File) {
        file.file = res;
      }

      requestUploadFile(file);
    });
  } else {
    requestUploadFile(file);
  }
};

/**
 * 上传所有文件
 */
const doUpload = () => {
  if (fileList.value.length === 0) {
    return;
  }

  fileList.value.forEach((f) => {
    doUploadFile(f);
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
  }
};

const onFileUploadRetry = (file: UploadFileT) => {
  console.log('retry file upload', file.file.name);
  file.retry = false;
  file.message = '';
  doUploadFile(file);
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
              <OIcon v-if="item.retry" button class="o-upload-icon o-upload-icon-retry" @click="onFileUploadRetry(item)">
                <IconRefresh />
              </OIcon>
              <OIcon button class="o-upload-icon o-upload-icon-remove" @click="onFileRemove(item)">
                <IconDelete />
              </OIcon>
            </div>

            <OIcon v-if="props.showUploadingIcon && item.status === 'uploading'" class="o-upload-icon-loading">
              <IconLoading class="o-rotating" />
            </OIcon>
            <div v-if="item.status === 'uploading'" class="o-upload-file-progress">
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
