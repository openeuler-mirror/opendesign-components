<docs lang="md">
<!-- zh-CN -->

### 使用

通过 `href` 属性设置链接跳转地址，或者使用 `to` 属性配合 Vue Router 实现路由跳转。当 `href` 和 `to` 属性都未设置时，`OLink` 组件会使用 `span` 标签渲染为一个普通的文本（这对于 SEO 是有好处的）。

`href` 属性和 `target` 属性组合使用，`to` 属性和 `replace` 属性组合使用，当同时传递 `href` 属性和 `to` 属性时，会优先使用 `to` 形式的跳转。

五种主题色：`normal`、`primary`、`success`、`warning`、`danger` ；

四种尺寸：`auto`、`small`、`medium`、`large` ；

四种跳转方式：`_blank`、`_parent`、`_self`、`_top` ；

禁用状态：`disabled` ；

加载状态：`loading` ；

<!-- en-US -->

### Usage

Set the link jump address using the `href` property, or use the `to` property in conjunction with Vue Router to achieve routing. When neither the `href` nor the `to` property is set, the `OLink` component will render as a plain text using a `span` tag (which is beneficial for SEO).

When the `href` attribute and the `target` attribute are used in combination, and the `to` attribute and the `replace` attribute are used in combination, when both the `href` attribute and the `to` attribute are passed simultaneously, the `to` form of jump will be preferred.

Five theme colors: `normal`、`primary`、`success`、`warning`, and `danger`;

Four sizes: `auto`、`small`、`medium`、`large`;

Four forms of jumps: `_blank`、`_parent`、`_self`, and `_top`

Disabled state: `disabled`;

Loading state: `loading`;
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  href: {
    type: 'string',
    default: '#使用',
  },
  target: {
    type: 'list',
    list: ['_blank', '_parent', '_self', '_top'],
  },
  color: {
    type: 'list',
    list: ['normal', 'primary', 'success', 'warning', 'danger'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small', 'auto'],
    default: 'auto',
  },
  disabled: {
    type: 'boolean',
  },
  loading: {
    type: 'boolean',
  },
  'icon(slot)': {
    type: 'boolean',
  },
  'suffix(slot)': {
    type: 'boolean',
    default: true,
  },
  hoverBg: {
    type: 'boolean',
  },
  hoverUnderline: {
    type: 'boolean',
    default: true,
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
  const { 'icon(slot)': iconSlot, 'suffix(slot)': suffixSlot } = props;
  let innerHTML = '';
  if (iconSlot) {
    innerHTML += '<template #icon><OIconLink /></template>';
  }
  innerHTML += '查看更多';
  if (suffixSlot) {
    innerHTML += '<template #suffix><OIconChevronRight /></template>';
  }
  return `一段文字中的<OLink ${propsToAttrStr(props, ['icon(slot)', 'suffix(slot)'])}>${innerHTML}\n</OLink>链接展示。`;
};

const _oCtx = {};
</script>
