<docs lang="md">
<!--zh-CN-->

### Basic

<!--en-US-->

### Basic
</docs>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { DataTableColumnT, DataTableSpanMethod } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name', fixed: 'left', minWidth: '15%' },
  {
    label: 'children',
    key: 'sum col',
    children: [
      {
        label: 'Salary',
        key: 'salary',
        fixed: 'left',
      },
      { label: 'Address', key: 'address' },
    ],
  },
  {
    label: 'Email',
    key: 'email',
    minWidth: 200,
    formatter: ({ cellValue }) => `the email is ${cellValue}`,
  },
  { label: 'VNode', key: 'other1', formatter: ({ row }) => h('span', { style: 'white-space: nowrap' }, `${row.email} render by VNode`) },
  { label: 'Component', key: 'other2', formatter: () => defineComponent({ render: () => `render by Component` }) },
  { label: 'other', key: 'other', fixed: 'right' },
  { label: 'rightFixed', key: 'rightFixed', fixed: 'right' },
];

const data = ref(getTableData(16));

const spanMethod: DataTableSpanMethod = ({ colIndex, rowIndex }) => {
  if (colIndex === 1 && rowIndex === 2) {
    return { colSpan: 2, rowSpan: 2 };
  }
  if (colIndex === 9 && rowIndex === 4) {
    return { colSpan: 2, rowSpan: 2 };
  }
};
</script>

<template>
  <ODataTable :columns="columns" :data="data" :height="400" border="all" :span-method="spanMethod" column-resizable />
</template>
