<script setup lang="ts">
import { ref } from 'vue';
import { ODialog, OButton, OIconClose, OIconDone, OForm, OFormItem, OInput, OIcon } from '@opensig/opendesign';

const visible = ref(false);
const feedback = ref('');
const openFormDialog = () => {
  visible.value = true;
};
const cancel = () => {
  visible.value = false;
};
const submit = () => {
  visible.value = false;
};
</script>

<template>
  <OButton @click="openFormDialog">Open form dialog</OButton>
  <ODialog v-model:visible="visible" size="exlarge" class="doc-case-form-dialog" hide-close>
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
<style lang="scss">
// form-dialog
.doc-case-form-dialog {
  --dlg-min-height: 100vh;
  --dlg-radius: 0;
  // The z-index must be higher than that of the Header component.
  z-index: 9991;
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
