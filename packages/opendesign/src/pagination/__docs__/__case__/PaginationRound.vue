<docs lang="md">
<!-- zh-CN -->

### 控件圆角

可以通过 `round` 属性设置控件圆角。取值有半圆 `pill`，或其余 `border-radius` 可接受的值

<!-- en-US -->

### Control Border Radius

The border radius of the control can be set using the `round` property.
Acceptable values include `pill` for a fully rounded appearance, or any other valid `border-radius` value.
</docs>
<script setup lang="ts">
import { OPagination } from '@opensig/opendesign';
</script>
<template>
  <OPagination :total="24" round="pill" class="pagination-round-demo" />
  <OPagination :total="24" round="4px" class="pagination-round-demo" />
  <OPagination :total="24" round="var(--o-radius-m)" class="pagination-round-demo" />
</template>
<style scoped lang="scss">
.pagination-round-demo + .pagination-round-demo {
  margin-top: 12px;
}
</style>
