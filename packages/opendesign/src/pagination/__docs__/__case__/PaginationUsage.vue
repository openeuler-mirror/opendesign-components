<docs lang="md">
<!-- zh-CN -->

### 使用

`layout`: 设置显示的控件，通过数组组合

- `total`: 总数据量标签
- `pagesize`: 每页数据条数选择器
- `pager`: 页码按钮
- `jumper`: 页码跳转输入框

`variant`: 按钮形状

- `outline`: 空心按钮
- `solid`: 实心按钮

`showPageCount`: 最多显示多少个页码按钮

`showMore`: 当鼠标悬停省略按钮时是否弹出省略的页码（当总页数多余 `showPageCount` 时显示省略按钮）

`simple`: 是否使用简单布局。使用简单布局时，`layout` 以及 `showPageCount` 属性失效

<!-- en-US -->

### Usage

`layout`: Configure the displayed controls via an array combination

- `total`: Total data count label
- `pagesize`: Page size selector (items per page)
- `pager`: Page number buttons
- `jumper`: Page jump input field

`variant`: Button style variant

- `outline`: Outline buttons
- `solid`: Solid buttons

`showPageCount`: Maximum number of page buttons to display

`showMore`: Whether to show omitted page numbers in a popup when hovering over the ellipsis button
(ellipsis button appears when total pages exceed `showPageCount`)

`simple`: Whether to use the simplified layout. When using the simplified layout, the `layout` and `showPageCount` properties become ineffective.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = reactive({
  variant: {
    type: 'list',
    list: ['outline', 'solid'],
    default: 'outline',
  },
  showPageCount: {
    type: 'number',
    default: 5,
    disabled: false as boolean,
  },
  showMore: {
    type: 'boolean',
    default: true,
  },
  simple: {
    type: 'boolean',
  },
  totalLabel: {
    type: 'boolean',
    default: true,
    disabled: false as boolean,
  },
  pagesizeCtrl: {
    type: 'boolean',
    default: true,
    disabled: false as boolean,
  },
  pagerCtrl: {
    type: 'boolean',
    default: true,
    disabled: false as boolean,
  },
  jumperCtrl: {
    type: 'boolean',
    default: true,
    disabled: false as boolean,
  },
}) satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  let layoutStr = '';
  if (props.simple) {
    _oSchema.jumperCtrl.disabled = true;
    _oSchema.pagesizeCtrl.disabled = true;
    _oSchema.pagerCtrl.disabled = true;
    _oSchema.totalLabel.disabled = true;
    _oSchema.showPageCount.disabled = true;
  } else {
    const layout: string[] = [];
    if (props.totalLabel) layout.push('total');
    if (props.pagesizeCtrl) layout.push('pagesize');
    if (props.pagerCtrl) layout.push('pager');
    if (props.jumperCtrl) layout.push('jumper');
    layoutStr = ` :layout='${JSON.stringify(layout)}'`;
    _oSchema.jumperCtrl.disabled = false;
    _oSchema.pagesizeCtrl.disabled = false;
    _oSchema.pagerCtrl.disabled = false;
    _oSchema.totalLabel.disabled = false;
    _oSchema.showPageCount.disabled = false;
  }
  return `<OPagination :total="100" ${propsToAttrStr(props, ['jumperCtrl', 'pagerCtrl', 'pagesizeCtrl', 'totalLabel'])}${layoutStr} />`;
};

const _oCtx = {};
</script>
