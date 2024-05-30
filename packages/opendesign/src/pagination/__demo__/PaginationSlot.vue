<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(5);
const total = ref(5000);

const pageSize = 8;
const pageSizes = [8, 16, 32, 64];
const onChange = (value: { page: number; pageSize: number }) => {
  console.log(value);
};
</script>
<template>
  <h4>Slot</h4>
  <div>
    <div>
      <div>total</div>
      <div>
        <OPagination :total="total" :page="currentPage" show-total :page-size="pageSize" :page-sizes="pageSizes" round="12px" @change="onChange">
          <template #total> total: -- {{ total }} --</template>
        </OPagination>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
