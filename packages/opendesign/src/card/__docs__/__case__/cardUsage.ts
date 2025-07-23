import { propsToAttrStr } from '../../../_demo/utils';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
export const schema = {
  layout: {
    type: 'list',
    default: 'v',
    list: ['v', 'h', 'hr'],
  },
  coverOrIcon: {
    type: 'radio',
    list: ['cover', 'icon'],
    default: 'cover',
  },
  coverRatio: {
    type: 'number',
    default: 1.7,
    step: 0.1,
    min: 0.1,
  },
  coverFit: {
    type: 'list',
    default: 'cover',
    list: ['cover', 'contain', 'fill', 'none', 'scale-down'],
  },
  title: {
    type: 'textarea',
    default: LOREM,
    row: 4,
  },
  titleRow: {
    type: 'number',
    label: 'title row count',
    default: 2,
  },
  detail: {
    type: 'textarea',
    default: LOREM,
    row: 4,
  },
  detailRow: {
    type: 'number',
    label: 'detail row count',
    default: 3,
  },
  hoverable: {
    type: 'boolean',
    default: true,
  },
  cursor: {
    type: 'list',
    default: 'auto',
    list: ['pointer', 'auto'],
  },
  noResponsive: {
    type: 'boolean',
    default: false,
    label: 'close responsive',
  },
};

export const template = (props: Record<string, any>) => {
  const { coverOrIcon, titleRow, detailRow } = props;
  let attrs = '';
  if (coverOrIcon === 'cover') {
    attrs += ' cover="/card-cover.jpg"';
  } else {
    attrs += ' icon="/avatar.svg"';
  }
  if (titleRow >= 1) {
    const row = Math.round(titleRow);
    attrs += ` :title-row=${row} :title-max-row=${row}`;
  }
  if (detailRow >= 1) {
    const row = Math.round(detailRow);
    attrs += ` :detail-row=${row} :detail-max-row=${row}`;
  }
  return `<OCard ${propsToAttrStr(props, ['coverOrIcon', 'titleRow', 'detailRow'])}${attrs} />`;
};

export const docs = {
  'zh-CN':
    '### 使用\n' +
    'OCard 分为图文卡片，和图标卡片。\n' +
    '1. 图文卡片：给 `cover` 设置图片链接，并可通过 `coverRadio` 设置该图片长宽比，通过 `coverFit` 设置图片填充方式\n' +
    '2. 图标卡片：给 `icon` 设置值，可以是图片链接或组件\n\n' +
    '通过 `layout` 设置卡片布局方式，包含垂直布局、水平布局以及水平反向布局\n\n' +
    '设置卡片标题\n' +
    '1. 通过 `title` 设置标题内容\n' +
    '2. 通过 `titleRow` 设置标题高度：`height: calc(title-row * line-height)`\n' +
    '3. 通过 `titleMaxRow` 设置标题最大行数，高于该行数时显示省略号。**注**：通过`-webkit-line-clamp`实现；一般而言 `titleRow` 的值与 `titleMaxRow` 值应该一致\n\n' +
    '设置卡片内容\n' +
    '1. 通过 `detail` 设置标题内容\n' +
    '2. 通过 `detailRow` 设置标题高度 `height: calc(detail-row * line-height)`\n' +
    '3. 通过 `detailMaxRow` 设置标题最大行数，高于该行数时显示省略号。**注**：通过`-webkit-line-clamp`实现；一般而言 `detailRow` 的值与 `detailMaxRow` 值应该一致\n\n' +
    '其它\n' +
    '1. `hoverable` 控制卡片是否有鼠标悬停阴影\n' +
    '2. `href` 设置卡片跳转链接；**注**：设置 `href` 属性后，卡片将以 `a` 标签渲染\n' +
    '3. `cursor` 控制鼠标悬停样式；当值为 `auto` 时，若设置了 `href` 属性，鼠标悬停样式为 `pointer`\n' +
    '4. `noResponsive` 值为真时，卡片尺寸 (间距、字体、行高等) 将不会随着视口尺寸改变而改变',
  'en-US':
    '### Usage\n' +
    'OCard consists of image cards and icon cards.\n' +
    '1. Image card: Set the image link to `cover`, and set the image aspect ratio through `coverRadio`, and set image fill mode through `coverFit`\n' +
    '2. Icon card: Set `icon` value to an image link or component\n\n' +
    'Set card layout mode via `layout`, which includes vertical layout, horizontal layout, and horizontal reverse layout\n\n' +
    'Configure card title\n' +
    '1. Set title content through `title`\n' +
    '2. Set title height through `titleRow`: `height: calc(title-row * line-height)`\n' +
    '3. Set maximum title rows through `titleMaxRow`. Ellipsis will display when exceeding this value. **Note**: Implemented via `-webkit-line-clamp`; `titleRow` value should generally match `titleMaxRow`\n\n' +
    'Configure card content\n' +
    '1. Set content text through `detail`\n' +
    '2. Set content height through `detailRow`: `height: calc(detail-row * line-height)`\n' +
    '3. Set maximum content rows through `detailMaxRow`. Ellipsis will display when exceeding this value. **Note**: Implemented via `-webkit-line-clamp`; `detailRow` value should generally match `detailMaxRow`\n\n' +
    'Other features\n' +
    '1. `hoverable` controls card shadow on mouse hover\n' +
    '2. `href` sets card navigation link; **Note**: Setting `href` will render card as `a` tag\n' +
    '3. `cursor` controls mouse hover style; when set to `auto`, cursor shows as `pointer` if `href` is configured\n' +
    '4. When `noResponsive` is true, card dimensions (spacing, font size, line height, etc.) remain fixed regardless of viewport size changes',
};
