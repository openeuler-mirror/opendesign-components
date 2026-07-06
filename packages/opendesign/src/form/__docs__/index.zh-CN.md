---
sidebar: OForm 表单
kind: container
---

# OForm 表单

## 示例

<!-- @usage FormUsage -->
<!-- @case ValidateData -->
<!-- @case FormCustom -->

## 全局调用建议

OForm 通过 CSS 变量为各控件提供随断点响应的标准宽度，**推荐在项目全局样式中统一应用**，之后所有表单内的控件宽度自动跟随断点变化，模板中无需再写 `style="width:..."` 或 `:style`（OButton 除外，宽度由调用方自行决定）：

```scss
// 在项目全局样式中一次性配置（如 src/styles/form-controls.scss）
.o-form {
  .o-input, .o-select, .o-input-number, .o-cascader, .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }
  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }
}
```

OForm 提供的宽度变量及其响应式行为：

| CSS 变量 | 桌面端默认值 | 平板横屏（841–1200px） | ≤840px |
|---------|------------|----------------------|--------|
| `--form-item-main-box-width-standard` ^[1.2.2](primary) | `min(var(--o-r-grid-6), 100%)` | `min(var(--o-r-grid-4), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-width-wide` ^[1.2.2](primary) | `min(var(--o-r-grid-14), 100%)` | `min(var(--o-r-grid-8), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-inline-gap` ^[1.2.2](primary) | `var(--o-r-gap-4)` | — | — |
| `--form-item-main-box-width-min` ^[1.2.2](primary) | `calc((var(--form-item-main-box-width-standard) - var(--form-item-main-box-inline-gap)) / 2)` | — | — |

若项目设计稿与默认值不符，全局覆盖变量即可：

```css
.o-form {
  --form-item-main-box-width-standard: 280px;
  --form-item-main-box-width-wide: 560px;
}
```

### 运行时动态变量

以下 CSS 变量由组件运行时逻辑动态赋值，CSS 覆盖无效：

| CSS 变量 | 说明 |
| --- | --- |
| --form-label-width ⚠ 运行时赋值 | 由 `labelWidth` prop 赋值 |
| --form-label-align ⚠ 运行时赋值 | 由 `labelAlign` prop 赋值 |
| --form-label-justify ⚠ 运行时赋值 | 由 computed 计算 |
| --form-item-align ⚠ 运行时赋值 | 由 computed 计算 |

## API

<!-- @api OForm -->
<!-- @api OFormItem -->
