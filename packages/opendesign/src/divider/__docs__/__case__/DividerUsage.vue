<docs lang="md">
<!-- zh-CN -->

### 使用说明

#### 参数配置

- **variant**：控制分割线形状
  可选值：`solid`（实线）、`dashed`（虚线）、`dotted`（点线）

- **direction**：控制分割线方向
  可选值：`h`（水平）、`v`（垂直）

  - 水平分割线（`direction="h"`）默认宽度占满容器；
  - 垂直分割线（`direction="v"`）默认高度为 `1em`。

- **darker**：控制分割线颜色深浅
  可选值：`true`（深色）、`false`（浅色）

#### 标签

- **限制**：仅水平分割线（`direction="h"`）支持标签功能。
- **标签位置**：通过 `labelPosition` 属性控制，可选值：`left`（左侧）、`center`（中间）、`right`（右侧）。
- **标签内容**：标签文本需放置在组件的 `default` 插槽中。

<!-- en-US -->

### Usage Instructions

#### Props Configuration

- **variant**: Controls the shape of the divider
  Optional values: `solid` (solid line), `dashed` (dashed line), `dotted` (dotted line)

- **direction**: Controls the direction of the divider
  Optional values: `h` (horizontal), `v` (vertical)

  - Horizontal dividers (`direction="h"`) by default fill the full width of the container;
  - Vertical dividers (`direction="v"`) have a default height of `1em`.

- **darker**: Controls the darkness of the divider color
  Optional values: `true` (darker), `false` (lighter)

#### Label

- **Restrictions**: Only horizontal dividers (`direction="h"`) support the label feature.
- **Label Position**: Controlled by the `labelPosition` prop, with optional values: `left` (left side), `center` (middle), `right` (right side).
- **Label Content**: The label text should be placed in the component's default slot.
</docs>

<script setup lang="ts">
import { propsToAttrStr, escapeHTML } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  variant: {
    type: 'list',
    list: ['solid', 'dashed', 'dotted'],
    default: 'solid',
  },
  direction: {
    type: 'list',
    list: ['h', 'v'],
    default: 'h',
  },
  labelPosition: {
    type: 'list',
    list: ['left', 'center', 'right'],
    default: 'center',
  },
  darker: {
    type: 'boolean',
    default: false,
  },
  label: {
    type: 'string',
    default: 'Divider Label',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => `
<ODivider ${propsToAttrStr(props, ['label'])}>${escapeHTML(props.label)}</ODivider>
`;

const _ctx = {};
</script>
