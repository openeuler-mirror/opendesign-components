---
sidebar: OForm 表单
kind: container
---

# OForm 表单

## 示例

<!-- @usage FormUsage -->
<!-- @case ValidateData -->
<!-- @case FormCustom -->
<!-- @case FormManualStatus -->
<!-- @case FormLabelWidthRange -->
<!-- @case FormSetInitialValues -->
<!-- @case FormScrollToError -->

## 继承关系 ^[1.2.7](primary)

`size`、`disabled`、`round`、`clearable` 可通过 `OForm` 统一设置，所有 `OFormItem` 自动继承。FormItem 的同名属性优先级更高可覆盖，控件自身的同名 prop 优先级最高。

**优先级**：控件 prop > FormItem prop > Form prop

| Form 属性      | FormItem 继承属性 | 说明                                                              |
| -------------- | ----------------- | ----------------------------------------------------------------- |
| `rules`        | —                 | 全局规则按 `field` 匹配，FormItem 局部 `rules` 优先               |
| `disabled`     | `disabled`        | 全局禁用，FormItem `disabled` 优先，控件 `disabled` 最优先        |
| `size`         | `size`            | 全局尺寸，FormItem `size` 优先，控件 `size` 最优先                |
| `round`        | `round`           | 全局圆角，FormItem `round` 优先，控件 `round` 最优先              |
| `clearable`    | `clearable`       | 全局可清空，FormItem `clearable` 优先，控件 `clearable` 最优先    |
| `requiredIcon` | `requiredIcon`    | 设为 `true` 时 `required` 仅展示星号不触发默认校验，FormItem 优先 |
| `showMessage`  | `showMessage`     | 是否显示校验消息，FormItem `showMessage` 优先                     |
| `labelWidth`   | `labelWidth`      | 标签宽度，FormItem `labelWidth` 优先，支持 `'auto'`               |

### 全局规则与局部规则

```html
<OForm :model="model" :rules="globalRules">
  <OFormItem label="Username" field="username" required />
  <OFormItem label="Email" field="email" :rules="localRules" />
</OForm>
```

## 全局调用建议

OForm 通过 CSS 变量为各控件提供随断点响应的标准宽度，**推荐在项目全局样式中统一应用**，之后所有表单内的控件宽度自动跟随断点变化，模板中无需再写 `style="width:..."` 或 `:style`（OButton 除外，宽度由调用方自行决定）：

```scss
// 在项目全局样式中一次性配置（如 src/styles/form-controls.scss）
.o-form {
  .o-input,
  .o-select,
  .o-input-number,
  .o-cascader,
  .o-cascader-v2,
  .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }
  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }
}
```

OForm 提供的宽度变量及其响应式行为：

| CSS 变量                                                | 桌面端默认值                                                                                  | 平板横屏（841–1200px）         | ≤840px                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------ |
| `--form-item-main-box-width-standard` ^[1.2.2](primary) | `min(var(--o-r-grid-6), 100%)`                                                                | `min(var(--o-r-grid-4), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-width-wide` ^[1.2.2](primary)     | `min(var(--o-r-grid-14), 100%)`                                                               | `min(var(--o-r-grid-8), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-inline-gap` ^[1.2.2](primary)     | `var(--o-r-gap-4)`                                                                            | —                              | —                              |
| `--form-item-main-box-width-min` ^[1.2.2](primary)      | `calc((var(--form-item-main-box-width-standard) - var(--form-item-main-box-inline-gap)) / 2)` | —                              | —                              |

若项目设计稿与默认值不符，全局覆盖变量即可：

```css
.o-form {
  --form-item-main-box-width-standard: 280px;
  --form-item-main-box-width-wide: 560px;
}
```

### 运行时动态变量

以下 CSS 变量由组件运行时逻辑动态赋值，CSS 覆盖无效：

| CSS 变量                           | 说明                      |
| ---------------------------------- | ------------------------- |
| --form-label-width ⚠ 运行时赋值   | 由 `labelWidth` prop 赋值 |
| --form-label-align ⚠ 运行时赋值   | 由 `labelAlign` prop 赋值 |
| --form-label-justify ⚠ 运行时赋值 | 由 computed 计算          |
| --form-item-align ⚠ 运行时赋值    | 由 computed 计算          |

## API

<!-- @api OForm -->
<!-- @api OFormItem -->
