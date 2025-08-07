<docs lang="md">
<!-- zh-CN -->

### 底部操作按钮

`ODialog` 可以通过 `actions` 属性定义对话框底部的操作按钮。`actions` 属性的类型为 [DialogActionT\[\]](#dialog-action-t)。

<!-- en-US -->

### Bottom Action Buttons

Bottom action buttons in `ODialog` can be defined via the `actions` prop. The `actions` prop is of type [DialogActionT\[\]](#dialog-action-t).
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { ODialog, OButton, useMessage, type DialogActionT } from '@opensig/opendesign';

const message = useMessage(null);
const visible = ref(false);
const actions: DialogActionT[] = [
  {
    id: 'confirm',
    label: 'Confirm',
    color: 'primary',
    onClick: () => {
      message.success({ content: 'Confirm' });
      visible.value = false;
    },
  },
  {
    id: 'cancel',
    label: 'Cancel',
    color: 'normal',
    onClick: () => {
      message.warning({ content: 'Cancel' });
      visible.value = false;
    },
  },
];
const handleOpen = () => {
  visible.value = true;
};
</script>
<template>
  <OButton @click="handleOpen">Open Dialog</OButton>
  <ODialog v-model:visible="visible" :actions="actions">Dialog Content</ODialog>
</template>
