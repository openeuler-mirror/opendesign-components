<docs lang="md">
<!-- zh-CN -->

### 使用

选中值: 通过 `modelValue` 完成双向绑定。`modelValue`的数据类型为`CascaderValueT`

圆角：通过 `round` 属性设置圆角，值为 `border-radius` 的值，或者 `pill`(半圆) 这个特殊值

按钮样式：通过 `variant` 属性设置按钮样式，值为 `solid`(实心)、`outline`(描边)、`text`(文字) 三种

选项框显示位置：通过 `optionPosition` 属性设置：

- `top`：顶部， `bottom`：底部，`left`：左侧，`right`：右侧
- `tl`, `tr`, `bl`, `br`, `lt`, `lb`, `rt`, `rb`：第一个字母表示位置，第二个字母表示对齐方式

  | 值  | 描述                 |
  | --- | -------------------- |
  | tl  | 显示在顶部，左对齐   |
  | tr  | 显示在顶部，右对齐   |
  | bl  | 显示在底部，左对齐   |
  | br  | 显示在底部，右对齐   |
  | lt  | 显示在左侧，顶部对齐 |
  | lb  | 显示在左侧，底部对齐 |
  | rt  | 显示在右侧，顶部对齐 |
  | rb  | 显示在右侧，底部对齐 |

选项: 通过 `options` 属性设置选项。`options` 的数据类型为 `CascaderOptionT[]`：

```ts:line-numbers
type CascaderNodeValueT = string | number;
type CascaderNodePathT = Array<CascaderNodeValueT>;
// modelValue 的数据类型
type CascaderValueT = CascaderNodeValueT | CascaderNodePathT;

// options 的数据类型
type CascaderOptionT = {
  value: CascaderNodeValueT;
  label?: string;
  children?: CascaderOptionT[];
};
```

<!-- en-US -->

### Usage

Selected value: Achieve two-way binding via `modelValue`.The type of `options` is `Array<PopupOptionT>`

Rounded corners: Set via the `round` property, accepts valid `border-radius` values or the special value `pill` (half-circle).

Button style: Configure via the `variant` property, available values: `solid`, `outline`, `text`.

Option box position: Set via `optionPosition`:

- `top`, `bottom`, `left`, `right`: Basic positions
- `tl`, `tr`, `bl`, `br`, `lt`, `lb`, `rt`, `rb`: First letter indicates position, second letter indicates alignment

  | Value | Description           |
  | ----- | --------------------- |
  | tl    | Top, left-aligned     |
  | tr    | Top, right-aligned    |
  | bl    | Bottom, left-aligned  |
  | br    | Bottom, right-aligned |
  | lt    | Left, top-aligned     |
  | lb    | Left, bottom-aligned  |
  | rt    | Right, top-aligned    |
  | rb    | Right, bottom-aligned |

Options: Configure via the `options` property. The type of `options` is `Array<PopupOptionT>`:

```ts:line-numbers
type CascaderNodeValueT = string | number;
type CascaderNodePathT = Array<CascaderNodeValueT>;
// CascaderValueT is the type of modelValue.
type CascaderValueT = CascaderNodeValueT | CascaderNodePathT;

// CascaderOptionT is the type of options.
type CascaderOptionT = {
  value: CascaderNodeValueT;
  label?: string;
  children?: CascaderOptionT[];
};
```
</docs>
<script lang="ts" setup>
import { reactive } from 'vue';
import { DocDemoTemplate, DocDemoSchema } from '../../../_demo/types';
import { propsToAttrStr } from '../../../_demo/utils';

const _schema = {
  pathMode: {
    type: 'boolean',
    default: false,
  },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  variant: {
    type: 'list',
    list: ['solid', 'outline', 'text'],
  },
  placeholder: {
    type: 'string',
    default: 'Please select',
  },
  optionPosition: {
    type: 'list',
    list: ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
    default: 'bl',
  },
} satisfies Record<string, DocDemoSchema>;

const _ctx = reactive({
  modelValue: '' as string | number | Array<string | number>,
  options: [
    {
      label: 'Option 1',
      value: '1',
      children: [
        {
          label: 'Sub-option 1-1',
          value: '1-1',
          children: [
            {
              label: 'Sub-option 1-1-1',
              value: '1-1-1',
            },
            {
              label: 'Sub-option 1-1-2',
              value: '1-1-2',
            },
          ],
        },
        {
          label: 'Sub-option 1-2',
          value: '1-2',
        },
      ],
    },
    {
      label: 'Option 2',
      value: '2',
      children: [
        {
          label: 'Sub-option 2.1',
          value: '2.1',
        },
        {
          label: 'Sub-option 2.2',
          value: '2.2',
        },
      ],
    },
  ],
});
const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `
<OCascader
  v-model="ctx.modelValue"
  :options="ctx.options"
  ${propsToAttrStr(props)}
  class="cascader-doc-usage"
/>
<p>Selected: </p>
<pre>{{ ctx.modelValue }}</pre>
`;
};
</script>
