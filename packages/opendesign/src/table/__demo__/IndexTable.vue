<script setup lang="ts">
import '../style';
import '../../pagination/style';

import TableBasic from './TableBasic.vue';
import TablePagination from './TablePagination.vue';
import TableSpan from './TableSpan.vue';
import TableDiyHead from './TableDiyHead.vue';
</script>
<template>
  <div class="page-demo">
    <TableBasic />
    <TableDiyHead />
    <TableSpan />
    <TablePagination />
  </div>
</template>
<style lang="scss"></style>
