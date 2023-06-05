<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '@components/index';

const currentPage = ref(1);
const total = ref(0);
setTimeout(() => {
  total.value = 100;
}, 1000);

const pageSize = 8;
const pageSizes = [8, 16, 32, 64];
const onChange = (value: { page: number; pageSize: number }) => {
  console.log(value);
};
</script>
<template>
  <h4>完整分页</h4>
  <OPagination :total="total" :page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" show-jumper show-total @change="onChange" />
  <h4>精简分页</h4>
  <OPagination v-model:page="currentPage" :total="total" simple @change="onChange" />
</template>
<style lang="scss"></style>
