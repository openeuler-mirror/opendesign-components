<script setup lang="ts">
import { IconLoading, IconLinkPrefix, IconRefresh, IconDelete, IconPreview, IconFile, IconEdit } from '../_utils/icons';
import { UploadFileT, UploadListTypeT } from './types';
import { OIcon } from '../icon';
import { OFigure } from '../figure';
import { ref } from 'vue';
import slots from './slot';
import { useI18n } from '../locale';

interface UploadFileItemPropsT {
  file: UploadFileT;
  listType: UploadListTypeT;
}

const props = defineProps<UploadFileItemPropsT>();

const emits = defineEmits<{
  (e: 'replace', file: UploadFileT): void;
  (e: 'remove', file: UploadFileT): void;
  (e: 'retry', file: UploadFileT): void;
}>();

const { t } = useI18n();

const onFileRemove = (file: UploadFileT) => {
  emits('remove', file);
};

const onFileUploadRetry = (file: UploadFileT) => {
  emits('retry', file);
};

const showLoading = (file: UploadFileT): boolean => {
  if (file.status !== 'uploading') {
    return false;
  }

  if (!file.percent && file.percent !== 0) {
    return true;
  }
  return false;
};

const onFileReplace = (file: UploadFileT) => {
  emits('replace', file);
};

const figureRef = ref<InstanceType<typeof OFigure> | null>(null);
const onPreview = () => {
  figureRef.value?.preview();
};
</script>
<template>
  <div
    class="o-upload-item"
    :class="{
      'o-upload-item-error': props.file.status === 'failed',
    }"
  >
    <slot :name="slots.names.uploadItem" :item="file">
      <div
        v-if="props.listType === 'picture-card'"
        class="o-upload-card-item"
        :class="{
          'is-error': props.file.status === 'failed',
        }"
      >
        <div class="o-upload-card-item-wrap">
          <div class="o-upload-card-file">
            <OFigure v-if="props.file.imgUrl" ref="figureRef" lazy-preiew class="o-upload-thumbnail" :src="props.file.imgUrl" />
            <IconFile v-else class="o-upload-icon-file" />
          </div>
          <div
            class="o-upload-card-icons"
            :class="{
              'is-show': showLoading(props.file),
            }"
          >
            <OIcon
              v-if="props.file.retry"
              button
              class="o-upload-icon-btn o-upload-icon-retry"
              :icon="IconRefresh"
              @click="onFileUploadRetry(props.file)"
              :title="t('upload.retry')"
            />
            <OIcon
              button
              v-if="props.file.status !== 'failed' && props.file.imgUrl"
              :icon="IconPreview"
              class="o-upload-icon-btn o-upload-icon-preview"
              @click="onPreview"
              :title="t('upload.preview')"
            />
            <OIcon v-if="showLoading(props.file)" class="o-upload-icon-loading">
              <IconLoading class="o-rotating" />
            </OIcon>
            <OIcon
              button
              :icon="IconEdit"
              v-if="props.file.status === 'finished'"
              class="o-upload-icon-btn o-upload-icon-edit"
              @click="onFileReplace(props.file)"
              :title="t('upload.edit')"
            />
            <OIcon button class="o-upload-icon-btn o-upload-icon-remove" :icon="IconDelete" @click="onFileRemove(props.file)" :title="t('upload.delete')" />
          </div>

          <div v-if="props.file.status === 'uploading' && props.file.percent" class="o-upload-progress o-upload-card-progress">
            <div class="o-upload-progress-bar" :style="{ width: props.file.percent + '%' }"></div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="o-upload-row-item"
        :class="{
          'is-error': props.file.status === 'failed',
        }"
      >
        <div v-if="props.file.icon !== false" class="o-upload-icon-link">
          <component :is="props.file.icon" v-if="props.file.icon" />
          <IconLinkPrefix v-else />
        </div>
        <div class="o-upload-row-label">{{ props.file.name }}</div>
        <div class="o-upload-row-icons">
          <OIcon v-if="showLoading(props.file)" class="o-upload-icon-loading">
            <IconLoading class="o-rotating" />
          </OIcon>
          <OIcon
            v-if="props.file.retry"
            button
            class="o-upload-row-icon o-upload-icon-hover-in o-upload-icon-retry"
            :icon="IconRefresh"
            @click="onFileUploadRetry(props.file)"
            :title="t('upload.retry')"
          />
          <OIcon
            button
            class="o-upload-row-icon o-upload-icon-remove o-upload-icon-hover-in"
            :icon="IconDelete"
            @click="onFileRemove(props.file)"
            :title="t('upload.delete')"
          />
        </div>

        <div v-if="props.file.status === 'uploading' && props.file.percent" class="o-upload-progress o-upload-row-progress">
          <div class="o-upload-progress-bar" :style="{ width: props.file.percent + '%' }"></div>
        </div>
      </div>

      <div
        v-if="props.file.message"
        class="o-upload-item-tip"
        :class="[
          {
            'is-error': props.file.status === 'failed',
          },
          props.file.messageClass,
        ]"
      >
        {{ props.file.message }}
      </div>
    </slot>
  </div>
</template>
