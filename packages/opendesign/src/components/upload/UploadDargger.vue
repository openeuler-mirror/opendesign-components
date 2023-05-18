<script lang="ts">
export const draggerSlotNames = ['select-drag', 'select-drag-extra'];
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { IconAdd } from '../_shared/icons';

interface UploadDargPropsT {
  label?: string;
  disabled?: boolean;
}

const props = defineProps<UploadDargPropsT>();

const emits = defineEmits<{
  (e: 'select', files: FileList): void;
}>();

const Label = {
  dragLabel: '点击或拖拽文件到此处上传',
};

const isDragging = ref(false);
let dragCnt = 0;

const onDragEnter = (e: DragEvent) => {
  e.preventDefault();
  dragCnt++;

  console.log('onDragEnter', dragCnt);
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();

  if (!isDragging.value && !props.disabled) {
    isDragging.value = true;
  }
};

const onDragLeave = (e: DragEvent) => {
  dragCnt--;
  console.log('onDragLeave', dragCnt);

  if (dragCnt === 0) {
    isDragging.value = false;
  }
};
const onDrap = (e: DragEvent) => {
  console.log('onDrap');
  e.preventDefault();
  console.log(e.dataTransfer?.files);
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    emits('select', files);
  }
  isDragging.value = false;
  dragCnt = 0;
};
</script>
<template>
  <div
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
    <slot :name="draggerSlotNames[0]">
      <IconAdd class="o-upload-drag-icon" />
      <div class="o-upload-drag-label">{{ props.label ?? Label.dragLabel }}</div>
      <slot :name="draggerSlotNames[1]"></slot>
    </slot>
  </div>
</template>
