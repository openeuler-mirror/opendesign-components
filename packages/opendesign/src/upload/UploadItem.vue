<script setup lang="ts">
import { IconLoading, IconLinkPrefix, IconRefresh, IconDelete, IconPreview, IconFile, IconEdit } from '../_utils/icons';
import { UploadFileT, UploadListTypeT } from './types';
import { OIcon } from '../icon';
import { OFigure } from '../figure';
import { useTemplateRef } from 'vue';
import slots from './slot';
import { useI18n } from '../locale';

interface UploadFileItemPropsT {
  file: UploadFileT;
  listType: UploadListTypeT;
}

const props = defineProps<UploadFileItemPropsT>();

const emits = defineEmits<{
  (e: 'replace', file: UploadFileT, evt: Event): void;
  (e: 'remove', file: UploadFileT, evt: Event): void;
  (e: 'retry', file: UploadFileT, evt: Event): void;
  (e: 'preview', file: UploadFileT, evt: Event): void;
  (e: 'itemClick', file: UploadFileT, evt: Event ): void;
}>();

const { t } = useI18n();

const onFileRemove = (e: Event) => {
  e.stopPropagation();
  emits('remove', props.file, e);
};

const onFileUploadRetry = (e: Event) => {
  e.stopPropagation();
  emits('retry', props.file, e);
};

const showLoading = (): boolean => {
  if (props.file.status !== 'uploading') {
    return false;
  }

  if (!props.file.percent && props.file.percent !== 0) {
    return true;
  }
  return false;
};

const onFileReplace = (e: Event) => {
  e.stopPropagation();
  emits('replace', props.file, e);
};

const figureRef = useTemplateRef<InstanceType<typeof OFigure>>('figureRef');
const figurePreview = () => {
  figureRef.value?.preview();
};
const onPreview = (e: Event ) => {
  e.stopPropagation();
  figurePreview();
  emits('preview', props.file, e);
};

const onItemClick = (e: Event) => {
  emits('itemClick', props.file, e );
};

defineExpose({
  preview: figurePreview,
});
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
         @click="onItemClick"
      >
        <div class="o-upload-card-item-wrap">
          <div class="o-upload-card-file">
            <OFigure v-if="props.file.imgUrl" ref="figureRef" lazy-preview class="o-upload-thumbnail" :src="props.file.imgUrl" />
            <IconFile v-else class="o-upload-icon-file" />
          </div>
          <div
            class="o-upload-card-icons"
            :class="{
              'is-show': showLoading(),
            }"
          >
            <OIcon
              v-if="props.file.retry"
              button
              class="o-upload-icon-btn o-upload-icon-retry"
              :icon="IconRefresh"
              :title="t('upload.retry')"
              @click="onFileUploadRetry"
            />
            <OIcon
              v-if="props.file.status !== 'failed' && props.file.imgUrl"
              button
              :icon="IconPreview"
              class="o-upload-icon-btn o-upload-icon-preview"
              :title="t('upload.preview')"
              @click="onPreview"
            />
            <OIcon v-if="showLoading()" class="o-upload-icon-loading">
              <IconLoading class="o-rotating" />
            </OIcon>
            <OIcon
              v-if="props.file.status === 'finished'"
              button
              :icon="IconEdit"
              class="o-upload-icon-btn o-upload-icon-edit"
              :title="t('upload.edit')"
              @click="onFileReplace"
            />
            <OIcon button class="o-upload-icon-btn o-upload-icon-remove" :icon="IconDelete" :title="t('upload.delete')" @click="onFileRemove" />
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
         @click="onItemClick"
      >
        <OFigure
          v-if="props.listType === 'picture' && props.file.imgUrl"
          ref="figureRef"
          preview
          class="o-upload-thumbnail"
          :src="props.file.imgUrl"
          @click.stop
        />
        <div v-else-if="props.file.icon !== false" class="o-upload-icon-link">
          <component :is="props.file.icon" v-if="props.file.icon" />
          <IconLinkPrefix v-else />
        </div>
        <div class="o-upload-row-label">{{ props.file.name }}</div>
        <div class="o-upload-row-icons">
          <OIcon v-if="showLoading()" class="o-upload-icon-loading">
            <IconLoading class="o-rotating" />
          </OIcon>
          <OIcon
            v-if="props.file.retry"
            button
            class="o-upload-row-icon o-upload-icon-hover-in o-upload-icon-retry"
            :icon="IconRefresh"
            :title="t('upload.retry')"
            @click="onFileUploadRetry"
          />
          <OIcon
            button
            class="o-upload-row-icon o-upload-icon-remove o-upload-icon-hover-in"
            :icon="IconDelete"
            :title="t('upload.delete')"
            @click="onFileRemove"
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
