<script setup lang="ts">
import { ref } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(5);
const total = ref(5000);

const pageSize = 8;
const pageSizes = [8, 16, 32, 64];

const currentPage2 = ref();
const pageSize2 = ref(6);
const onChange = (newValue: { page: number; pageSize: number }, oldValue: { page: number; pageSize: number }) => {
  console.log('onChange', newValue.page, newValue.pageSize, oldValue.page, oldValue.pageSize);
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
  <h4>Other</h4>
  <div>
    <div>
      <div>pageSize不在pageSizes内，使用默认的pageSizes第一项</div>

      <p>currentPage: {{ currentPage }}; pageSize: {{ pageSize }}</p>
      <div>
        <OPagination
          :total="total"
          v-model:page="currentPage2"
          show-total
          v-model:page-size="pageSize2"
          :page-sizes="pageSizes"
          round="12px"
          @change="onChange"
        >
          <template #total> total: -- {{ total }} --</template>
        </OPagination>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
