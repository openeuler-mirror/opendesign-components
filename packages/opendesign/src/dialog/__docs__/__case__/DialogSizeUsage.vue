<docs lang="md">
<!-- zh-CN -->

### 尺寸

ODialog 有不同的尺寸：`'exlarge'` `'large'` `'medium'` `'small'` `'auto'`，通过 `size` 属性设置

- 当尺寸为 `auto` 时，对话框的大小适应内容。
- 当尺寸为其它值时，对话框的宽是相对固定的，高度会被钳制在对应值内。
  当客户端视口尺寸变化时，对话框尺寸会根据 `size` 自动适配，这在大部分情况下都能获得较好的效果，否则您可以将 `noResponsive` 设置为 `true` 取消自动适配，或者通过 css 变量细颗粒地自定义尺寸。
- 将 `phoneHalfFull` 设置为 `true`，移动端（视口宽度小于 600px）对话框的宽度会占满视口。**注**：
  - 此时 `size` 只影响高度，不影响宽度
  - `noResponsive` 不能为 `true`

<!-- en-US -->

### Size

ODialog offers various size options: `'exlarge'`, `'large'`, `'medium'`, `'small'`, and `'auto'`, configured through the `size` prop.

- When set to `auto`, the dialog adapts its dimensions to fit the content.
- For other size values, the dialog maintains a relatively fixed width while its height is clamped within the corresponding range.
  When the viewport size changes, the dialog automatically adjusts based on the `size` setting. This generally provides optimal display results.
  To disable this responsive behavior, set `noResponsive` to `true`. Alternatively, use CSS variables for granular customization.
- Setting `phoneHalfFull` to `true` enables full-width display on mobile devices (viewport width < 600px). **Notes**:
  - In this mode, `size` only affects height and does not impact width
  - `noResponsive` must not be set to `true`
</docs>
<script setup lang="ts">
import { reactive, markRaw } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  size: {
    type: 'list',
    list: ['exlarge', 'large', 'medium', 'small', 'auto'],
    label: 'Size',
  },
  phoneHalfFull: {
    type: 'boolean',
    label: 'Phone Half Full',
  },
  noResponsive: {
    type: 'boolean',
    label: 'No Responsive',
  },
} satisfies Record<string, DocDemoSchema>;

const _ctx = reactive({
  visible: false,
  openDialog: markRaw(() => {
    _ctx.visible = true;
  }),
});
const _template: DocDemoTemplate<typeof _schema> = (props) => `
<OButton @click="ctx.openDialog">Open Dialog</OButton>
<ODialog
  v-model:visible="ctx.visible"
  ${propsToAttrStr(props)}
>
  <template #header>${props.size}</template>
  <div>lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
</ODialog>`;
</script>
