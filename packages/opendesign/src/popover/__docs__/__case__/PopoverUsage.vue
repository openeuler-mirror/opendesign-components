<docs lang="md">
<!-- zh-CN -->

### 使用

`OPopover` 适合作为某个元素的**扩展解释气泡**，即弹出内容与触发元素是「说明」关系而非功能关系，例如字段名称的说明、图标的含义提示、操作的确认提醒等。`OPopover` 基于 `OPopup` 封装，相比 `OPopup` 默认以悬停触发、默认显示锚点箭头、默认有 8px 间距。若触发元素与弹出内容存在强功能绑定（如下拉列表、日历面板），请直接使用 `OPopup`。

`OPopover` 调整了 `trigger`、`offset`、`anchor` 属性的默认值，并在 `OPopup` 外部控制 `disable` 的两种状态。常用属性如下：

1. 弹出窗的位置可通过 `position` 属性控制；
2. 弹出窗的触发方式可通过 `trigger` 属性控制；
3. 弹出窗距离触发对象的距离可通过 `offset` 属性控制；
4. 弹出窗的宽度和最小宽度默认为触发对象的宽度，可以通过 `adjustMinWidth` 、 `adjustWidth` 属性调整；
5. 弹出窗的挂载容器的类名可以通过 `wrapClass` 添加，以此避免全局的样式污染；
6. 其他属性的说明请查看下方的 props 表。

<!-- en-US -->

`OPopover` is designed as a **supplementary explanation bubble** for an element — where the popup content serves an explanatory role rather than a functional one. Typical use cases include field descriptions, icon meaning hints, and operation confirmation tips. `OPopover` is built on top of `OPopup`, with different defaults: hover trigger, anchor arrow enabled, and 8px offset. If the trigger and popup have a strong functional binding (such as a dropdown list or a calendar panel), use `OPopup` directly instead.

The `OPopover` component adjusts the default values of the `trigger`, `offset`, and `anchor` attributes, and controls the two `disable` states outside `OPopup`. The commonly used attributes are:

1. The position of the pop-up window can be controlled by the `position` attribute.

2. The triggering method of the pop-up window can be controlled through the `trigger` attribute.

3. The distance between the pop-up window and the triggered object can be controlled by the `offset` attribute.

4. The width and minimum width of the pop-up window are set by default to the width of the trigger object and can be adjusted through the `adjustMinWidth` and `adjustWidth` properties.

5. The class name of the mount container for the pop-up window can be added through `wrapClass` to avoid global style contamination.

6. For explanations of other attributes, please refer to the props table below.

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  position: {
    type: 'list',
    list: ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
  },
  trigger: {
    type: 'list',
    list: ['hover', 'click', 'click-outclick', 'hover-outclick', 'focus', 'contextmenu', 'none'],
  },
  offset: {
    type: 'number',
    default: 8,
  },
  adjustMinWidth: {
    type: 'boolean',
    default: true,
  },
  adjustWidth: {
    type: 'boolean',
    default: true,
  },
  disabled: {
    type: 'boolean',
  },
  wrapper: {
    type: 'list',
    list: ['body', '.demo-popover-usage-wrap'],
  },
  wrapClass: {
    type: 'string',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div class="demo-popover-usage-wrap">
            <OPopover class="demo-popover-usage" ${propsToAttrStr(props)}>
              <div>内容文本内容文本内容文本内容文本内容文本</div>
              <template #target>
                <OButton :disabled=${props.disabled} round="pill"> demo-popover </OButton>
              </template>
            </OPopover>
          </div>`;
};

const _oCtx = {};
</script>
