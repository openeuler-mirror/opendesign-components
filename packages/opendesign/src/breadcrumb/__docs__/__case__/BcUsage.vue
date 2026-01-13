<docs lang="md">
<!-- zh-CN -->

### 基础用法

通过 `href` 属性设置链接跳转地址，或者使用 `to` 属性配合 Vue Router 实现路由跳转。当 `href` 和 `to` 属性都未设置时，`OBreadcrumbItem` 组件会使用 `span` 标签渲染为一个普通的文本（这对于 SEO 是有好处的）。

`href` 属性和 `target` 属性组合使用，`to` 属性和 `replace` 属性组合使用，当同时传递 `href` 属性和 `to` 属性时，会优先使用 `to` 形式的跳转。

<!-- en-US -->

### Basic Usage

Set the link jump address using the `href` property, or use the `to` property in conjunction with Vue Router to achieve routing. When neither the `href` nor the `to` property is set, the `OBreadcrumbItem` component will render as a plain text using a `span` tag (which is beneficial for SEO).

When the `href` attribute and the `target` attribute are used in combination, and the `to` attribute and the `replace` attribute are used in combination, when both the `href` attribute and the `to` attribute are passed simultaneously, the `to` form of jump will be preferred.
</docs>

<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  separator: {
    type: 'string',
  },
  href: {
    type: 'string',
    default: '/',
  },
  target: {
    type: 'string',
    default: '_self',
  },
  to: {
    type: 'string',
  },
  replace: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OBreadcrumb>
    <OBreadcrumbItem  ${propsToAttrStr(props)}> 
      <OIconSkill style="margin-right:4px;font-size:16px;" />Home
    </OBreadcrumbItem>
    <OBreadcrumbItem>Current Page</OBreadcrumbItem>
  </OBreadcrumb>`;
};

const _oCtx = {};
</script>
