<docs lang="md">
<!--zh-CN-->
### 分页

<!--en-US-->
### Pagination
</docs>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTable, OPagination } from '@opensig/opendesign';
import { requestTableData } from './data';

const columns1 = [
  { label: 'Name', key: 'name' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
  { label: 'Email', key: 'email' },
];

const loading = ref(true);
const data: any = ref([]);
const pagination = reactive({
  total: 0,
});

requestTableData(0, 6).then((res) => {
  data.value = res.list;
  pagination.total = res.total;
  loading.value = false;
});

const onPageChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
  const idx = (page - 1) * pageSize;
  loading.value = true;

  requestTableData(idx, pageSize).then((res) => {
    data.value = res.list;
    pagination.total = res.total;
    loading.value = false;
    console.log(res);
  });
};
</script>
<template>
  <div class="sec">
    <OTable :columns="columns1" :data="data" :loading="loading" :pagination="pagination" @change:page="onPageChange" />
    <OPagination v-if="pagination.total !== 0" :total="pagination.total" @change="onPageChange" />
  </div>
</template>
<style lang="scss">
.sec {
  margin-bottom: 24px;
}
</style>
