<script setup lang="ts">
import { ref } from 'vue';
import { OButton, useLoading } from '@components/index';
import CLoadingNumber from '@/ak/components/CLoadingNumber.vue';

const box1 = ref();
const l1 = useLoading({
  label: 'loading',
  icon: CLoadingNumber,
  mainClass: 'c-loading-lg',
});
const l2 = useLoading(
  {
    label: 'loading',
    icon: CLoadingNumber,
    mainClass: 'c-loading-md',
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
