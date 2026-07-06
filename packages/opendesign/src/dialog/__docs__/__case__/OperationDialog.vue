<docs lang="md">
<!-- zh-CN -->

### 运营弹窗

运营弹窗的关闭按钮有特殊样式，可通过给 `ODialog` 组件添加 `c-dlg-operation` 类名来设置。

<!-- en-US -->

### Operation Dialog

The close button of an operation dialog has a special style, which can be set by adding the `c-dlg-operation` class to the `ODialog` component.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { ODialog, OButton } from '@opensig/opendesign';

const visible = ref(false);
</script>
<template>
  <OButton @click="visible = true">Open operation dialog</OButton>
  <ODialog v-model:visible="visible" class="c-dlg-operation"> Operation dialog </ODialog>
</template>
