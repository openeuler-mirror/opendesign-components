<docs lang="md">
<!-- zh-CN -->

### 空数据 / 加载状态

未传 `height` 时，空数据与加载状态下的表体保持最小高度（`--table-body-min-height` 默认 200px 扣除表头高度），不会因缺少内容而塌陷；传入 `height` 时，空占位符撑满固定高度扣除表头后的区域。切换按钮可对比两种空状态与加载、正常数据下的表现。

<!-- en-US -->

### Empty Data / Loading State

Without a `height` prop, the table body keeps a minimum height (`--table-body-min-height`, 200px by default, minus the header height) in empty and loading states instead of collapsing; with a `height` prop, the empty placeholder fills the fixed height minus the header. Use the buttons to compare both empty states against loading and normal data.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { DataTableColumnT, ODataTable, OButton } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Gender', key: 'gender' },
  { label: 'Age', key: 'age' },
  { label: 'Salary', key: 'salary' },
  { label: 'Address', key: 'address' },
];

// 当前表格数据、加载状态与固定高度，用于在空数据 / 加载 / 正常数据 / 传 height 空数据等场景间切换
const data = ref<Record<string, any>[]>([]);
const loading = ref(false);
const height = ref<number | undefined>(undefined);

/**
 * @description 进入加载状态：清空数据并展示 loading 遮罩，不传 height
 */
const showLoading = () => {
  loading.value = true;
  data.value = [];
  height.value = undefined;
};

/**
 * @description 进入空数据状态：不传 height，表体依赖最小高度兜底
 */
const showEmpty = () => {
  loading.value = false;
  data.value = [];
  height.value = undefined;
};

/**
 * @description 进入传 height 的空数据状态：空占位符撑满固定高度扣除表头后的区域
 */
const showEmptyWithHeight = () => {
  loading.value = false;
  data.value = [];
  height.value = 300;
};

/**
 * @description 加载正常数据
 */
const showData = () => {
  loading.value = false;
  data.value = getTableData(8);
  height.value = undefined;
};
</script>

<template>
  <div class="data-table-empty-demo">
    <div class="actions">
      <OButton color="primary" variant="solid" @click="showLoading">加载中</OButton>
      <OButton color="primary" variant="solid" @click="showEmpty">空数据</OButton>
      <OButton color="primary" variant="solid" @click="showEmptyWithHeight">空数据 + height</OButton>
      <OButton color="primary" variant="solid" @click="showData">正常数据</OButton>
    </div>
    <ODataTable :columns="columns" :data="data" :loading="loading" :height="height" border="all" />
  </div>
</template>

<style lang="scss" scoped>
.data-table-empty-demo {
  .actions {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
}
</style>
