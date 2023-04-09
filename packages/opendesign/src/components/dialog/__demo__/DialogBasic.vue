<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { ODialog } from '../index';

const showDlg = ref(false);

const toggle = (show?: boolean) => {
  if (show === undefined) {
    showDlg.value = !showDlg.value;
  } else {
    showDlg.value = show;
  }
};

const showDlg2 = ref(false);

const toggle2 = (show?: boolean) => {
  if (show === undefined) {
    showDlg2.value = !showDlg2.value;
  } else {
    showDlg2.value = show;
  }
};
const boxRef = ref<HTMLElement | null>(null);

const onChane = (v: boolean) => {
  console.log('dialog change', v);
};
</script>
<template>
  <h4>基本</h4>
  <section ref="boxRef" class="wrap">
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
    <OButton @click="toggle2(true)">Open to Section</OButton>
    <ODialog v-model:visible="showDlg2" :wrapper="boxRef" :unmount-on-hide="false" @change="onChane">
      <template #header>Dialog Title</template>
      This is Dialog
      <template #footer>
        <div class="dlg-action">
          <OButton color="primary" variant="solid" @click="toggle(false)">确定</OButton>
          <OButton @click="toggle2(false)">取消</OButton>
        </div>
      </template>
    </ODialog>
  </section>
</template>
<style lang="scss" scoped>
.dlg-action {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
.wrap {
  height: 200vh;
  align-items: flex-start;
  position: relative;
}
</style>
