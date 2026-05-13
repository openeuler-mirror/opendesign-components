<docs lang="md">
<!-- zh-CN -->

### 使用

头像组件包含以下功能：

- **尺寸**：`size` 支持数字/变量/带单位值
- **图片**：`url` 显示图片
- **名称**：`name` 显示首字符
- **可点击**：`clickable` 显示交互遮罩
- **头像组**：`OAvatarGroup` 支持 horizontal/symmetric 布局

<!-- en-US -->

### Usage

Avatar component includes:

- **Size**: `size` supports number/variable/unit values
- **Image**: `url` to display image
- **Name**: `name` to display first character
- **Clickable**: `clickable` shows interaction mask
- **Avatar Group**: `OAvatarGroup` supports horizontal/symmetric layout
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  url: {
    type: 'boolean',
    default: true,
  },
  clickable: {
    type: 'boolean',
    default: false,
    label: '可点击',
  },
  size: {
    type: 'string',
    default: 'var(--o-icon_size-4xl)',
  },
  name: {
    type: 'string',
    default: 'Opendesign',
  },
  objectFit: {
    type: 'list',
    list: ['fill', 'contain', 'cover', 'none', 'scale-down'],
    default: 'fill',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OAvatar ${propsToAttrStr({ ...props, url: props.url ? 'https://api.dicebear.com/9.x/micah/svg?seed=1' : undefined })} />`;
};

const _oCtx = {};
</script>
