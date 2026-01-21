---
sidebar: OMessage
kind: feedback
---

# OMessage

## Demo

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
  // MessagePropsT: The type of props for the OMessage component
  MessagePropsT & {
    // Message content
    content: string | VNode | Component;
    // Position where the message is displayed
    position: 'top' | 'bottom';
    // Horizontal alignment of the message box relative to `target`
    targetAlign?: 'center' | 'left' | 'right';
    // Icon for the message
    icon: VNode | Component;
    // Duration for which the message is displayed
    onDurationEnd: () => void;
    // Click event for the message box's own close button
    onClose: (ev?: MouseEvent) => void;
  }
>;
function useMessage(target?: Ref<MessageTarget> | MessageTarget): {
  /** @return Returns a function that closes this message */
  show: (params: MessageParamsT) => () => void;
  info: (params: Omit<MessageParamsT, 'status'>) => () => void;
  success: (params: Omit<MessageParamsT, 'status'>) => () => void;
  warning: (params: Omit<MessageParamsT, 'status'>) => () => void;
  danger: (params: Omit<MessageParamsT, 'status'>) => () => void;
  loading: (params: Omit<MessageParamsT, 'status'>) => () => void;
  // Closes all messages rendered by this useMessage instance
  close: () => void;
  // Closes all messages rendered by all instances
  closeAll: () => void;
};
```
