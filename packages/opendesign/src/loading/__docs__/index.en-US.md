---
sidebar: OLoading
kind: feedback
---

# OLoading

## Demo

<!-- @usage LoadingUsage -->
<!-- @case LoadingComponent -->
<!-- @case LoadingDirective -->
<!-- @case LoadingService -->
<!-- @case CustomIcon -->
<!-- @case CustomSlot -->
<!-- @case:a|k|e LoadingTheme -->

## API

### useLoading

```ts:line-numbers
function useLoading(opt?: Partial<LoadingPropsT>, wrap: Ref<HTMLElement | undefined> | HTMLElement | string = 'body'): { toggle: (visible: boolean) => void };
```

`LoadingPropsT` 为 `OLoading` 组件的 props 类型。

### vLoading

```ts:line-numbers
const vLoading: ObjectDirective<HTMLElement, boolean | Partial<LoadingPropsT>, 'body' | 'nomask'>;
```

<!-- @api OLoading -->
