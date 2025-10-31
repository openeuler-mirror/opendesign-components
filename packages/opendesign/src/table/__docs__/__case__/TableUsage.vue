<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';
import { getTableData } from './data.ts';
import { TableBorderTypes } from '@opensig/opendesign';

const _oSchema = {
  border: {
    type: 'list',
    list: TableBorderTypes,
  },
  loading: {
    type: 'boolean',
    default: false,
  },
  small: {
    type: 'boolean',
    default: false,
  },
  emptyLabel: {
    type: 'string',
    default: undefined,
  },
  loadingLabel: {
    type: 'string',
    default: undefined,
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  columns: [
    { label: 'Name', key: 'name' },
    { label: 'Salary', key: 'salary' },
    { label: 'Address', key: 'address' },
    { label: 'Email', key: 'email' },
  ],
  data: getTableData(6),
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  return `<OTable ${propsToAttrStr(_props)} :columns="ctx.columns" :data="ctx.data" />`;
};
</script>
