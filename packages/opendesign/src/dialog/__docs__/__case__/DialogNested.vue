<docs lang="md">
<!-- zh-CN -->

### 嵌套弹窗

浮层支持嵌套，内层弹窗关闭后外层弹窗的遮罩层和滚动锁定不受影响。

<!-- en-US -->

### Nested Dialog

Overlays support nesting. After the inner dialog closes, the outer dialog's mask and scroll lock remain unaffected.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { ODialog, OButton } from '@opensig/opendesign';

const outerVisible = ref(false);
const innerVisible = ref(false);
</script>

<template>
  <OButton @click="outerVisible = true">Open Dialog</OButton>
  <ODialog v-model:visible="outerVisible" size="large">
    <template #header>Outer Dialog</template>
    <div>
      <p>This is the outer dialog content.</p>
      <OButton @click="innerVisible = true">Open Inner Dialog</OButton>
    </div>
    <ODialog v-model:visible="innerVisible" size="medium">
      <template #header>Inner Dialog</template>
      <div>This is the inner dialog content. Closing this dialog will not affect the outer dialog.</div>
    </ODialog>
  </ODialog>
</template>
