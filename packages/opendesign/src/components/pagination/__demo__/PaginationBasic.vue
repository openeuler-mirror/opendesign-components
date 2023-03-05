<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(5);
const total = ref(100);

// setTimeout(() => {
//   total.value = 50;
// }, 2000);

const pageSize = 8;
const pageSizes = [8, 16, 32, 64];
const onChange = (value: { page: number; pageSize: number }) => {
  console.log(value);
};
</script>
<template>
  <h4>Variant & Round</h4>
  <section>
    <div>
      <div>Outline</div>
      <div class="row">
        <OPagination :total="total" :page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" show-jumper @change="onChange" />
        <OPagination :total="total" :page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" round="pill" show-jumper @change="onChange" />
        <OPagination :total="total" :page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" round="12px" show-jumper @change="onChange" />
      </div>
    </div>
    <div>
      <div>Solid</div>
      <div class="row">
        <OPagination :total="total" :page="currentPage" :page-size="pageSize" :page-sizes="pageSizes" variant="solid" show-jumper @change="onChange" />
        <OPagination
          :total="total"
          round="pill"
          :page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          variant="solid"
          show-jumper
          @change="onChange"
        />
        <OPagination
          :total="total"
          round="12px"
          :page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          variant="solid"
          show-jumper
          @change="onChange"
        />
      </div>
    </div>
  </section>
  <h4>Simple</h4>
  <section>
    <div>当前页：{{ currentPage }}</div>
    <div class="row">
      <OPagination v-model:page="currentPage" :total="100" simple @change="onChange" />
      <OPagination v-model:page="currentPage" variant="solid" :total="100" simple @change="onChange" />
      <OPagination v-model:page="currentPage" variant="solid" :total="100" simple round="pill" @change="onChange" />
    </div>
  </section>
</template>
<style lang="scss"></style>
