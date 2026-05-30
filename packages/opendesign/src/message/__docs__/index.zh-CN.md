---
sidebar: OMessage 消息提示
kind: feedback
---

# OMessage 消息提示

## 示例

<!-- @usage MessageUsage -->
<!-- @case MessageMethod -->
<!-- @case MessageClose -->
<!-- @case:a|k|e MessageTheme -->

## API

<!-- @api OMessage -->

### useMessage

```ts
type MessageTarget = string | ComponentPublicInstance | HTMLElement | null | undefined;
type MessageParamsT = Partial<
  // MessagePropsT: OMessage组件的props的类型
  MessagePropsT & {
    // 消息内容
    content: string | VNode | Component;
    // 消息显示的位置
    position: 'top' | 'bottom';
    // 消息框与 `target` 的水平对齐方式
    targetAlign?: 'center' | 'left' | 'right';
    // 消息的图标
    icon: VNode | Component;
    // 消息显示的持续时间
    onDurationEnd: () => void;
    // 消息框自身关闭按钮的点击事件
    onClose: (ev?: MouseEvent) => void;
  }
>;
function useMessage(target?: Ref<MessageTarget> | MessageTarget): {
  /** @return 关闭该条消息框的函数 */
  show: (params: MessageParamsT) => () => void;
  info: (params: Omit<MessageParamsT, 'status'>) => () => void;
  success: (params: Omit<MessageParamsT, 'status'>) => () => void;
  warning: (params: Omit<MessageParamsT, 'status'>) => () => void;
  danger: (params: Omit<MessageParamsT, 'status'>) => () => void;
  loading: (params: Omit<MessageParamsT, 'status'>) => () => void;
  // 关闭本 useMessage 实例渲染的所有消息
  close: () => void;
  // 关闭所有实例渲染的所有消息
  closeAll: () => void;
};
```
