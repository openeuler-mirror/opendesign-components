---
sidebar: OToast 即时反馈 ^[1.2.0](primary)
kind: feedback
---

# 即时反馈

## 示例

<!-- @usage ToastUsage -->

<!-- @case ToastInlineSlot -->
<!-- @case ToastBasic -->
<!-- @case ToastCustomTarget -->

## Api

<!-- @api OToast -->

### useToast

```ts
type ToastTarget = string | ComponentPublicInstance | HTMLElement | null | undefined;
type ToastParamsT = Partial<
  // ToastPropsT: OToast组件的props的类型
  ToastPropsT & {
    // 即时反馈内容
    content: string | VNode | Component;
    // 即时反馈显示的位置
    position: 'top' | 'bottom' | 'center';
    // 即时反馈框与 `target` 的水平对齐方式
    targetAlign?: 'center' | 'left' | 'right';
    // 即时反馈框与 `target` 的距离
    targetOffset?: number;
    // 即时反馈持续时间结束的事件
    onDurationEnd: () => void;
    // 即时反馈框自身关闭按钮的点击事件
    onClose: (ev?: MouseEvent) => void;
  }
>;
function useToast(target?: Ref<ToastTarget> | ToastTarget): {
  /** @return 关闭该条即时反馈框的函数 */
  show: (params: ToastParamsT) => () => void;
  // 关闭本 useToast 实例渲染的所有即时反馈
  close: () => void;
  // 关闭所有实例渲染的所有即时反馈
  closeAll: () => void;
};
```

### CSS 变量

| CSS 变量 | 默认值 | 描述 |
| --- | --- | --- |
| --toast-padding | 9px 16px | 即时反馈内边距 |
| --toast-bg-color | rgb(var(--o-grey-11)) | 即时反馈背景色 |
| --toast-color | var(--o-color-info1-inverse) | 即时反馈文字颜色 |
| --toast-radius | 4px | 即时反馈圆角 |
| --toast-font-size | var(--o-font_size-tip1) | 即时反馈文字大小 |
| --toast-line-height | var(--o-line_height-tip1) | 即时反馈文字行高 |
| --toast-shadow | var(--o-shadow-3) | 即时反馈阴影 |
| --toast-gap | 16px | 即时反馈条间距 |
| --toast-align | center | 即时反馈内容对齐方式 |
| --toast-max-width | 100% | 即时反馈最大宽度 |
| --toast-list-offset | 80px | 即时反馈列表偏移量 |
| --toast-list-top-offset | var(--toast-list-offset) | 即时反馈列表顶部偏移量 |
| --toast-list-bottom-offset | var(--toast-list-offset) | 即时反馈列表底部偏移量 |
| --z-index | 1001 | 即时反馈列表层级 |
