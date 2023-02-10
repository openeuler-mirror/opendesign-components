<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(5);
const total = ref(100);

setTimeout(() => {
  total.value = 50;
}, 2000);

const pageSize = 8;
const pageSizes = [8, 16, 32, 64];
const onChange = (value: { current: number; size: number }) => {
  console.log(value);
};
</script>
<template>
  <h4>Basic</h4>
  <div class="sec">
    <OPagination :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" @change="onChange" />
  </div>
  <h4>Simple</h4>
  <div class="sec">
    <div>当前页：{{ currentPage }}</div>
    <OPagination v-model:current-page="currentPage" :total="100" simple @change="onChange" />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
