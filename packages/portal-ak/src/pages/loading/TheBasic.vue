<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OButton, OLoading } from '@components/index';
import CLoadingNumber from '@/ak/components/CLoadingNumber.vue';

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
</script>
<template>
  <h4>全局</h4>
  <OButton @click="showLoading('show1')">Large</OButton>
  <OButton @click="showLoading('show2')">Medium</OButton>
  <OButton @click="showLoading('show3')">Small</OButton>

  <OLoading v-model:visible="loading.show1" main-class="c-loading-lg" :icon="CLoadingNumber" label="加载中" />
  <OLoading v-model:visible="loading.show2" main-class="c-loading-md" :icon="CLoadingNumber" label="加载中" />
  <OLoading v-model:visible="loading.show3" main-class="c-loading-sm" label="加载中" />

  <h4>局部</h4>
  <OButton @click="show2 = !show2">show2:{{ show2 }}</OButton>
  <section>
    <div class="box">
      show2
      <OLoading v-model:visible="show2" main-class="c-loading-md" :wrapper="null" :icon="CLoadingNumber" label="加载中" />
    </div>
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
