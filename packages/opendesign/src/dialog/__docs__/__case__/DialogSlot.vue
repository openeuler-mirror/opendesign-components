<docs lang="md">
<!-- zh-CN -->

### 插槽

对话框有四个插槽：

- `header`: 头部，用于放置标题
- `default`: 主体，用于放置内容。**注**：`default` 插槽中的内容有溢出滚动的功能（可通过 `scrollbar` 参数调整滚动条，参数类型[BaseScrollerPropsT](#base-scroller-props-t)），其余插槽位置固定不能滚动；
- `actions`: 按钮，用于自定义底部按钮
- `footer`: 底部，用于防止底部内容。**注**：`footer` 插槽会覆盖 `actions` 插槽。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ODialog, OButton, OTextarea, ORate, ODivider, OIconClose, OIconDone, OForm, OFormItem, OInput, OIcon } from '@opensig/opendesign';

const ratingDialogVisible = ref(false);
const formDialogVisible = ref(false);
const rateVal = ref(0);
const feedback = ref('');
const openRatingDialog = () => {
  ratingDialogVisible.value = true;
};
const openFormDialog = () => {
  formDialogVisible.value = true;
};
const cancel = () => {
  ratingDialogVisible.value = false;
  formDialogVisible.value = false;
};
const submit = () => {
  ratingDialogVisible.value = false;
  formDialogVisible.value = false;
};
const labels = ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
const title = computed(() => {
  if (rateVal.value === 0) {
    return 'Please rate your experience';
  } else {
    return labels[rateVal.value - 1];
  }
});
</script>

<template>
  <div class="row">
    <OButton @click="openRatingDialog">Open rating dialog</OButton>
    <OButton @click="openFormDialog">Open form dialog</OButton>
  </div>
  <!-- rating dialog -->
  <ODialog v-model:visible="ratingDialogVisible" size="auto">
    <template #header>{{ title }}</template>
    <div class="body-wrapper">
      <ORate v-model="rateVal" size="large" />
      <OTextarea v-model="feedback" placeholder="Please enter your feedback" :max-length="200" resize="none" class="textarea" />
      <div>Thanks for your feedback!</div>
    </div>
    <template #actions="{ isPhonePad }">
      <OButton :variant="isPhonePad ? 'text' : 'outline'" :disabled="isPhonePad" @click="cancel">Cancel</OButton>
      <ODivider direction="v" :class="{ pc: !isPhonePad }" />
      <OButton :variant="isPhonePad ? 'text' : 'outline'" color="primary" @click="submit">Submit</OButton>
    </template>
  </ODialog>
  <!-- form dialog -->
  <ODialog v-model:visible="formDialogVisible" size="exlarge" class="doc-case-form-dialog" hide-close>
    <template #header>
      <div class="form-header">
        <OIcon button :icon="OIconClose" @click="cancel" class="close-icon" />
        <span class="title">Form Dialog</span>
        <OIcon button :icon="OIconDone" @click="submit" />
      </div>
    </template>
    <OForm class="form" has-required layout="v" label-width="auto">
      <OFormItem v-for="idx in 3" :key="idx" :label="`Form item ${idx}`" required>
        <OInput :placeholder="`Form item ${idx}`" v-model="feedback" class="input" />
      </OFormItem>
    </OForm>
  </ODialog>
</template>
<style lang="scss" scoped>
// rating-dialog
.body-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.textarea {
  margin-top: var(--o-gap-3);
  margin-bottom: var(--o-gap-2);
  width: 312px;
  height: 116px;
}
.pc {
  --o-divider-bd-color: transparent;
}
</style>
<style lang="scss">
// form-dialog
.doc-case-form-dialog {
  --dlg-min-height: 100vh;
  --dlg-radius: 0;
  .form-header {
    display: flex;
    align-items: center;
    .close-icon {
      margin-right: var(--o-gap-4);
    }
    .title {
      flex-grow: 1;
      text-align: left;
    }
  }
  .input {
    width: 100%;
  }
}
</style>