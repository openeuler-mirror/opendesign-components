<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>

<script setup lang="tsx">
import { defineComponent, h, reactive } from 'vue';
import { DataTableColumnT, DataTableSpanMethod, TableBorderTypes, OLink, OIconSkill, OIconCalendar } from '@opensig/opendesign';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';

const _oSchema = {
  size: {
    type: 'list',
    list: ['medium', 'small'],
  },
  height: {
    type: 'number',
    default: 400,
    disabled: false as boolean,
  },
  columnResizable: {
    type: 'boolean',
    default: false,
  },
  stripe: {
    type: 'boolean',
    default: false,
  },
  headerGroup: {
    type: 'boolean',
    default: false,
  },
  headerFixed: {
    type: 'boolean',
    default: true,
  },
  columnFixed: {
    type: 'boolean',
    default: false,
  },
  border: {
    type: 'list',
    list: TableBorderTypes,
  },
  spanMethod: {
    type: 'boolean',
    default: false,
  },
  loading: {
    type: 'boolean',
    default: false,
  },
  empty: {
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
  rowKey: {
    type: 'string',
    default: 'key',
    disabled: true,
  },
} satisfies Record<string, DocDemoSchema>;

const getColumns = (options: { headerGroup: boolean; columnFixed: boolean }) => {
  const { headerGroup, columnFixed } = options;
  const base: DataTableColumnT[] = [{ label: 'Name', key: 'name', fixed: columnFixed ? 'left' : undefined, width: '15%' }];
  const children: DataTableColumnT[] = [
    {
      label: 'Salary',
      key: 'salary',
      width: '84px',
    },
    { label: 'Address', key: 'address' },
  ];
  if (headerGroup) {
    base.push({
      label: 'headerGroup',
      key: 'header group',
      children,
    });
  } else {
    base.push(...children);
  }
  base.push(
    {
      label: () => h('span', [h(OIconCalendar), 'Email']),
      key: 'email',
      minWidth: 200,
      formatter: ({ cellValue }) => `the email is ${cellValue}`,
    },
    { label: 'VNode', key: 'other1', minWidth: 50, formatter: () => h(OIconSkill, { style: 'font-size: var(--line-height);' }) },
    { label: 'VNode2', key: 'ot1her1', minWidth: 50, formatter: () => () => h(OIconSkill, { style: 'font-size: var(--line-height);' }) },
    { label: 'Component', key: 'other2', formatter: () => defineComponent({ render: () => `render by Component` }) },
    { label: 'Empty', key: 'noSuchProp' },
  );
  if (columnFixed) {
    base.push(
      { label: 'placeholder', key: 'other4' },
      { label: 'placeholder', key: 'other5' },
      { label: 'placeholder', key: 'other6' },
      { label: 'placeholder', key: 'other7' },
    );
  }
  base.push({
    label: 'operations',
    key: 'rightFixed',
    fixed: columnFixed ? 'right' : undefined,
    width: '150px',
    formatter: ({ row }) => {
      return () => (
        <div style="display: flex; gap: 8px; white-space: nowrap;">
          <OLink>operation1</OLink>
          <OLink>operation2</OLink>
        </div>
      );
    },
  });
  return base;
};

const _oCtx = reactive<{ columns: DataTableColumnT[]; data: any[]; spanMethod: DataTableSpanMethod }>({
  columns: [],
  data: [],
  spanMethod: ({ colIndex, rowIndex }) => {
    if (colIndex === 1 && rowIndex === 2) {
      return { colSpan: 2, rowSpan: 2 };
    }
    if (colIndex === 9 && rowIndex === 4) {
      return { colSpan: 2, rowSpan: 2 };
    }
  },
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  // @ts-ignore
  _oCtx.columns = getColumns(_props);
  _oCtx.data = _props.loading || _props.empty ? [] : getTableData(15);
  _oSchema.height.disabled = !_props.headerFixed;
  return `
<ODataTable 
  class="usage-demo-data-table"
  ${propsToAttrStr({ ..._props, spanMethod: undefined, height: _props.headerFixed ? _props.height : undefined })} 
  :columns="ctx.columns"
  :data="ctx.data"
  ${_props.spanMethod ? ':span-method="ctx.spanMethod"' : ''}
/>
  `;
};
</script>

<style lang="scss">
.usage-demo-data-table {
  white-space: nowrap;
  max-width: 900px;
}
</style>
