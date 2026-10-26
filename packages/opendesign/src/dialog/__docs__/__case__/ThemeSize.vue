<docs lang="md">
<!-- zh-CN -->

### 主题规范

昇腾、鲲鹏及欧拉的主题规范中要求，不同尺寸的弹窗宽度对应不同的栅格列数。组件默认通过 `--o-r-grid-*` 栅格变量设置宽度，各断点自动适配。

#### PC 弹窗

<!-- en-US -->

### Theme Specification

The Ascend, Kunpeng, and openEuler theme specifications require that dialogs of different sizes occupy varying numbers of grid columns in width. The component uses `--o-r-grid-*` grid variables for width by default, adapting automatically across breakpoints.

#### PC Dialog
</docs>

<script setup lang="ts">
import { ODialog, OButton, type DialogSizeT, type DialogActionT } from '@opensig/opendesign';
import { ref } from 'vue';

const sizes: Array<DialogSizeT> = ['exlarge', 'large', 'medium', 'small'];
const size = ref<DialogSizeT>('exlarge');
const visible = ref(false);
const openDialog = (s: DialogSizeT) => {
  visible.value = true;
  size.value = s;
};
const closeDialog = () => {
  visible.value = false;
};
const actions: Array<DialogActionT> = [
  {
    id: 'confirm',
    label: 'Confirm',
    color: 'primary',
    variant: 'solid',
    onClick: closeDialog,
  },
  {
    id: 'cancel',
    label: 'Cancel',
    color: 'primary',
    variant: 'outline',
    onClick: closeDialog,
  },
];
</script>
<template>
  <div class="btn-group">
    <OButton v-for="s in sizes" :key="s" @click="openDialog(s)">Open {{ s }} dialog</OButton>
    <ODialog v-model:visible="visible" :size="size" :actions="actions">
      <template #header>Dialog Title size: {{ size }}</template>
      <div class="content">Content</div>
    </ODialog>
  </div>
</template>
<style lang="scss">
.btn-group {
  display: flex;
  gap: 8px;
}
.content {
  height: 150vh;
  background-color: rgba($color: #058ef0, $alpha: 0.2);
}
</style>
