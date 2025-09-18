<docs lang="md">
<!-- zh-CN -->

### 主题规范

昇腾、鲲鹏及欧拉的主题规范中要求，不同的尺寸的弹窗且宽度占有不同的栅格数量。组件默认通过百分比设置宽度，如果要通过栅格设置宽度则需要引入响应的皮肤样式文件。

#### PC 弹窗

<!-- en-US -->

### Theme Specification

The Ascend, Kunpeng, and openEuler theme specifications require that dialogs of different sizes occupy varying numbers of grid columns in width. By default,
the component sets the width using percentages. If grid-based width setting is required, the corresponding skin style file needs to be imported.

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
