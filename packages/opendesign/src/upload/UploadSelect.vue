
<script setup lang="ts">
import { ref } from 'vue';
import { IconAdd } from '../_utils/icons';
import OButton from '../button/OButton.vue';
import { UploadLabel } from './util';
import { UploadBtnType } from './types';
import slot from './slot';

interface UploadSelectPropsT {
  draggable?: boolean;
  dragLabel?: string;
  btnLabel?: string;
  disabled?: boolean;
  btnProps?: UploadBtnType;
}

const props = defineProps<UploadSelectPropsT>();

const emits = defineEmits<{
  (e: 'to-select'): void;
  (e: 'selected', files: FileList): void;
}>();

const onSelectClick = () => {
  if (props.disabled) {
    return;
  }
  emits('to-select');
};

// 拖拽上传
const isDragging = ref(false);
let dragCnt = 0;

const onDragEnter = (e: DragEvent) => {
  e.preventDefault();
  if (props.disabled) {
    return;
  }
  dragCnt++;
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();

  if (!isDragging.value && !props.disabled) {
    isDragging.value = true;
  }
};

const onDragLeave = () => {
  if (props.disabled) {
    return;
  }
  dragCnt--;
  if (dragCnt === 0) {
    isDragging.value = false;
  }
};
const onDrap = (e: DragEvent) => {
  e.preventDefault();
  if (props.disabled) {
    return;
  }
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    emits('selected', files);
  }
  isDragging.value = false;
  dragCnt = 0;
};
</script>
<template>
  <div
    class="o-upload-select"
    :class="{
      'o-upload-select-drag': props.draggable,
    }"
    @click="onSelectClick"
  >
    <slot :name="slot.names.select">
      <div
        v-if="props.draggable"
        class="o-upload-drag"
        :class="{
          'o-upload-drag-dragging': isDragging,
          'o-upload-drag-disabled': props.disabled,
        }"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrap"
      >
        <slot :name="slot.names.selectDrag">
          <IconAdd class="o-upload-drag-icon" />
          <div class="o-upload-drag-label">{{ props.dragLabel ?? UploadLabel.dragLabel }}</div>
          <div v-if="$slots[slot.names.selectDragExtra]" class="o-upload-select-extra">
            <slot :name="slot.names.selectDragExtra"></slot>
          </div>
        </slot>
      </div>
      <OButton v-else :disabled="props.disabled" v-bind="props.btnProps" :icon="IconAdd">
        {{ props.btnLabel ?? UploadLabel.btnLabel }}
      </OButton>
    </slot>
  </div>
</template>
