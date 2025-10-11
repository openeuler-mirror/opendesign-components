<docs lang="md">
<!-- zh-CN -->

### 自定义每页显示数量选项

当数据总量 `total` 固定时，每页显示数量 `pageSize` 越大，总页数就越少。用户可通过选择器设置每页显示的数据条数。
默认提供 `[6, 12, 24, 48]` 四个选项，分别表示每页显示 6 条、12 条、24 条 或 48 条 数据。
你也可以通过 `pageSizes` 属性自定义这些选项。

<!-- en-US -->

### Custom Page Size Options

When the total data count `total` is fixed, a larger `pageSize` (number of items per page) results in a smaller total number of pages.
Users can set the number of items displayed per page using a selector.
By default, four options are provided: `[6, 12, 24, 48]`, which correspond to displaying 6, 12, 24, or 48 items per page.
You can also customize these options using the `pageSizes` property.
</docs>
<script setup lang="ts">
import { OPagination } from '@opensig/opendesign';

const pageSizes = [10, 20, 30, 40, 50];
</script>
<template>
  <OPagination :total="100" :page-sizes="pageSizes" />
</template>
