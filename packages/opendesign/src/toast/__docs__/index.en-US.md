---
sidebar: OToast
kind: feedback
---

# OToast

## Demo

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
  // ToastPropsT: The type of props for the OToast component
  ToastPropsT & {
    // Real-time feedback content
    content: string | VNode | Component;
    // The location indicated by the real-time feedback
    position: 'top' | 'bottom' | 'center';
    // The horizontal alignment mode of the real-time feedback box with the `target`
    targetAlign?: 'center' | 'left' | 'right';
    // The distance between the real-time feedback box and the `target`
    targetOffset?: number;
    // Event indicating the end of the duration of immediate feedback
    onDurationEnd: () => void;
    // The click event of the close button of the real-time feedback box
    onClose: (ev?: MouseEvent) => void;
  }
>;
function useToast(target?: Ref<ToastTarget> | ToastTarget): {
  /** @return The function for closing this real-time feedback box */
  show: (params: ToastParamsT) => () => void;
  // Close all the immediate feedback rendered by this "useToast" instance.
  close: () => void;
  // Disable all instance rendering and all real-time feedback.
  closeAll: () => void;
};
```
