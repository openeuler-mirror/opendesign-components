---
sidebar: OToast 即时反馈
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
