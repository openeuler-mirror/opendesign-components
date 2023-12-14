<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { ODialog, DialogSizeT, DialogActionT } from '../index';

const content =
  'This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog';
const showDlg = ref(false);
const dlgSize = ref<DialogSizeT>('medium');
const hasHead = ref(false);
const hasFoot = ref(false);
const toggleHeadOrFoot = (type: 'foot' | 'head') => {
  if (type === 'head') {
    hasHead.value = !hasHead.value;
  } else if (type === 'foot') {
    hasFoot.value = !hasFoot.value;
  }
};
const toggle = (show?: boolean, size: DialogSizeT = 'medium') => {
  dlgSize.value = size;
  if (show === undefined) {
    showDlg.value = !showDlg.value;
  } else {
    showDlg.value = show;
  }
};
const dlgAction: DialogActionT[] = [
  {
    id: 'cancel',
    label: '取消',
    size: 'large',
    onClick: () => {
      console.log('cancel');
      toggle();
    },
  },
  {
    id: 'ok',
    label: '确认',
    color: 'primary',
    variant: 'solid',
    size: 'large',
    onClick: () => {
      console.log('cancel');
      toggle();
    },
  },
];

const showDlg2 = ref(false);
const toggle2 = (show?: boolean) => {
  if (show === undefined) {
    showDlg2.value = !showDlg2.value;
  } else {
    showDlg2.value = show;
  }
};
const showDlg3 = ref(false);
const toggle3 = (show?: boolean) => {
  if (show === undefined) {
    showDlg3.value = !showDlg3.value;
  } else {
    showDlg3.value = show;
  }
};

const boxRef = ref<HTMLElement | null>(null);
const showDlg4 = ref(false);
const toggle4 = (show?: boolean) => {
  if (show === undefined) {
    showDlg4.value = !showDlg4.value;
  } else {
    showDlg4.value = show;
  }
};

const onChane = (v: boolean) => {
  console.log('dialog change', v);
};
</script>
<template>
  <h4>基本</h4>
  <OButton @click="toggleHeadOrFoot('head')">show Header</OButton>
  <OButton @click="toggleHeadOrFoot('foot')">show Footer</OButton>

  <section class="wrap">
    <OButton @click="toggle(true, 'auto')">Open auto</OButton>
    <OButton @click="toggle(true, 'small')">Open Small</OButton>
    <OButton @click="toggle(true, 'medium')">Open Medium</OButton>
    <OButton @click="toggle(true, 'large')">Open Large</OButton>
    <OButton @click="toggle(true, 'exlarge')">Open exlarge</OButton>
    <ODialog v-model:visible="showDlg" :size="dlgSize" :actions="dlgAction" half-full phone-half-full @change="onChane">
      <template v-if="hasHead" #header>Dialog Title</template>
      <div class="dlg-body" style="height: 100vh; background-color: #c9f7ed">{{ content }}</div>
    </ODialog>
    <OButton @click="toggle2(true)">Open unmount-on-hide: false</OButton>
    <ODialog v-model:visible="showDlg2" :unmount-on-hide="false" @change="onChane">
      <template v-if="hasHead" #header>Dialog Title</template>
      This is Dialog
      <template v-if="hasFoot" #footer>
        <div class="dlg-action">
          <OButton color="primary" variant="solid" @click="toggle2(false)">确定</OButton>
          <OButton @click="toggle2(false)">取消</OButton>
        </div>
      </template>
    </ODialog>
  </section>
  <h4>局部弹窗</h4>
  <section class="wrap">
    <OButton @click="toggle3(true)">Open to parent</OButton>
    <ODialog v-model:visible="showDlg3" :wrapper="null" @change="onChane">
      <template v-if="hasHead" #header>Dialog Title</template>
      This is Dialog
      <template #footer>
        <div class="dlg-action">
          <OButton color="primary" variant="solid" @click="toggle3(false)">确定</OButton>
          <OButton @click="toggle3(false)">取消</OButton>
        </div>
      </template>
    </ODialog>
    <OButton @click="toggle4(true)">Open to box</OButton>
    <div ref="boxRef" class="box">box</div>
    <ODialog v-model:visible="showDlg4" :wrapper="boxRef" @change="onChane">
      <template v-if="hasHead" #header>Dialog Title</template>
      This is Dialog
      <template #footer>
        <div class="dlg-action">
          <OButton color="primary" variant="solid" @click="toggle4(false)">确定</OButton>
          <OButton @click="toggle4(false)">取消</OButton>
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
  height: 75vh;
  align-items: flex-start;
  position: relative;
}
.box {
  width: 400px;
  height: 500px;
  border: 1px solid red;
  position: relative;
}
</style>
<style>
.my-dlg {
  --dlg-margin: 0;
}
</style>
