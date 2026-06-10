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

### CSS Variables

| CSS Variable | Description |
| --- | --- |
| --loading-mask | Loading mask color |
| --loading-icon-size | Loading icon size |
| --loading-icon-color | Loading icon color |
| --loading-mask-icon-color | Loading mask icon color |
| --loading-color | Loading text color |
| --loading-mask-color | Loading mask text color |
| --loading-z-index | Loading z-index |
| --loading-label-font-size | Loading label font size |
| --loading-label-line-height | Loading label line height |
| --loading-label-icon-gap | Loading label-icon gap |
| --loading-content-direction | Loading content direction |

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
