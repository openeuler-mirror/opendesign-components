<docs lang="md">
<!-- zh-CN -->

### 打开/关闭前拦截

通过 `beforeShow` 和 `beforeHide` 回调，可以在浮层打开或关闭前执行异步校验逻辑。回调返回 `false`（或 `Promise.resolve(false)`）时取消操作，否则继续执行。

- `beforeShow`：浮层打开前校验，返回 `false` 取消打开
- `beforeHide`：浮层关闭前校验，返回 `false` 取消关闭

典型场景：关闭前检查未保存内容、打开前校验权限。

<!-- en-US -->

### Before Show/Hide Interception

Use the `beforeShow` and `beforeHide` callbacks to perform async validation before the layer opens or closes. Returning `false` (or `Promise.resolve(false)`) cancels the operation.

- `beforeShow`: Validate before opening; return `false` to cancel
- `beforeHide`: Validate before closing; return `false` to cancel

Typical scenarios: checking for unsaved content before closing, verifying permissions before opening.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton, OInput } from '@opensig/opendesign';

const visible = ref(false);
const inputText = ref('');
/** 模拟异步权限校验 */
const beforeShow = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};
/** 有未保存内容时弹确认 */
const beforeHide = (): Promise<boolean> => {
  if (inputText.value.trim()) {
    return Promise.resolve(window.confirm('有未保存的内容，确定关闭吗？'));
  }
  return Promise.resolve(true);
};
const handleOpen = () => {
  visible.value = true;
};
const handleClose = () => {
  visible.value = false;
};
const handleSave = () => {
  inputText.value = '';
  visible.value = false;
};
</script>
<template>
  <div class="layer-doc-before-toggle">
    <OButton color="primary" @click="handleOpen">Open (async check)</OButton>
    <OLayer v-model:visible="visible" :before-show="beforeShow" :before-hide="beforeHide" :wrapper="null">
      <div class="layer-doc-before-toggle-main">
        <h2>Edit Form</h2>
        <p>在输入框中输入内容后，尝试关闭浮层将触发确认对话框。</p>
        <OInput v-model="inputText" placeholder="Type something..." />
        <div class="layer-doc-before-toggle-actions">
          <OButton color="primary" size="small" @click="handleSave">Save & Close</OButton>
          <OButton size="small" @click="handleClose">Close</OButton>
        </div>
      </div>
    </OLayer>
  </div>
</template>
<style lang="scss" scoped>
.layer-doc-before-toggle {
  height: 300px;
  position: relative;
}
.layer-doc-before-toggle-main {
  padding: 24px;
  background-color: var(--o-color-control5-light);
  min-width: 360px;
}
.layer-doc-before-toggle-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
</style>
