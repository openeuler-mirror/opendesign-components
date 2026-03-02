<script setup lang="ts">
import { IconLoading, IconLinkPrefix, IconRefresh, IconDelete, IconPreview, IconFile, IconImgError, IconDownload } from '../_utils/icons';
import { UploadFileT, UploadListTypeT } from './types';
import { OIcon } from '../icon';
import { OFigure } from '../figure';
import { OButton } from '../button';
import { useTemplateRef } from 'vue';
import slots from './slot';
import { useI18n } from '../locale';

interface UploadFileItemPropsT {
  file: UploadFileT;
  listType: UploadListTypeT;
  showProgress: Boolean;
  draggable: boolean;
}

const props = defineProps<UploadFileItemPropsT>();

const emits = defineEmits<{
  (e: 'replace', file: UploadFileT, evt: Event): void;
  (e: 'remove', file: UploadFileT, evt: Event): void;
  (e: 'retry', file: UploadFileT, evt: Event): void;
  (e: 'preview', file: UploadFileT, evt: Event): void;
  (e: 'itemClick', file: UploadFileT, evt: Event): void;
  (e: 'download', file: UploadFileT, evt: Event): void;
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

  if (!props.showProgress) {
    return true;
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
const onPreview = (e: Event) => {
  e.stopPropagation();
  figurePreview();
  emits('preview', props.file, e);
};

const onItemClick = (e: Event) => {
  emits('itemClick', props.file, e);
};

const onFileDownload = (e: Event) => {
  e.stopPropagation();
  emits('download', props.file, e);
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
            <template v-if="props.file.status === 'finished'">
              <OFigure v-if="props.file.imgUrl" ref="figureRef" lazy-preview class="o-upload-thumbnail" :src="props.file.imgUrl" />
              <IconFile v-else class="o-upload-icon-file" />
            </template>
          </div>
          <div class="o-upload-card-icons">
            <div class="o-upload-status-wrap" v-if="showLoading()">
              <OIcon class="o-upload-status-icon">
                <IconLoading class="o-rotating" />
              </OIcon>

              <div class="o-upload-status-info">
                {{ t('upload.loading') }}
              </div>
            </div>

            <template v-else>
              <div v-if="props.file.status === 'failed'" class="o-upload-status-wrap o-upload-status-wrap-error">
                <div class="o-upload-status-upper-layer">
                  <OIcon class="o-upload-status-icon">
                    <IconImgError />
                  </OIcon>

                  <div class="o-upload-status-info">
                    {{ t('upload.failed') }}
                  </div>
                </div>

                <div class="o-upload-status-lower-layer">
                  <OButton
                    v-if="props.file.retry"
                    class="o-upload-icon-btn o-upload-icon-retry"
                    :icon="IconRefresh"
                    :title="t('upload.retry')"
                    @click="onFileUploadRetry"
                  />

                  <OButton class="o-upload-icon-btn o-upload-icon-remove" :icon="IconDelete" :title="t('upload.delete')" @click="onFileRemove" />
                </div>
              </div>

              <template v-else>
                <div class="o-upload-status-wrap o-upload-status-wrap-success">
                  <OButton
                    v-if="props.file.imgUrl"
                    :icon="IconPreview"
                    class="o-upload-icon-btn o-upload-icon-preview"
                    :title="t('upload.preview')"
                    @click="onPreview"
                  />

                  <OButton class="o-upload-icon-btn o-upload-icon-remove" :icon="IconDelete" :title="t('upload.delete')" @click="onFileRemove" />
                </div>
              </template>
            </template>
          </div>
          <div v-if="props.file.status === 'uploading' && props.showProgress && props.file.percent" class="o-upload-progress o-upload-card-progress">
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
          <template v-else>
            <template v-if="props.file.status === 'failed'">
              <OButton
                v-if="props.file.retry"
                class="o-upload-row-icon o-upload-icon-hover-in o-upload-icon-retry"
                :icon="IconRefresh"
                :title="t('upload.retry')"
                @click="onFileUploadRetry"
              />
            </template>

            <template v-else>
              <template v-if="props.draggable">
                <OFigure v-if="props.file.imgUrl" ref="figureRef" lazy-preview class="o-upload-thumbnail" :src="props.file.imgUrl" />

                <OButton
                  v-if="props.file.imgUrl"
                  :icon="IconPreview"
                  class="o-upload-row-icon o-upload-icon-preview o-upload-icon-hover-in"
                  :title="t('upload.preview')"
                  @click="onPreview"
                />

                <OButton
                  class="o-upload-row-icon o-upload-icon-download o-upload-icon-hover-in"
                  :icon="IconDownload"
                  :title="t('upload.download')"
                  @click="onFileDownload"
                />
              </template>
            </template>
          </template>

          <OButton class="o-upload-row-icon o-upload-icon-remove o-upload-icon-hover-in" :icon="IconDelete" :title="t('upload.delete')" @click="onFileRemove" />
        </div>

        <div v-if="props.file.status === 'uploading' && props.showProgress && props.file.percent" class="o-upload-progress o-upload-row-progress">
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
