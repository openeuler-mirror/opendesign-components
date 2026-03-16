<docs lang="md">
<!--zh-CN-->

### Basic

<!--en-US-->

### Basic
</docs>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { DataTableColumnT, DataTableSpanMethod, ODataTable, OIconCalendar } from '@opensig/opendesign';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';
import '../../style';

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name', fixed: 'left', minWidth: '15%', description: 'this is name col description' },
  {
    label: 'children',
    key: 'sumCol',
    children: [
      { label: 'Salary', key: 'salary' },
      { label: 'Address', key: 'address' },
      {
        label: () => h('span', { style: 'display: inline-flex;gap: 4px; align-items: center;' }, [h(OIconCalendar), 'Email']),
        key: 'email',
        minWidth: 200,
        formatter: ({ cellValue }) => `the email is ${cellValue}`,
      },
      {
        label: 'Custom Colspan',
        key: 'age',
        customColSpan: 2,
      },
      { label: 'Gender', key: 'gender' },
    ],
  },
  {
    label: 'Ellipses Table Cells - showOverflowToolTip',
    key: 'ellipses',
    formatter: ({ row }) => h('span', `${row.email} text has overflowed`),
    minWidth: 130,
    maxWidth: 180,
    showOverflowToolTip: 2,
    showHeaderOverflowToolTip: 2,
  },
  { label: 'VNode', key: 'other1', formatter: ({ row }) => h('span', { style: 'white-space: nowrap' }, `${row.email} render by VNode`) },
  { label: 'Component', key: 'other2', formatter: () => defineComponent({ render: () => `render by Component` }) },
  { label: 'other', key: 'other' },
  { label: 'rightFixed', key: 'rightFixed', fixed: 'right' },
];

const data = ref(getTableData(16));

const spanMethod: DataTableSpanMethod = ({ colIndex, rowIndex }) => {
  if (colIndex === 1 && rowIndex === 2) {
    return { colSpan: 2, rowSpan: 2 };
  }
  if (colIndex === 9 && rowIndex === 4) {
    return { rowSpan: 2 };
  }
};
</script>

<template>
  <ODataTable :columns="columns" :data="data" :height="400" border="all" :span-method="spanMethod" column-resizable highlight-current-row />
</template>
