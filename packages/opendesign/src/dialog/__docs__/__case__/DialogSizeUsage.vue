<docs lang="md">
<!-- zh-CN -->

### 尺寸

ODialog 提供了多种预设尺寸选项：`'exlarge'`、`'large'`、`'medium'`、`'small'` 和 `'auto'`，通过 `size` 属性进行设置。

不同尺寸的特点：

自适应尺寸 (`auto`)：

- 对话框会根据内容自动调整大小
- 适合内容长度不确定的场景

固定尺寸 (exlarge/large/medium/small)：

- 对话框具有固定宽度
- 高度会根据内容自动调整，但不会超过预设的最大及最小高度

视宽适配：

- 默认情况下，对话框会根据视口大小自动调整尺寸（如间距，宽度，高度范围，字号等）
- 如需禁用自动适配，可设置 `noResponsive` 为 `true`
- 也可通过 CSS 变量进行精细的尺寸定制

移动端半屏显示：

- 设置 `phoneHalfFull` 为 `true` 时，在小屏幕设备（宽度 < 600px）上对话框宽度占满整个视口，显示在底部
- 注意：此时 size 属性仅影响高度，宽度固定为全屏；不能同时设置 noResponsive 为 true

<!-- en-US -->

### Size

ODialog provides multiple preset size options: `'exlarge'`, `'large'`, `'medium'`, `'small'`, and `'auto'`, which can be set via the `size` property.

Characteristics of different sizes:

Adaptive size (`auto`):

- The dialog automatically adjusts its size based on the content
- Suitable for scenarios where the content length is uncertain

Fixed sizes (exlarge/large/medium/small):

- The dialog has a fixed width
- The height adjusts automatically based on the content but will not exceed the preset maximum and minimum height

Viewport adaptation:

- By default, the dialog automatically adjusts its dimensions (such as spacing, width, height range, font size, etc.) based on the viewport size
- To disable automatic adaptation, set `noResponsive` to `true`
- Fine-grained size customization is also possible via CSS variables

Half-screen display on mobile:

- When `phoneHalfFull` is set to `true`, on small-screen devices (width < 600px), the dialog occupies the full viewport width and is displayed at the bottom
- Note: In this case, the `size` property only affects the height, while the width is fixed to full-screen;
  `noResponsive` cannot be set to `true` simultaneously
</docs>
<script setup lang="ts">
import { reactive, markRaw } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = reactive({
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
    disabled: false as boolean,
  },
}) satisfies Record<string, DocDemoSchema>;

const _ctx = reactive({
  visible: false,
  openDialog: markRaw(() => {
    _ctx.visible = true;
  }),
});
const _template: DocDemoTemplate<typeof _schema> = (props) => {
  if (props.phoneHalfFull) {
    props.noResponsive = false;
    _schema.noResponsive.disabled = true;
  } else {
    _schema.noResponsive.disabled = false;
  }
  return `
<OButton @click="ctx.openDialog">Open Dialog</OButton>
<ODialog
  v-model:visible="ctx.visible"
  ${propsToAttrStr(props)}
>
  <template #header>${props.size}</template>
  <div>lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
</ODialog>`;
};
</script>
