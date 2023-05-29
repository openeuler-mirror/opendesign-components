<script setup lang="ts">
import { OButton, ODialog } from '@components/index';
import { ref } from 'vue';

const showDlg = ref(false);
const toggle = (show?: boolean) => {
  if (show === undefined) {
    showDlg.value = !showDlg.value;
  } else {
    showDlg.value = show;
  }
};

const onChane = (v: boolean) => {
  console.log('dialog change', v);
};
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      <OButton @click="toggle(true)">Open</OButton>
      <ODialog v-model:visible="showDlg" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
        <template #footer>
          <div class="dlg-action">
            <OButton color="primary" variant="solid" @click="toggle(false)">确定</OButton>
            <OButton @click="toggle(false)">取消</OButton>
          </div>
        </template>
      </ODialog>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.dlg-action {
  display: flex;

  justify-content: flex-end;
  > * + * {
    margin-left: 8px;
  }
}
</style>
