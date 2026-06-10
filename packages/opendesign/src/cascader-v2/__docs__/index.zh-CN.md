---
sidebar: OCascaderV2 级联选择 ^[1.2.4](primary)
kind: input
---

# OCascaderV2 级联选择

## 示例

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

### CSS 变量

| CSS 变量                                                 | 描述                                             | 默认值                         |
| -------------------------------------------------------- | ------------------------------------------------ | ------------------------------ |
| `--cascader-v2-text-size`               | 选择框文字字号                                   | `var(--o-font_size-text1)`     |
| `--cascader-v2-text-height`             | 选择框文字行高                                   | `var(--o-line_height-text1)`   |
| `--cascader-v2-placeholder`             | 占位文本颜色                                     | `var(--o-color-info4)`         |
| `--cascader-v2-icon-color`              | 图标颜色                                         | `var(--o-color-info3)`         |
| `--cascader-v2-icon-color-disabled`     | 禁用态图标颜色                                   | `var(--o-color-info4)`         |
| `--cascader-v2-icon-color-loading`      | 加载态图标颜色                                   | `var(--o-color-primary1)`      |
| `--cascader-v2-icon-gap`                | 图标间距                                         | `8px`                          |
| `--cascader-v2-tag-bg-color`            | 多选标签背景色                                   | `var(--o-color-control2-light)` |
| `--cascader-v2-tag-radius`              | 多选标签圆角                                     | `4px`                          |
| `--cascader-v2-tag-text-size`           | 多选标签字号                                     | `var(--o-font_size-tip2)`      |
| `--cascader-v2-tag-text-height`         | 多选标签行高                                     | `var(--o-line_height-tip2)`    |
| `--cascader-v2-tag-padding`             | 多选标签内间距                                   | `3px 12px`                     |
| `--cascader-v2-tag-margin`              | 多选标签外间距                                   | `2px 4px 2px 0`                |

<!-- @api OCascaderV2 -->

## 注入

在自定义组件中与 OCascaderV2 集成时，可注入 `cascaderV2InjectKey` 获取级联选择器上下文 ^[1.2.4](primary)：

```typescript
import { inject } from 'vue';
import { cascaderV2InjectKey } from '@opensig/opendesign';

const cascaderCtx = inject(cascaderV2InjectKey, null);
```

| 属性                 | 类型                                                    | 说明                           |
| -------------------- | ------------------------------------------------------- | ------------------------------ |
| selectValue          | Ref\<Array\<string \| number\>\>                         | 当前选中值数组                 |
| multiple             | boolean                                                 | 是否为多选模式                 |
| allowSelectAnyNode   | boolean                                                 | 是否允许选中任意层级节点       |
| filterValue          | Ref\<string\>                                            | 筛选输入框的当前值             |
| isSelecting          | Ref\<boolean\>                                           | 是否处于选中处理流程中         |
| loading              | Ref\<boolean\>                                           | 整体加载状态                   |
| doSelect             | (option, path?) => Promise\<void\>                      | 单个节点的选中处理             |
| doSelectBatch        | (toAdd, toRemove) => void                               | 批量选中处理                   |
| registerOption       | (option) => void                                        | 子菜单项注册                   |
| registerPath         | (value, path) => void                                   | 注册 value → 路径映射          |
| hidePanel            | () => void                                              | 关闭下拉浮层                   |
| showPanel            | () => void                                              | 打开下拉浮层                   |
| setRootLoading       | (v: boolean) => void                                    | 设置根节点加载态               |
| onLazyloadError      | (node) => void                                          | 懒加载失败回调                 |
