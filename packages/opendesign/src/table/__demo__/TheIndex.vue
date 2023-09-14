<script setup lang="ts">
import '../style';
import '../../pagination/style';

import TableBasic from './TableBasic.vue';
import TableDiy from './TableDiy.vue';
import TablePagination from './TablePagination.vue';
import TableSpan from './TableSpan.vue';
import TableDiyHead from './TableDiyHead.vue';
</script>
<template>
  <div class="page-demo">
    <TableDiy />
    <TableSpan />
    <TableBasic />
    <TableDiyHead />
    <TablePagination />
  </div>
</template>
<style lang="scss"></style>
