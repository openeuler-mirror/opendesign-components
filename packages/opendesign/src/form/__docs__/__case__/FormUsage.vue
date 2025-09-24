<docs lang="md">
<!-- zh-CN -->

### 使用

目前`OForm` 支持的表单项有 `OInput`、`OInputNumber`、`OTextarea`、`OSelect`、`OCheckboxGroup`、`ORadioGroup`、`OUpload`

`layout`

- `h`: 水平布局（标签与控件在同一行）
- `v`: 垂直布局
- `inline`: 行内布局

`labelAlign`: 标签与控件之前垂直对其方式

- `top`: 标签顶部对其
- `center`: 标签居中对其
- `bottom`: 标签底部对其

`labelJustify`: 标签水平对齐方式

- `left`: 标签左对齐
- `center`: 标签居中对齐
- `right`: 标签右对齐

`labelWidth`: 标签宽度

`labelAlign` `labelJustify` 和 `labelWidth` 可通过 `OForm` 统一设置，也可通过 `OFormItem` 单独设置。

<!-- en-US -->

### Usage

Currently, the form items supported by `OForm` include `OInput`, `OInputNumber`, `OTextarea`, `OSelect`, `OCheckboxGroup`, `ORadioGroup`, and `OUpload`.

`layout`

- `h`: Horizontal layout (label and control on the same line)
- `v`: Vertical layout
- `inline`: Inline layout

`labelAlign`: Vertical alignment between the label and the control

- `top`: Label aligns to the top
- `center`: Label aligns to the center
- `bottom`: Label aligns to the bottom

`labelJustify`: Horizontal alignment of the label

- `left`: Label aligns to the left
- `center`: Label aligns to the center
- `right`: Label aligns to the right

`labelWidth`: Label width

`labelAlign`, `labelJustify`, and `labelWidth` can be uniformly set via `OForm` or individually set via `OFormItem`.
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  layout: {
    type: 'list',
    list: ['h', 'v', 'inline'],
    default: 'h',
  },
  labelAlign: {
    type: 'list',
    list: ['top', 'center', 'bottom'],
    default: 'top',
  },
  labelJustify: {
    type: 'list',
    list: ['left', 'center', 'right'],
    default: 'left',
  },
  labelWidth: {
    type: 'string',
    default: '80px',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `
<div>
  <OForm has-required ${propsToAttrStr(props)}>
    <OFormItem label="Title 1" required>
      <OInput />
    </OFormItem>
    <OFormItem label="Long title long title">
      <OSelect>
        <OOption v-for="item in ctx.options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </OFormItem>
    <OFormItem label="Title 3">
      <OTextarea />
    </OFormItem>
  </OForm>
</div>`;
};

const _ctx = {
  options: [
    { label: 'option 1', value: 'opt1' },
    { label: 'long long long long long long long long long long long long text option 2', value: 'opt2' },
    { label: 'option 3', value: 'opt3' },
    { label: 'option 4', value: 'opt4' },
  ],
};
</script>
