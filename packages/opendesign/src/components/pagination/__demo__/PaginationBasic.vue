<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(5);
// setTimeout(() => {
//   currentPage.value = 3;
// }, 2000);
const onChange = (value: { current: number; size: number }) => {
  console.log(value);
};
</script>
<template>
  <h4>Basic</h4>
  <div class="sec">
    <OPagination :total="100" :current-page="currentPage" @change="onChange" />
  </div>
  <h4>Simple</h4>
  <div class="sec">
    <OPagination :total="100" :current-page="currentPage" simple @change="onChange" />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
