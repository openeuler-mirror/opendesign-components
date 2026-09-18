<docs lang="md">
<!-- zh-CN -->

### 浮层中使用表格

`OLayer` 的默认缩放动画（`o-zoom-fade2`，`transform: scale(0.8)`）期间，`ODataTable` 表头高度通过 `offsetHeight` 测量，不受祖先 `transform` 缩放影响，表头分隔线（`split-line` 模式）始终与表体列对齐。

<!-- en-US -->

### Data Table Inside Layer

During `OLayer`'s default zoom animation (`o-zoom-fade2`, `transform: scale(0.8)`), `ODataTable` measures header height via `offsetHeight` — a layout property unaffected by ancestor `transform` scaling. The header divider (`split-line` mode) stays aligned with body columns throughout the animation.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton, DataTableColumnT, ODataTable } from '@opensig/opendesign';

import { getTableData } from '../../../table/__docs__/__case__/data.ts';

const data = ref(getTableData(5));

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Gender', key: 'gender' },
  { label: 'Age', key: 'age' },
  { label: 'Salary', key: 'salary' },
];

const secondLayerVisible = ref(false);
const handleSecondLayerOpen = () => {
  secondLayerVisible.value = true;
};
</script>
<template>
  <div class="layer-doc-custom">
    <OButton @click="handleSecondLayerOpen">Open Layer</OButton>
    <OLayer v-model:visible="secondLayerVisible" wrapper="body">
      <div class="layer-doc-custom-main">
        <h2>Data Table Inside Layer</h2>
        <ODataTable :columns="columns" :data="data" header-style="split-line" border="all" />
      </div>
    </OLayer>
  </div>
</template>
<style lang="scss" scoped>
.layer-doc-custom {
  height: 300px;
  position: relative;
}
.layer-doc-custom-main {
  max-width: 500px;
  padding: 24px;
  background-color: var(--o-color-control5-light);
  margin: auto;
}
</style>
