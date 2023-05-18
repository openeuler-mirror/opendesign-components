<script lang="ts">
export const ItemSlotNames = ['item', 'item-prefix', 'item-suffix', 'item-tip'];
</script>
<script setup lang="ts">
import { IconLoading, IconLinkPrefix, IconRefresh, IconDelete } from '../_shared/icons';
import { UploadFileT } from './types';
import { OIcon } from '../icon';

interface UploadFileItemPropsT {
  file: UploadFileT;
}

const props = defineProps<UploadFileItemPropsT>();

const emits = defineEmits<{
  (e: 'remove', file: UploadFileT): void;
  (e: 'retry', file: UploadFileT): void;
}>();

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
</script>
<template>
  <div :key="props.file.id" class="o-upload-item">
    <slot :name="ItemSlotNames[0]" :item="file">
      <div
        class="o-upload-item-wrap"
        :class="{
          'is-error': props.file.status === 'failed',
        }"
      >
        <slot :name="ItemSlotNames[1]" :item="props.file"></slot>
        <div v-if="props.file.icon !== false" class="o-upload-icon-link">
          <component :is="props.file.icon" v-if="props.file.icon" />
          <IconLinkPrefix v-else />
        </div>
        <div class="o-upload-item-label">{{ props.file.name }}</div>
        <div class="o-upload-item-icons">
          <OIcon v-if="showLoading(props.file)" class="o-upload-icon-loading">
            <IconLoading class="o-rotating" />
          </OIcon>
          <OIcon
            v-if="props.file.retry"
            button
            class="o-upload-item-icon o-upload-item-hover-in o-upload-icon-retry"
            :icon="IconRefresh"
            @click="onFileUploadRetry(props.file)"
          />
          <OIcon button class="o-upload-item-icon o-upload-icon-remove o-upload-item-hover-in" :icon="IconDelete" @click="onFileRemove(props.file)" />
        </div>

        <div v-if="props.file.status === 'uploading' && props.file.percent" class="o-upload-item-progress">
          <div class="o-upload-item-progress-bar" :style="{ width: props.file.percent + '%' }"></div>
        </div>
        <slot :name="ItemSlotNames[2]" :item="props.file"></slot>
      </div>

      <slot :name="ItemSlotNames[3]" :item="props.file">
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
    </slot>
  </div>
</template>
