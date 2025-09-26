<docs lang="md">
<!-- zh-CN -->

### 使用

`OPopover` 组件本质上与 `OPopup` 没有太大区别，主要的一些差异点是 `OPopover` 调整了 `trigger`、`offset`、`anchor` 属性的默认值，并在 `OPopup` 外部控制`disable`的两种状态。

1. 弹出窗的位置可通过 `position` 属性控制；
2. 弹出窗的触发方式可通过 `trigger` 属性控制；
3. 弹出窗距离触发对象的距离可通过 `offset` 属性控制；
4. 弹出窗的宽度和最小宽度默认为触发对象的宽度，可以通过 `adjustMinWidth` 、 `adjustWidth` 属性调整；
5. 弹出窗的挂载容器的类名可以通过 `wrapClass` 添加，以此避免全局的样式污染；
6. 其他属性的说明请查看下方的 props 表。

<!-- en-US -->

The `OPopover` component is essentially not much different from `OPopup`. The main differences are that `OPopover` adjusts the default values of the `trigger`, `offset`, and `anchor` attributes. And control the two states of `disable` outside `OPopup`.

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

const _schema = {
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

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `<div class="demo-popover-usage-wrap">
            <OPopover class="demo-popover-usage" ${propsToAttrStr(props)}>
              <div>内容文本内容文本内容文本内容文本内容文本</div>
              <template #target>
                <OButton :disabled=${props.disabled} round="pill"> demo-popover </OButton>
              </template>
            </OPopover>
          </div>`;
};

const _ctx = {};
</script>
