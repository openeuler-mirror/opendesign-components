<script setup lang="ts">
import { ref } from 'vue';
import { OButton, vLoading, setVLoadingOption } from '@opendesign-src/index';
import CLoadingNumber from '@/ak/components/CLoadingNumber.vue';

const show3 = ref(false);
const show4 = ref(false);

// 指令
setVLoadingOption({
  icon: CLoadingNumber,
  mainClass: 'c-loading-md',
  label: 'v loading',
});
</script>
<template>
  <h4>指令</h4>
  <OButton @click="show3 = !show3">show3:{{ show3 }}</OButton>
  <OButton v-loading.body="show4" @click="show4 = !show4">show4 body:{{ show4 }}</OButton>
  <section>
    <div v-loading="show3" class="box b1">show3</div>
    <div v-loading.nomask="show3" class="box b2">show3 nomask</div>
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
