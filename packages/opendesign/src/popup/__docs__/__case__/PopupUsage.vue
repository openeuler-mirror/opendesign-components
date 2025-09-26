<docs lang="md">
<!-- zh-CN -->

### 使用

`OPopup` 是一个通用组件，像很多组件比如 `OPopover`、`ODropdown`、`OSelect` 都会用到该组件。该组件常用的属性如下：

1. 弹出窗通过 `visible` 属性进行双向绑定；
2. 弹出窗的位置可通过 `position` 属性控制；
3. 弹出窗的触发方式可通过 `trigger` 属性控制；
4. 弹出窗距离触发对象的距离可通过 `offset` 属性控制；
5. 弹出窗的锚点可通过 `anchor` 属性控制；
6. 弹出窗的宽度和最小宽度默认为触发对象的宽度，可以通过 `adjustMinWidth` 、 `adjustWidth` 属性调整；
7. 弹出窗的挂载容器的类名可以通过 `wrapClass` 添加，以此避免全局的样式污染；
8. 弹出窗的内容体的类名可以通过 `bodyClass` 添加，以此避免全局的样式污染；
9. 其他属性的说明请查看下方的 props 表。

<!-- en-US -->

`OPopup` is a universal component. Many components, such as `OPopover`, `ODropdown`, and `OSelect`, all use this component. The commonly used attributes of this component are as follows:

1. The pop-up window is bidirectionally bound through the `visible` attribute;

2. The position of the pop-up window can be controlled by the `position` attribute.

3. The triggering method of the pop-up window can be controlled through the `trigger` attribute.

4. The distance between the pop-up window and the triggered object can be controlled by the `offset` attribute.

5. The anchor point of the pop-up window can be controlled through the `anchor` attribute.

6. The width and minimum width of the pop-up window are set by default to the width of the trigger object and can be adjusted through the `adjustMinWidth` and `adjustWidth` properties.

7. The class name of the mount container for the pop-up window can be added through `wrapClass` to avoid global style contamination.

8. The class name of the content body of the pop-up window can be added through `bodyClass` to avoid global style contamination.

9. For explanations of other attributes, please refer to the props table below.

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
  anchor: {
    type: 'boolean',
  },
  wrapClass: {
    type: 'list',
    list: ['o-popup-wrap-test1', 'o-popup-wrap-test2'],
  },
  bodyClass: {
    type: 'list',
    list: ['o-popup-body-test1', 'o-popup-body-test2'],
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `<div class="demo-popup-usage-wrap">
            <OPopup class="demo-popup-usage" wrapper=".demo-popup-usage-wrap" anchor-class="o-popover-anchor"  ${propsToAttrStr(props)}>
              <div>内容文本内容文本内容文本内容文本内容文本</div>
              <template #target>
                <OButton :disabled=${props.disabled} round="pill"> demo-popup </OButton>
              </template>
            </OPopup>
          </div>`;
};

const _ctx = {};
</script>
<style lang="scss">
.demo-popup-usage-wrap {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-bd: none;
  --popup-padding: 8px;
  .o-popup-wrap-test1 {
    --popup-bg-color: pink;
    background-color: pink;
  }
  .o-popup-wrap-test2 {
    max-width: 200px;
  }
  .o-popup-body-test1 {
    color: rgb(0, 47, 167);
  }
  .o-popup-body-test2 {
    --popup-padding: 16px;
  }
}
</style>
