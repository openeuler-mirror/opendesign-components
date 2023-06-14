<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OButton, OLoading, vLoading, useLoading } from '@components/index';
import CLoading from './CLoading.vue';
import CLoadingNumber from './CLoadingNumber.vue';

const loading = reactive({
  show1: false,
  show2: false,
  show3: false,
  show4: false,
});
const showLoading = (key: keyof typeof loading) => {
  loading[key] = true;
  setTimeout(() => {
    loading[key] = false;
  }, 1000);
};

const show2 = ref(false);
const show3 = ref(false);
const show4 = ref(false);

const box1 = ref();
const l1 = useLoading({
  label: 'loading',
  icon: CLoadingNumber,
  mainClass: 'c-loading-xl',
  iconRotating: false,
});
const l2 = useLoading(
  {
    label: 'loading',
    icon: CLoading,
    iconRotating: true,
  },
  box1
);
const toggleLoading1 = () => {
  l1.toggle(true);
  setTimeout(() => {
    l1.toggle(false);
  }, 1000);
};
const toggleLoading2 = () => {
  l2.toggle();
};
</script>
<template>
  <h4>全局</h4>
  <OButton @click="showLoading('show1')">ex Large</OButton>
  <OButton @click="showLoading('show2')">Large</OButton>
  <OButton @click="showLoading('show3')">Medium</OButton>
  <OButton @click="showLoading('show4')">Small</OButton>

  <OLoading v-model:visible="loading.show1" main-class="c-loading-xl" :icon="CLoadingNumber" label="加载中" />
  <OLoading v-model:visible="loading.show2" main-class="c-loading-lg" :icon="CLoadingNumber" label="加载中" />
  <OLoading v-model:visible="loading.show3" main-class="c-loading-md" :icon="CLoading" label="加载中" />
  <OLoading v-model:visible="loading.show4" main-class="c-loading-sm" :icon="CLoading" label="加载中" />

  <h4>局部</h4>
  <OButton @click="show2 = !show2">show2:{{ show2 }}</OButton>
  <section>
    <div class="box">
      show2
      <OLoading v-model:visible="show2" class="c-loading-sm" :wrapper="null" />
    </div>
  </section>
  <h4>指令</h4>
  <OButton @click="show3 = !show3">show3:{{ show3 }}</OButton>
  <OButton v-loading.body="show4" @click="show4 = !show4">show4 body:{{ show4 }}</OButton>
  <section>
    <div v-loading="show3" class="box b1">show3</div>
    <div v-loading.nomask="show3" class="box b2">show3 nomask</div>
  </section>
  <h4>服务</h4>
  <OButton @click="toggleLoading1">service to body</OButton>
  <OButton @click="toggleLoading2">service to box</OButton>
  <section>
    <div id="box1" ref="box1" class="box">box</div>
  </section>
</template>
<style lang="scss" scoped>
.box {
  width: 500px;
  height: 300px;
  background-color: #edf;
  position: relative;
}
</style>
