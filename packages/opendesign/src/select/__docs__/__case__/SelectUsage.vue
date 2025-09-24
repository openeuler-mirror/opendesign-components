<docs lang="md">
<!-- zh-CN -->

### 使用

输入框包含 `normal`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large` ；

三种形状：`solid`、`outline`、`text` ；

禁用状态：`disabled` ；

支持多选：`multiple` ；

选择框的圆角可以通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值；

其他属性的说明请查看下方的 props 表。

<!-- en-US -->

### Usage

The input includes four theme colors: `normal`, `success`, `warning`, and `danger`;

Three sizes: `small`, `medium`, and `large`;

Three shapes: `solid`, `outline`, and `text`;

Disabled state: `disabled`;

Support multiple selections: `multiple`;

The rounded corners of the selection box can be set to a semi-circle through 'pill', or they can be other values acceptable to the css property `border-radius`.

For explanations of other attributes, please refer to the props table below.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  placeholder: {
    type: 'string',
    default: '请选择',
  },
  color: {
    type: 'list',
    list: ['normal', 'success', 'warning', 'danger'],
  },
  variant: {
    type: 'list',
    list: ['outline', 'solid', 'text'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  trigger: {
    type: 'list',
    list: ['click', 'none', 'click-outclick', 'hover', 'hover-outclick', 'focus', 'contextmenu'],
  },
  optionPosition: {
    type: 'list',
    list: ['bl', 'top', 'tl', 'tr', 'bottom', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
  },
  optionWidthMode: {
    type: 'list',
    list: ['min-width', 'auto', 'width'],
  },
  disabled: {
    type: 'boolean',
  },
  clearable: {
    type: 'boolean',
    default: true,
  },
  multiple: {
    type: 'boolean',
  },
  loading: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
  { label: 'option 5', value: 'opt5' },
  { label: 'option 6', value: 'opt6' },
  { label: 'option 7', value: 'opt7' },
  { label: 'option 8', value: 'opt8' },
  { label: 'option 9', value: 'opt9' },
  { label: 'option 10', value: 'opt10' },
];

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `  <div class="demo-select-usage-wrap">
  <OSelect v-model=ctx.selectedVal class="demo-select-usage" option-title="选项标题"  ${propsToAttrStr(props)} :max-tag-count="2">
   <OOption v-for="item in ctx.options" :key="item.value" :label="item.label" :value="item.value" />
  </OSelect>
   </div>
  `;
};

const _ctx = reactive({
  selectedVal: [],
  options,
});
</script>
<style lang="scss">
.demo-select-usage-wrap {
  .demo-select-usage {
    width: 100%;
    max-width: 320px;
  }
}
</style>
