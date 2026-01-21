<script setup lang="ts">
import { uploadProps, UploadFileT } from './types';
import { computed, ref, inject, watch, useTemplateRef } from 'vue';
import { isArray, isFunction } from '../_utils/is';
import { filterSlots } from '../_utils/vue-utils';
import UploadItem from './UploadItem.vue';
import slot from './slot';
import { doUploadFileList, doUploadFile, generateImageDataUrl, isPictureType } from './util';
import UploadSelect from './UploadSelect.vue';
import { IconAdd } from '../_utils/icons';
import InputSelect from './InputSelect.vue';
import { formItemInjectKey } from '../form/provide';
import { useI18n } from '../locale';
import { log } from '../_utils/log';

const props = defineProps(uploadProps);
const emits = defineEmits<{
  (e: 'progress', value: UploadFileT): void;
  (e: 'success', value: UploadFileT): void;
  (e: 'error', value: UploadFileT): void;
  (e: 'change', value: UploadFileT[]): void;
  (e: 'select', value: UploadFileT[]): void;
  (e: 'update:modelValue', value: UploadFileT[]): void;
  (e: 'itemRemove', value: UploadFileT, evt: Event): void;
  (e: 'itemRetry', value: UploadFileT, evt: Event): void;
  (e: 'itemReplace', value: UploadFileT, evt: Event): void;
  (e: 'itemPreview', value: UploadFileT, evt: Event): void;
  (e: 'itemClick', value: UploadFileT, evt: Event): void;
}>();

const emitUpdateValue = (value: UploadFileT[]) => {
  emits('update:modelValue', value);
};

const { t } = useI18n();

const fileList = ref<UploadFileT[]>(props.modelValue ?? props.defaultFileList ?? []);
watch(
  () => props.modelValue,
  (v) => {
    if (fileList.value === v) {
      return;
    }
    if (isArray(v)) {
      fileList.value = [...v];
    } else {
      fileList.value = [];
    }
  },
);

// 表单注入，用于规则校验
const formItemInjection = inject(formItemInjectKey, null);

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
      emitUpdateValue(fileList.value);
      emits('change', fileList.value);
    },
    onError: (file: UploadFileT) => {
      emits('error', file);
      emitUpdateValue(fileList.value);
      emits('change', fileList.value);
    },
  };
});

const selectRef = ref<InstanceType<typeof InputSelect> | null>(null);
let replaceId: string | number = '';

/**
 * 上传所有文件
 */
const uploadAll = () => {
  return doUploadFileList(fileList.value, uploadOption.value);
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

      emitUpdateValue(fileList.value);
      emits('select', fileList.value);

      formItemInjection?.fieldHandlers.onChange?.();

      if (!props.lazyUpload) {
        doUploadFile(fileList.value[idx], uploadOption.value);
      }
    }
  } else {
    let s = fileList.value.length;
    let l = files.length;
    if (props.multiple) {
      fileList.value = fileList.value.concat(files);
    } else {
      fileList.value[0]?.request?.abort();
      fileList.value = files;
      s = 0;
      l = 1;
    }

    emitUpdateValue(fileList.value);
    emits('select', fileList.value);

    formItemInjection?.fieldHandlers.onChange?.();

    if (!props.lazyUpload) {
      doUploadFileList(fileList.value.slice(s, s + l), uploadOption.value);
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
const doRemoveFile = async (file: UploadFileT) => {
  if (isFunction(props.onBeforeRemove)) {
    const sure = await props.onBeforeRemove(file);
    if (sure === false) {
      return false;
    }
  }
  file.request?.abort();

  const index = fileList.value.findIndex((item) => item.id === file.id);
  fileList.value.splice(index, 1);

  formItemInjection?.fieldHandlers.onChange?.();

  emitUpdateValue(fileList.value);

  return true;
};

const removeFileByIndex = (index: number) => {
  if (index < 0 && index >= fileList.value.length) {
    return;
  }
  doRemoveFile(fileList.value[index]);
};
const removeById = (id: string | number) => {
  const index = fileList.value.findIndex((item) => item.id === id);
  removeFileByIndex(index);
};

const removeAllFiles = () => {
  return new Promise((resolve) => {
    Promise.allSettled(fileList.value.map((f) => doRemoveFile(f))).then((res) => {
      resolve(res);

      fileList.value = [];

      emitUpdateValue(fileList.value);

      emits('change', fileList.value);
    });
  });
};

// 处理点击删除图标
const onRemoveFile = (file: UploadFileT, e: Event) => {
  doRemoveFile(file).then(() => {
    emits('itemRemove', file, e);

    emits('change', fileList.value);
  });
};
/**
 * 重新上传文件
 */
const doRetryUpload = (file: UploadFileT, force?: boolean) => {
  if (!file.file) {
    log.warn('retry file not found!');
    return;
  }

  if (!file.retry && !force) {
    return;
  }

  doUploadFile(file, uploadOption.value);

  formItemInjection?.fieldHandlers.onChange?.();
};

/**
 * 重新选择新的文件替换文件
 */
const onFileUploadRetry = (file: UploadFileT, e: Event) => {
  doRetryUpload(file);
  emits('itemRetry', file, e);
};

/**
 * 重新选择新的文件替换文件
 */
const doReplaceFile = (file: UploadFileT) => {
  replaceId = file.id;
  selectRef.value?.select(false);
};

const replaceByIndex = (index: number, newFile: UploadFileT) => {
  const file = fileList.value[index];
  if (!file) {
    log.warn('file not found!');
  }
  file.request?.abort();

  if (newFile) {
    fileList.value.splice(index, 1, newFile);

    emits('change', fileList.value);

    formItemInjection?.fieldHandlers.onChange?.();
  } else {
    doReplaceFile(file);
  }
};

const replaceById = (id: string, newFile: UploadFileT) => {
  const index = fileList.value.findIndex((item) => item.id === id);

  replaceByIndex(index, newFile);
};

/**
 * 替换文件上传
 */
const onFileReplace = (file: UploadFileT, e: Event) => {
  doReplaceFile(file);

  emits('itemReplace', file, e);

  formItemInjection?.fieldHandlers.onChange?.();
};
/**
 * 选择文件
 */
const doSelect = async () => {
  if (isFunction(props.beforeSelect)) {
    const goon = await props.beforeSelect(fileList.value);

    if (goon === false) {
      return;
    }
  }
  selectRef.value?.select(props.multiple);
};

const onUploadItemLabelClick = (file: UploadFileT, e: Event) => {
  emits('itemClick', file, e);
};

const onFilePreview = (file: UploadFileT, e: Event) => {
  emits('itemPreview', file, e);
};

const uploadItems = useTemplateRef<InstanceType<typeof UploadItem>[]>('uploadItems');
const previewItemByIndex = (index: number) => {
  const item = uploadItems.value?.[index];

  item?.preview();
};
const previewItemById = (id: number | string) => {
  const idx = fileList.value.findIndex((item) => item.id === id);
  previewItemByIndex(idx);
};

defineExpose({
  upload: uploadAll,
  select: doSelect,
  retry: doRetryUpload,
  replace: doReplaceFile,
  replaceById: replaceById,
  replaceByIndex: replaceByIndex,
  removeById: removeById,
  removeByIndex: removeFileByIndex,
  removeAll: removeAllFiles,
  previewItemByIndex,
  previewItemById,
});
</script>
<template>
  <div class="o-upload" :class="{ 'o-upload-draggable': draggable }">
    <InputSelect ref="selectRef" :accept="props.accept" :disabled="props.disabled" @selected="onFileSelected" />
    <div v-if="['text', 'picture'].includes(props.listType)" class="o-upload-select-wrap">
      <UploadSelect
        :disabled="props.disabled"
        :draggable="props.draggable"
        :btn-label="props.btnLabel"
        :drag-label="props.dragLabel"
        :drag-hover-label="props.dragHoverLabel"
        @to-select="doSelect"
        @selected="onFileSelected"
      >
        <template v-for="name in filterSlots($slots, slot.names)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </UploadSelect>
      <div v-if="$slots['select-extra']" class="o-upload-select-extra">
        <slot name="select-extra"></slot>
      </div>
    </div>

    <div
      class="o-upload-list"
      :class="{
        'o-upload-card-list': props.listType === 'picture-card',
      }"
    >
      <UploadItem
        v-for="item in fileList"
        ref="uploadItems"
        :key="item.id"
        :file="item"
        :list-type="props.listType"
        :showProgress="props.showProgress"
        @remove="onRemoveFile"
        @retry="onFileUploadRetry"
        @replace="onFileReplace"
        @preview="onFilePreview"
        @item-click="onUploadItemLabelClick"
      >
        <template v-for="name in filterSlots($slots, slot.names)" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </UploadItem>
      <div
        v-if="props.listType === 'picture-card'"
        class="o-upload-card-add"
        :class="{
          'is-disabled': props.disabled,
        }"
        @click="doSelect"
      >
        <div>
          <slot name="select-add">
            <IconAdd class="o-upload-card-add-icon" />
            <div class="o-upload-card-label">
              <slot name="select-add-label">
                {{ props.btnLabel ?? t('upload.buttonLabel') }}
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
