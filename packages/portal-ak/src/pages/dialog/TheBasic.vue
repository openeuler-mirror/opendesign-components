<script setup lang="ts">
import { OButton, ODialog, DialogSizeT, DialogActionT, OPopover } from '@components/index';
import { reactive, ref } from 'vue';

const values = reactive({
  show0: false,
  show1: false,
  show2: false,
  show3: false,
  show4: false,
});
const dlgSize = ref<DialogSizeT>('medium');
const toggle = (key: keyof typeof values, show?: boolean, size?: DialogSizeT) => {
  if (size) {
    dlgSize.value = size;
  }
  if (show === undefined) {
    values[key] = !values[key];
  } else {
    values[key] = show;
  }
};

const onChane = (v: boolean) => {
  console.log('dialog change', v);
};

const beforeShow = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const beforeHide = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const dlgAction: DialogActionT[] = [
  {
    id: 'cancel',
    label: '取消',
    color: 'primary',
    size: 'large',
    round: 'pill',
    onClick: () => {
      console.log('cancel');
      toggle('show0');
    },
  },
  {
    id: 'ok',
    label: '确认',
    color: 'primary',
    size: 'large',
    round: 'pill',
    onClick: () => {
      console.log('cancel');
      toggle('show1');
    },
  },
];

const dlgAction2: DialogActionT[] = [
  {
    id: 'cancel',
    label: '取消',
    size: 'large',
    color: 'primary',
    round: 'pill',
    onClick: () => {
      console.log('cancel');
      toggle('show3');
    },
  },
  {
    id: 'ok',
    label: '确认',
    color: 'primary',
    variant: 'solid',
    size: 'large',
    round: 'pill',
    onClick: () => {
      console.log('cancel');
      toggle('show0', true, 'small');
    },
  },
];
</script>
<template>
  <div class="page-demo">
    <h3>基本</h3>
    <section>
      <OButton @click="toggle('show0', true)">Open</OButton>
      <OButton @click="toggle('show0', true, 'auto')">Open auto</OButton>
      <OButton @click="toggle('show0', true, 'small')">Open Small</OButton>
      <OButton @click="toggle('show0', true, 'medium')">Open Medium</OButton>
      <OButton @click="toggle('show0', true, 'large')">Open Large</OButton>
      <OButton @click="toggle('show0', true, 'exlarge')">Open exlarge</OButton>
      <OButton @click="toggle('show3', true, 'exlarge')">Open Medium 强调按钮</OButton>
      <ODialog v-model:visible="values.show0" :actions="dlgAction" :size="dlgSize" @change="onChane">
        <template #header>
          <OPopover>
            <template #target>
              <span>{{ dlgSize }} Dialog</span>
            </template>

            This is Dialog This is Dialog This is Dialog This is
          </OPopover>
        </template>
        <div class="dlg-body" style="height: 100vh; background-color: var(--o-color-fill3)">
          This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog
        </div>
      </ODialog>
      <ODialog v-model:visible="values.show3" :actions="dlgAction2" @change="onChane">
        <template #header> {{ dlgSize }} Dialog</template>
        <div class="dlg-body" style="height: 100vh; background-color: var(--o-color-fill3)">
          This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog
        </div>
      </ODialog>
    </section>
    <h3>运营弹窗</h3>
    <section>
      <OButton @click="toggle('show4', true)">Open</OButton>
      <ODialog v-model:visible="values.show4" class="c-dlg-operation" @change="onChane">
        <template #header> {{ dlgSize }} Dialog</template>
        <div class="dlg-body" style="height: 100vh; background-color: var(--o-color-fill3)">
          This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog This is Dialog
        </div>
      </ODialog>
    </section>
    <h3>延迟响应</h3>
    <section>
      <OButton @click="toggle('show2', true)">Open</OButton>
      <ODialog v-model:visible="values.show2" :before-hide="beforeHide" :before-show="beforeShow" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
        <template #footer>
          <div class="c-dlg-action-end">
            <OButton color="primary" variant="solid" @click="toggle('show2', false)">确定</OButton>
            <OButton @click="toggle('show2', false)">取消</OButton>
          </div>
        </template>
      </ODialog>
    </section>
    <h3>插槽</h3>
    <section>
      <OButton @click="toggle('show1', true)">Open</OButton>
      <ODialog v-model:visible="values.show1" class="o-dialog-phone-full" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
        <template #footer>
          <div class="c-dlg-action-end">
            <OButton color="primary" variant="solid" @click="toggle('show1', false)">确定</OButton>
            <OButton @click="toggle('show1', false)">取消</OButton>
          </div>
        </template>
      </ODialog>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
