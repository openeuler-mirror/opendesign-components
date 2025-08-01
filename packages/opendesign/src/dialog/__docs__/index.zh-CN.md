---
sidebar: ODialog 对话框
---

# ODialog 对话框

## 示例

<!-- @usage DialogSizeUsage -->
<!-- @case DialogActions -->
<!-- @case DialogSlot -->

## API

### CSS 变量

| CSS变量 | 描述 |
| --- | --- |
| --dlg-close-size | 关闭按钮大小 |
| --dlg-close-color | 关闭按钮颜色 |
| --dlg-close-color-hover | 鼠标悬停关闭按钮颜色 |
| --dlg-close-color-active | 鼠标按下关闭按钮颜色 |
| --dlg-color | 文字颜色 |
| --dlg-header-color | 标题颜色，覆盖 `--dlg-color` |
| --dlg-bg-color | 背景颜色 |
| --dlg-radius | 圆角 |
| --dlg-shadow | 阴影 |
| --dlg-max-height | 最大高度 |
| --dlg-min-height | 最小高度 |
| --dlg-min-width | 最小宽度 |
| --dlg-width | 宽度 |
| --dlg-margin | 外边距 |
| --dlg-edge-gap | 内边距 |
| --dlg-inner-gap | header default 和 footer 之间的间距 |
| --dlg-header-gap | header 和 default 之间的间距，覆盖 `--dlg-inner-gap` |
| --actions-justify | 底部操作按钮的对齐方式 |

<!-- @api ODialog -->

### DialogActionT

```ts
interface DialogActionT {
  id: string | number;
  color?: 'normal' | 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'outline' | 'text';
  size?: 'large' | 'medium' | 'small';
  label?: string;
  round?: 'pill' | (string & {});
  icon?: Component;
  disabled?: boolean;
  loading?: boolean;
  // 按钮点击事件回调函数
  onClick: () => void;
}
```

参考 [OButton API Props](/zh-CN/components/button#props)

### BaseScrollerPropsT

```ts
type BaseScrollerPropsT = {
  disabledX: boolean;
  disabledY: boolean;
  duration: number;
  showType: 'auto' | 'always' | 'hover' | 'never';
  size: 'medium' | 'small';
  autoUpdateOnScrollSize: boolean;
  barClass?: string | undefined;
};
```

参考 [Scroller API Props](/zh-CN/components/scroller#props)
