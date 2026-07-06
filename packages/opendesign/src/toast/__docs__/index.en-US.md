---
sidebar: OToast ^[1.2.0](primary)
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

### CSS Variables

| CSS Variable | Default | Description |
| --- | --- | --- |
| --toast-padding | 9px 16px | Toast padding |
| --toast-bg-color | rgb(var(--o-grey-11)) | Toast background color |
| --toast-color | var(--o-color-info1-inverse) | Toast text color |
| --toast-radius | 4px | Toast border radius |
| --toast-font-size | var(--o-font_size-tip1) | Toast font size |
| --toast-line-height | var(--o-line_height-tip1) | Toast line height |
| --toast-shadow | var(--o-shadow-3) | Toast shadow |
| --toast-gap | 16px | Toast gap between items |
| --toast-align | center | Toast content alignment |
| --toast-max-width | 100% | Toast max width |
| --toast-list-offset | 80px | Toast list offset |
| --toast-list-top-offset | var(--toast-list-offset) | Toast list top offset |
| --toast-list-bottom-offset | var(--toast-list-offset) | Toast list bottom offset |
| --z-index | 1001 | Toast list z-index |
