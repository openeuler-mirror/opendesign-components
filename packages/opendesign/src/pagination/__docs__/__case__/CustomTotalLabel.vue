<docs lang="md">
<!-- zh-CN -->

### 自定义 total 标签

可以通过 `total` 插槽自定义 total 标签。该插槽接收 `total` 参数（总数据条数）和 `pageCount` 参数（总页数）。

**注意**：`layout` 属性数组中需要包含 `"total"` 以确保该插槽被渲染。

<!-- en-US -->

### Customize the total label

You can customize the total label using the `total` slot.
This slot receives the `total` parameter (total number of data items) and the `pageCount` parameter (total number of pages).

**Note**: The `"total"` string must be included in the `layout` property array to ensure this slot is rendered.
</docs>
<script setup lang="ts">
import { OPagination } from '@opensig/opendesign';
</script>
<template>
  <OPagination :total="100" :page-size="10" :page="1" :show-total="true" :layout="['total', 'pager', 'jumper']">
    <template #total="{ total, pageCount }">
      Contains <b>{{ total }}</b> data items, <b>{{ pageCount }}</b> pages in total.
    </template>
  </OPagination>
</template>
