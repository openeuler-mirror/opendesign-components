---
sidebar: OCascaderV2 ^[1.2.4](primary)
kind: input
---

# OCascaderV2

## Demo

<!-- @usage CascaderV2Usage -->

<!-- @case CascaderV2Multiple -->
<!-- @case CascaderV2EmitPath -->
<!-- @case CascaderV2Filterable -->
<!-- @case CascaderV2ExpandTrigger -->
<!-- @case CascaderV2BeforeSelect -->
<!-- @case CascaderV2Disabled -->
<!-- @case CascaderV2Events -->
<!-- @case CascaderV2Lazy -->

## API

### CSS Variables

| CSS Variable                                             | Description                                | Default                          |
| -------------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| `--cascader-v2-text-size`               | Select box font size                       | `var(--o-font_size-text1)`       |
| `--cascader-v2-text-height`             | Select box line height                     | `var(--o-line_height-text1)`     |
| `--cascader-v2-placeholder`             | Placeholder text color                     | `var(--o-color-info4)`           |
| `--cascader-v2-icon-color`              | Icon color                                 | `var(--o-color-info3)`           |
| `--cascader-v2-icon-color-disabled`     | Disabled icon color                        | `var(--o-color-info4)`           |
| `--cascader-v2-icon-color-loading`      | Loading icon color                         | `var(--o-color-primary1)`        |
| `--cascader-v2-icon-gap`                | Icon gap                                   | `8px`                            |
| `--cascader-v2-tag-bg-color`            | Multi-select tag background color          | `var(--o-color-control2-light)` |
| `--cascader-v2-tag-radius`              | Multi-select tag radius                    | `4px`                            |
| `--cascader-v2-tag-text-size`           | Multi-select tag font size                 | `var(--o-font_size-tip2)`        |
| `--cascader-v2-tag-text-height`         | Multi-select tag line height               | `var(--o-line_height-tip2)`      |
| `--cascader-v2-tag-padding`             | Multi-select tag padding                   | `3px 12px`                       |
| `--cascader-v2-tag-margin`              | Multi-select tag margin                    | `2px 4px 2px 0`                  |

<!-- @api OCascaderV2 -->

## Injection

When integrating with OCascaderV2 in custom components, you can inject `cascaderV2InjectKey` to get the cascader context ^[1.2.4](primary):

```typescript
import { inject } from 'vue';
import { cascaderV2InjectKey } from '@opensig/opendesign';

const cascaderCtx = inject(cascaderV2InjectKey, null);
```

| Property               | Type                                                    | Description                      |
| ---------------------- | ------------------------------------------------------- | -------------------------------- |
| selectValue            | Ref\<Array\<string \| number\>\>                         | Current selected value array     |
| multiple               | boolean                                                 | Whether multiple selection mode   |
| allowSelectAnyNode     | boolean                                                 | Allow selecting any level node   |
| filterValue            | Ref\<string\>                                            | Current filter input value       |
| isSelecting            | Ref\<boolean\>                                           | Whether in selection process     |
| loading                | Ref\<boolean\>                                           | Overall loading state            |
| doSelect               | (option, path?) => Promise\<void\>                      | Handle single node selection     |
| doSelectBatch          | (toAdd, toRemove) => void                               | Handle batch selection           |
| registerOption         | (option) => void                                        | Register child menu item         |
| registerPath           | (value, path) => void                                   | Register value-to-path mapping   |
| hidePanel              | () => void                                              | Close dropdown panel             |
| showPanel              | () => void                                              | Open dropdown panel              |
| setRootLoading         | (v: boolean) => void                                    | Set root node loading state      |
| onLazyloadError        | (node) => void                                          | Lazy load error callback         |
