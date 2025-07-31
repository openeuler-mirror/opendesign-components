import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';
import { getTableData } from './data.ts';
import { TableBorderTypes } from '@opensig/opendesign';

export const docs = {
  'zh-CN':
    '表格用于展示密集数据集，可配置项包括：  \n' +
    '- 表头内容`columns`  \n' +
    '- 表格数据`data`  \n' +
    '- 是否显示边框`border`  \n' +
    '- 是否小表格`small`  \n' +
    '- 单元格合并`cellSpan`  \n' +
    '- 空数据提示文本`emptyLabel`  \n' +
    '- 是否正在加载`loading`  \n' +
    '- 加载提示文本`loadingLabel`  \n'
};

export const schema = {
  border: {
    type: 'list',
    list: TableBorderTypes
  },
  loading: {
    type: 'boolean',
    default: false
  },
  small: {
    type: 'boolean',
    default: false
  },
  emptyLabel: {
    type: 'string',
    default: undefined
  },
  loadingLabel: {
    type: 'string',
    default: undefined
  },
} satisfies Record<string, DocDemoSchema>;

export const ctx = reactive({
  columns: [
    { label: 'Name', key: 'name' },
    { label: 'Salary', key: 'salary' },
    { label: 'Address', key: 'address' },
    { label: 'Email', key: 'email' },
  ],
  data: getTableData(6)
});

export const template:DocDemoTemplate<typeof schema> = (_props) => {
  return `<OTable ${propsToAttrStr(_props)} :columns="ctx.columns" :data="ctx.data" />`;
};