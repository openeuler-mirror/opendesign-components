<script setup lang="ts">
import { uploadProps, UploadFileT } from './types';
import { computed, ref } from 'vue';
import { isFunction } from '../_shared/is';
import UploadItem, { ItemSlotNames } from './UploadItem.vue';
import { UploadLabel, doUploadAll, doUploadFile, filterSlots, generateImageDataUrl, isPictureType } from './util';
import UploadSelect, { selectSlotNames } from './UploadSelect.vue';
import { IconAdd } from '../_shared/icons';
import InputSelect from './InputSelect.vue';

const props = defineProps(uploadProps);
const emits = defineEmits<{
  (e: 'progress', value: UploadFileT): void;
  (e: 'success', value: UploadFileT): void;
  (e: 'error', value: UploadFileT): void;
  (e: 'change', value: UploadFileT[]): void;
}>();

// 先不做受控模式
const fileList = ref<UploadFileT[]>(props.defaultFileList || []);

let fileId = 1;

const uploadOption = computed(() => {
  return {
    uploadRequest: props.uploadRequest,
    onBeforeUpload: props.onBeforeUpload,
    onProgress: (file: UploadFileT) => {
      emits('progress', file);
    },
    onSuccess: (file: UploadFileT) => {
      emits('success', file);
      emits('change', fileList.value);
    },
    onError: (file: UploadFileT) => {
      emits('error', file);
      emits('change', fileList.value);
    },
  };
});

const selectRef = ref<InstanceType<typeof InputSelect> | null>(null);
let replaceId = '';

/**
 * 上传所有文件
 */
const uploadAll = () => {
  return doUploadAll(fileList.value, uploadOption.value);
};

/**
 * 文件选择后处理
 */
const afterSelected = (files: UploadFileT[]) => {
  if (replaceId) {
    const idx = fileList.value.findIndex((item) => item.id === replaceId);
    if (idx > -1) {
      const f = fileList.value[idx];
      f.request?.abort();

      fileList.value[idx] = files[0];
      replaceId = '';
      if (!props.lazyUpload) {
        doUploadFile(fileList.value[idx], uploadOption.value);
      }
    }
  } else {
    fileList.value = fileList.value.concat(files);
    if (!props.lazyUpload) {
      uploadAll();
    }
  }
};
/**
 * 选择文件回调
 */
const onFileSelected = async (files: FileList) => {
  let list: UploadFileT[] = [];

  const isPicture = isPictureType(props.listType);

  if (isFunction(props.onAfterSelect)) {
    list = await props.onAfterSelect(files);
    if (isPicture) {
      list.forEach((item) => {
        if (!item.imgUrl && item.file) {
          item.imgUrl = generateImageDataUrl(item.file);
        }
      });
    }
  } else {
    list = Array.from(files).map((item) => {
      return {
        id: `${fileId++}`,
        name: item.name,
        file: item,
        imgUrl: isPicture ? generateImageDataUrl(item) : '',
      };
    });
  }

  afterSelected(list);
};
/**
 * 删除文件
 */
const removeFile = async (file: UploadFileT) => {
  if (isFunction(props.onBeforeRemove)) {
    const sure = await props.onBeforeRemove(file);
    if (sure === false) {
      return false;
    }
  }
  file.request?.abort();
  fileList.value = fileList.value.filter((f) => f.id !== file.id);
  return true;
};
const removeFileByIndex = (index: number) => {
  if (index > -1 && index < fileList.value.length) {
    return removeFile(fileList.value[index]);
  }
};
const removeAllFiles = () => {
  return new Promise((resolve) => {
    Promise.allSettled(fileList.value.map((f) => removeFile(f))).then((res) => {
      resolve(res);
    });
    fileList.value = [];
  });
};
/**
 * 重新上传文件
 */
const onFileUploadRetry = (file: UploadFileT) => {
  if (!file.retry || !file.file) {
    return;
  }
  doUploadFile(file, uploadOption.value);
};

/**
 * 替换文件上传
 */
const onFileReplace = (file: UploadFileT) => {
  selectRef.value?.select(false);

  replaceId = file.id;
};

/**
 * 选择文件
 */
const doSelect = () => {
  selectRef.value?.select(props.multiple);
};

defineExpose({
  upload: uploadAll,
  select: doSelect,
  retry: onFileUploadRetry,
  replace: onFileReplace,
  removeByIndex: removeFileByIndex,
  removeAll: removeAllFiles,
});
</script>
<template>
  <div class="o-upload">
    <InputSelect ref="selectRef" :list-type="props.listType" :on-after-select="props.onAfterSelect" @selected="onFileSelected" />
    <div v-if="['text', 'picture'].includes(props.listType)" class="o-upload-select-wrap">
      <UploadSelect
        :disabled="props.disabled"
        :draggable="props.draggable"
        :btn-label="props.btnLabel"
        :drag-label="props.dragLabel"
        @to-select="doSelect"
        @selected="onFileSelected"
      >
        <template v-for="name in filterSlots($slots, selectSlotNames)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </UploadSelect>
      <div v-if="$slots['select-extra']" class="o-upload-select-extra">
        <slot name="select-extra"></slot>
      </div>
    </div>

    <div class="o-upload-list" :class="`o-upload-list-${props.listType}`">
      <UploadItem
        v-for="item in fileList"
        :key="item.id"
        :file="item"
        :list-type="props.listType"
        @remove="removeFile"
        @retry="onFileUploadRetry"
        @replace="onFileReplace"
      >
        <template v-for="name in filterSlots($slots, ItemSlotNames)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </UploadItem>
      <div v-if="props.listType === 'picture-card'" class="o-upload-card-add" @click="doSelect">
        <div>
          <IconAdd class="o-upload-card-add-icon" />
          <div class="o-upload-card-label">{{ props.btnLabel ?? UploadLabel.btnLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
