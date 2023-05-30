<script setup lang="ts">
import { OButton, ODialog } from '@components/index';
import { reactive } from 'vue';

const values = reactive({
  show0: false,
  show1: false,
  show2: false,
});
const toggle = (key: keyof typeof values, show?: boolean) => {
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

const dlgAction = [
  {
    id: 'cancel',
    label: '取消',
    onClick: () => {
      console.log('cancel');
    },
  },
  {
    id: 'ok',
    label: '确认',
    onClick: () => {
      console.log('cancel');
    },
  },
];
</script>
<template>
  <div class="page-demo">
    <h3>基本</h3>
    <section>
      <OButton @click="toggle('show0', true)">Open</OButton>
      <ODialog v-model:visible="values.show0" :actions="dlgAction" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
      </ODialog>
    </section>
    <h3>延迟响应</h3>
    <section>
      <OButton @click="toggle('show2', true)">Open</OButton>
      <ODialog v-model:visible="values.show2" :before-hide="beforeHide" :before-show="beforeShow" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
        <template #footer>
          <div class="dlg-action">
            <OButton color="primary" variant="solid" @click="toggle('show2', false)">确定</OButton>
            <OButton @click="toggle('show2', false)">取消</OButton>
          </div>
        </template>
      </ODialog>
    </section>
    <h3>插槽</h3>
    <section>
      <OButton @click="toggle('show1', true)">Open</OButton>
      <ODialog v-model:visible="values.show1" @change="onChane">
        <template #header>Dialog Title</template>
        This is Dialog
        <template #footer>
          <div class="dlg-action">
            <OButton color="primary" variant="solid" @click="toggle('show1', false)">确定</OButton>
            <OButton @click="toggle('show1', false)">取消</OButton>
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
