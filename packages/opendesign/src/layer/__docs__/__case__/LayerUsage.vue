<docs lang="md">
<!-- zh-CN -->

### 使用

`transitionOrign`：设置内容盒子缩放动画的原点，即设置 css 属性 `transform-origin` 的值。取值有：

- `'mouse'`: 鼠标点击的位置（默认值）
- `'css'`: 通过 css 变量 `--layer-origin` 设置（`--layer-origin` 默认值为 `center`）

`wrapper`：设置浮层渲染的父节点。取值有：

- `'body'`: 渲染到 body 元素下（默认值），浮层的 `position` 属性为 `fixed`
- `string-selector`: 渲染到指定元素下，通过 `querySelector` 查询
- `HTMLElement`: 渲染到指定元素下
- `null`: 渲染到当前元素下，浮层的 `position` 属性为 `absolute`。
  **注**：若浮层元素的[包含块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Containing_block)是 `body` 元素，
  则浮层仍然会全屏覆盖，通常将当前元素的`position` 属性设置为 `relative` 来避免此情况。

`mask`：设置是否渲染遮罩层

`maskClose`：点击遮罩层时是否关闭浮层

`buttonClose`：是否渲染关闭按钮

<!-- en-US -->

### Usage

`transitionOrign`: Sets the origin point for the scaling animation of the content box, i.e., sets the value of the CSS property `transform-origin`. Values are:

- `'mouse'`: The position where the mouse clicks (default value).
- `'css'`: Set via CSS variable `--layer-origin` (the default value of `--layer-origin` is `center`).

`wrapper`: Sets the parent node for rendering the layer. Values are:

- `'body'`: Render under the body element (default), the layer's `position` property is `fixed`.
- `string-selector`: Render under the specified element, queried via `querySelector`.
- `HTMLElement`: Render under the specified element.
- `null`: Render under the current element, the layer's `position` property is `absolute`.
  **Note**: If the [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Containing_block) of the layer element is the body element,
  the layer will still cover the entire screen. Usually, set the `position` property of the current element to `relative` to avoid this situation.

`mask`: Sets whether to render the mask layer.

`maskClose`: Sets whether to close the layer when clicking the mask layer.

`buttonClose`: Sets whether to render the close button.
</docs>
<script setup lang="ts">
import { reactive, markRaw } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  transitionOrign: {
    type: 'list',
    list: ['mouse', 'css'],
    default: 'mouse',
    label: 'Transition origin',
  },
  wrapper: {
    type: 'list',
    list: ['body', 'null'],
    default: 'body',
    label: 'Wrapper',
  },
  mask: {
    type: 'boolean',
    default: true,
    label: 'Mask',
  },
  maskClose: {
    type: 'boolean',
    default: true,
    label: 'Mask close',
  },
  buttonClose: {
    type: 'boolean',
    default: false,
    label: 'Button close',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { wrapper } = props;
  return `
<div class="layer-doc-usage">
  <OButton @click="ctx.handleClick">Show</OButton>
  <OLayer v-model:visible="ctx.visible" ${propsToAttrStr(props, ['wrapper'])} ${wrapper === 'null' ? ':wrapper="null"' : `wrapper="${wrapper}"`}>
    <div class="layer-doc-usage-main">
      <h2>title</h2>
      <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
    </div>
  </OLayer>
</div>
`;
};
const _ctx = reactive({
  visible: false,
  handleClick: markRaw(() => {
    _ctx.visible = true;
  }),
});
</script>

<style lang="scss">
.layer-doc-usage {
  height: 300px;
  position: relative;
}
.layer-doc-usage-main {
  padding: 24px;
  background-color: var(--o-color-control-light);
}
</style>
