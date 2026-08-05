<docs lang="md">
<!-- zh-CN -->

### beforeShow / beforeHide

`beforeShow` 和 `beforeHide` 回调可以在浮层打开或关闭前执行异步校验。返回 `false` 时取消操作。

<!-- en-US -->

### Before Show/Hide

Use `beforeShow` and `beforeHide` callbacks for async validation. Returning `false` cancels the operation.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton, OInput } from '@opensig/opendesign';

const visible = ref(false);
const inputText = ref('');
const beforeShow = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};
const beforeHide = (): Promise<boolean> => {
  if (inputText.value.trim()) {
    return Promise.resolve(window.confirm('Unsaved content. Close anyway?'));
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
        <p>Type something then try closing to trigger confirmation.</p>
        <OInput v-model="inputText" placeholder="Type something..." />
        <div class="layer-doc-before-toggle-actions">
          <OButton color="primary" size="small" @click="handleSave">Save &amp; Close</OButton>
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
