<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { OPagination } from '../index';
const currentPage = ref(2);
const total = ref(5000);

const pageSize = ref(8);
const pageSizes = [8, 16, 32, 64];
const onChange = (newValue: { page: number; pageSize: number }, oldValue: { page: number; pageSize: number }) => {
  console.log('onChange', newValue.page, newValue.pageSize, oldValue.page, oldValue.pageSize);
};

watchEffect(() => {
  console.log('currentPage', currentPage.value, 'pageSize', pageSize.value);
});
</script>
<template>
  <h4>Variant & Round</h4>
  <div>
    currentPage: {{ currentPage }}; pageSize: {{ pageSize }}
    <div>
      <div>Outline</div>
      <div>
        <OPagination :total="12" :page="1" :page-size="12" show-total @change="onChange" />
        <br />
        <OPagination
          :total="total"
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          show-total
          :page-sizes="pageSizes"
          round="pill"
          @change="onChange"
        />
        <br />
        <OPagination
          :total="total"
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          show-total
          :page-sizes="pageSizes"
          round="12px"
          @change="onChange"
        />
      </div>
    </div>
    <div>
      <div>Solid</div>
      <div>
        <OPagination
          :total="total"
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          show-total
          :page-sizes="pageSizes"
          variant="solid"
          @change="onChange"
        />
        <br />
        <OPagination
          :total="total"
          round="pill"
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          show-total
          :page-sizes="pageSizes"
          variant="solid"
          @change="onChange"
        />
        <br />
        <OPagination
          :total="total"
          round="12px"
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          show-total
          :page-sizes="pageSizes"
          variant="solid"
          @change="onChange"
        />
      </div>
    </div>
  </div>
  <div>
    <h4>ShowMore = false</h4>
    <div>
      <OPagination :total="200" :page="1" :page-size="12" show-total :show-more="false" @change="onChange" />
    </div>
  </div>
  <h4>Simple</h4>
  <section>
    <div>当前页：{{ currentPage }}</div>
    <div class="row">
      <OPagination v-model:page="currentPage" :total="100" simple @change="onChange" />
      <br />
      <OPagination v-model:page="currentPage" variant="solid" :total="100" simple @change="onChange" />
      <br />
      <OPagination v-model:page="currentPage" variant="solid" :total="100" simple round="pill" @change="onChange" />
    </div>
  </section>
</template>
<style lang="scss"></style>
