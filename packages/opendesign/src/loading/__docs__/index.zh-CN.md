---
sidebar: OLoading 加载
kind: feedback
---

# OLoading 加载

## 示例

<!-- @usage LoadingUsage -->
<!-- @case LoadingSize -->
<!-- @case LoadingComponent -->
<!-- @case LoadingDirective -->
<!-- @case LoadingService -->
<!-- @case CustomIcon -->
<!-- @case CustomSlot -->
<!-- @case:a|k|e LoadingTheme -->

## API

### CSS 变量

| CSS 变量 | 描述 |
| --- | --- |
| --loading-mask | 加载遮罩颜色 |
| --loading-icon-size | 加载图标尺寸 |
| --loading-icon-color | 加载图标颜色 |
| --loading-mask-icon-color | 加载遮罩图标颜色 |
| --loading-color | 加载文字颜色 |
| --loading-mask-color | 加载遮罩文字颜色 |
| --loading-z-index | 加载层级 |
| --loading-label-font-size | 加载文字字号 |
| --loading-label-line-height | 加载文字行高 |
| --loading-label-icon-gap | 加载图标与文字间距 |
| --loading-content-direction | 加载内容排列方向 |

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
