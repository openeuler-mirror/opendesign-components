<script setup lang="ts">
import { IconAdd } from '../_shared/icons';
import { uploadProps, UploadFileT } from './types';
import OButton from '../button/OButton.vue';
import { computed, ref } from 'vue';
import { isFunction } from '../_shared/is';
import UploadFileItem from './UploadFileItem.vue';
import { doUploadAll, doUploadFile } from './upload';

// TODO 控制按钮样式、拖拽上传、图片上传

const props = defineProps(uploadProps);

const uploadOption = computed(() => {
  return {
    uploadRequest: props.uploadRequest,
    onBeforeUpload: props.onBeforeUpload,
  };
});

const Label = {
  upload: '上传文件',
};

const inputRef = ref<HTMLInputElement | null>(null);
const onSelectClick = () => {
  inputRef.value?.click();
};

const fileList = ref<UploadFileT[]>([]);
/**
 * 上传所有文件
 */
const uploadAll = () => {
  return doUploadAll(fileList.value, uploadOption.value);
};
/**
 * 选择文件回调
 */
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
        uploadAll();
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
      uploadAll();
    }
  }
};
/**
 * 删除文件
 */
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
/**
 * 重新上传文件
 */
const onFileUploadRetry = (file: UploadFileT) => {
  if (!file.retry) {
    return;
  }
  doUploadFile(file, uploadOption.value);
};

defineExpose({
  upload: uploadAll,
});
</script>
<template>
  <div class="o-upload">
    <div class="o-upload-select" @click="onSelectClick">
      <input ref="inputRef" type="file" class="o-upload-select-input" :multiple="props.multiple" @change="onInputChange" />
      <slot name="select">
        <OButton :color="props.color" :round="props.round" :size="props.size" :variant="props.variant" :disabled="props.disabled" :icon="IconAdd">
          {{ props.selectLabel ?? Label.upload }}
        </OButton>
      </slot>
    </div>
    <div v-if="$slots.tip" class="o-upload-tip">
      <slot name="tip"></slot>
    </div>
    <div class="o-upload-file-result">
      <UploadFileItem v-for="item in fileList" :key="item.id" :file="item" @remove="onFileRemove" @retry="onFileUploadRetry" />
    </div>
  </div>
</template>
