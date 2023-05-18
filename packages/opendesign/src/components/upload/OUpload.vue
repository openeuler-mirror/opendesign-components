<script setup lang="ts">
import { IconAdd } from '../_shared/icons';
import { uploadProps, UploadFileT } from './types';
import OButton from '../button/OButton.vue';
import { computed, ref, Slots } from 'vue';
import { isFunction } from '../_shared/is';
import UploadItem, { ItemSlotNames } from './UploadItem.vue';
import { doUploadAll, doUploadFile } from './upload';
import UploadDargger, { draggerSlotNames } from './UploadDargger.vue';

// TODO 图片上传

const props = defineProps(uploadProps);

const uploadOption = computed(() => {
  return {
    uploadRequest: props.uploadRequest,
    onBeforeUpload: props.onBeforeUpload,
  };
});

const Label = {
  btnLabel: '上传文件',
  dragLabel: '点击或拖拽文件到此处上传',
};

const inputRef = ref<HTMLInputElement | null>(null);
const onSelectClick = () => {
  if (props.disabled) {
    return;
  }
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
 * 添加上传文件
 */
const addUploadFiles = (files: UploadFileT[]) => {
  fileList.value = fileList.value.concat(files);
};
/**
 * 选择文件回调
 */
const onSelectFile = (files: FileList) => {
  if (isFunction(props.onAfterSelect)) {
    props.onAfterSelect(files).then((res) => {
      addUploadFiles(res);

      if (!props.lazyUpload) {
        uploadAll();
      }
    });
  } else {
    const list = Array.from(files).map((item) => {
      return {
        id: item.name,
        name: item.name,
        file: item,
      };
    });
    addUploadFiles(list);

    if (!props.lazyUpload) {
      uploadAll();
    }
  }
};
/**
 * 上传按钮
 */
const onInputChange = function (e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    onSelectFile(files);
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

/**
 * 过滤插槽
 */
const filterSlots = (slots: Slots, slotNames: string[]) => {
  return Object.keys(slots).filter((item) => slotNames.includes(item));
};

defineExpose({
  upload: uploadAll,
});
</script>
<template>
  <div class="o-upload">
    <div class="o-upload-select-wrap">
      <div
        class="o-upload-select"
        :class="{
          'o-upload-select-drag': props.draggable,
        }"
        @click="onSelectClick"
      >
        <input ref="inputRef" type="file" class="o-upload-select-input" :multiple="props.multiple" :disabled="props.disabled" @change="onInputChange" />
        <slot>
          <UploadDargger v-if="props.draggable" :label="props.dragLabel" :disabled="props.disabled" @select="onSelectFile">
            <template v-for="name in filterSlots($slots, draggerSlotNames)" #[name]="slotData">
              <slot :name="name" v-bind="slotData"></slot>
            </template>
          </UploadDargger>
          <OButton v-else :color="props.color" :round="props.round" :size="props.size" :variant="props.variant" :disabled="props.disabled" :icon="IconAdd">
            {{ props.btnLabel ?? Label.btnLabel }}
          </OButton>
        </slot>
      </div>
      <div v-if="$slots['select-extra']" class="o-upload-select-extra">
        <slot name="select-extra"></slot>
      </div>
    </div>

    <div class="o-upload-list">
      <UploadItem v-for="item in fileList" :key="item.id" :file="item" @remove="onFileRemove" @retry="onFileUploadRetry">
        <template v-for="name in filterSlots($slots, ItemSlotNames)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </UploadItem>
    </div>
  </div>
</template>
