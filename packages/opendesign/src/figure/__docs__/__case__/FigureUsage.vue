<docs lang="md">
<!-- zh-CN -->

### 使用说明

#### 属性说明

**`ratio`**: 图片宽高比控制

- 通过 `padding-top` 百分比实现宽高比
- 子元素使用 `absolute` 定位填充容器。这会覆盖 `<img>` 元素的固有宽高比特性
- 基于以上两点必要时显式设置容器宽度，否则容器宽高可能坍塌为 0，导致图片无法显示

**`fit`**: 图片填充模式（默认：`contain`）

- `background=false` 时（使用 `<img>` 标签）：
  - 通过 [object-fit](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit) 控制
  - 可选值：`cover` | `contain` | `fill` | `none` | `scale-down`
- `background=true` 时（使用背景图）：
  - 通过 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size) 控制
  - 可选值：`cover` | `contain` | `auto` | `<length>` | `<percentage>`
  - 示例：`fit="100% 80%"` 可设置自定义背景图尺寸
  - 注意：由于不再使用 `<img>` 标签渲染，可能导致宽高塌陷

**`hoverable`**: 悬停放大效果

- 自动生效场景（无需显式设置该属性）：
  - `href` 存在时（链接跳转）
  - `preview=true`（图片预览）
  - `videoPoster=true`（视频海报）
- 当需要**独立控制**悬停效果时使用

**`preview`**: 点击预览功能，启用后会接管点击事件（显示全屏预览层）

**`previewClose`**: 预览关闭方式

- 可选值：
  - `'none'`：禁用关闭
  - `'mask'`：点击遮罩层关闭
  - `'button'`：点击关闭按钮
  - `'body'`：点击预览图片关闭
- 组合模式：支持数组配置（如 `['mask','button']`）
- 默认值：
  - 📱 Pad 端（视口 < 1200px 的触屏设备）：`['mask','button']`
  - 💻 PC 端：`['mask','button','body']`

**`href`**: 链接跳转

- 启用后组件渲染为 `<a>` 标签
- 行为：点击执行页面跳转

#### 互斥属性冲突

`preview`, `href` **禁止同时启用**（两者均会接管点击事件）

<!-- en-US -->

### Usage Instructions

#### Property Description

**`ratio`**: Controls the aspect ratio of the image

- Achieved via `padding-top` percentage
- Child elements use `absolute` positioning to fill the container.
  This overrides the intrinsic aspect ratio characteristics of the `<img>` element.
- Based on the above two points, explicitly set the container width when necessary.
  Otherwise, the container's width and height may collapse to 0, causing the image to fail to display.

**`fit`**: Image fill mode (Default: `contain`)

- When `background=false` (uses `<img>` tag):
  - Controlled via [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
  - Optional values: `cover` | `contain` | `fill` | `none` | `scale-down`
- When `background=true` (uses background image):
  - Controlled via [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)
  - Optional values: `cover` | `contain` | `auto` | `<length>` | `<percentage>`
  - Example: `fit="100% 80%"` can be used to set a custom background image size
  - Note: Since the `<img>` tag is no longer used for rendering, this may cause width and height collapse.

**`hoverable`**: Hover zoom effect

- Automatically enabled scenarios (no need to explicitly set this property):
  - When `href` is present (link navigation)
  - When `preview=true` (image preview)
  - When `videoPoster=true` (video poster)
- Use when you need to **independently control** the hover effect.

**`preview`**: Click-to-preview functionality. When enabled, it takes over the click event (displays a full-screen preview layer).

**`previewClose`**: Preview close method

- Optional values:
  - `'none'`: Disable closing
  - `'mask'`: Click the mask layer to close
  - `'button'`: Click the close button
  - `'body'`: Click the preview image to close
- Combination mode: Supports array configuration (e.g., `['mask','button']`)
- Default values:
  - 📱 Pad side (touch screen devices with viewport < 1200px): `['mask','button']`
  - 💻 PC side: `['mask','button','body']`

**`href`**: Link navigation

- When enabled, the component renders as an `<a>` tag
- Behavior: Clicking performs page navigation.

#### Mutually Exclusive Property Conflict

The `preview` and `href` properties **cannot be enabled simultaneously** (both would take over the click event).
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = reactive({
  setRatio: {
    type: 'boolean',
    default: true,
  },
  height: {
    type: 'number',
    min: 50,
    max: 300,
    default: 200,
    step: 50,
    disabled: true as boolean,
    label: 'Height(px)',
  },
  ratio: {
    type: 'number',
    step: 0.1,
    min: 1,
    max: 2,
    default: 1.7,
    disabled: false as boolean,
  },
  fit: {
    type: 'list',
    list: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    default: 'cover',
  },
  hoverable: {
    type: 'boolean',
  },
  preview: {
    type: 'boolean',
  },
  background: {
    type: 'boolean',
  },
  previewClose: {
    type: 'list',
    list: ['none', 'mask', 'button', 'body'],
    default: 'mask',
  },
  href: {
    type: 'boolean',
    label: 'Set href',
  },
}) satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  if (props.background) {
    _oSchema.fit.list = ['none', 'cover', 'contain', '80% auto'];
  } else {
    _oSchema.fit.list = ['cover', 'contain', 'fill', 'none', 'scale-down'];
  }
  const mutuallyExclusiveKeys = ['preview', 'href'] as const;
  const excludeProps: (keyof typeof _oSchema)[] = ['href', 'setRatio', 'height'];
  for (const key of mutuallyExclusiveKeys) {
    (_oSchema[key] as any).disabled = false;
    if (props[key]) {
      mutuallyExclusiveKeys.forEach((k) => {
        if (k !== key) {
          (_oSchema[k] as any).disabled = true;
          props[k] = false;
        }
      });
      break;
    }
  }
  let styleStr = '';
  if (props.setRatio) {
    _oSchema.ratio.disabled = false;
    _oSchema.height.disabled = true;
    styleStr = 'style="width: 100%;"';
  } else {
    _oSchema.ratio.disabled = true;
    _oSchema.height.disabled = false;
    excludeProps.push('ratio');
    styleStr = `style="height: ${props.height}px;`;
    if (props.background) {
      styleStr += ' width: 100%;';
    }
    styleStr += '"';
  }
  const hrefTemplate = props.href ? 'href="/" target="_blank"' : '';
  return `<OFigure ${hrefTemplate} src="/card-cover.jpg" ${propsToAttrStr(props, excludeProps)} ${styleStr} />`;
};

const _oCtx = {};
</script>
