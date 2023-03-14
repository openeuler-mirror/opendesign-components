<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { ODialog } from '../index';

const showDlg = ref(true);

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
  <h4>基本</h4>
  <section>
    <OButton @click="toggle(true)">Open</OButton>
    <ODialog v-model="showDlg" :unmount-on-hide="true" @change="onChane">
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
</template>
<style lang="scss">
.dlg-action {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
</style>
