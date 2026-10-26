---
sidebar: OForm
kind: container
---

# OForm

## Demo

<!-- @usage FormUsage -->
<!-- @case ValidateData -->
<!-- @case FormCustom -->
<!-- @case FormManualStatus -->
<!-- @case FormLabelWidthRange -->
<!-- @case FormSetInitialValues -->
<!-- @case FormScrollToError -->

## Inheritance ^[1.2.7](primary)

`size`, `disabled`, `round`, `clearable` can be set via `OForm` and all `OFormItem` components inherit automatically. FormItem's same-named prop takes priority and can override inherited values. The control's own same-named prop has the highest priority.

**Priority**: Control prop > FormItem prop > Form prop

| Form Prop      | FormItem Inherited Prop | Description                                                                                                |
| -------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `rules`        | —                       | Global rules matched by `field`, FormItem local `rules` take priority                                      |
| `disabled`     | `disabled`              | Global disable, FormItem `disabled` takes priority, control `disabled` is highest                          |
| `size`         | `size`                  | Global size, FormItem `size` takes priority, control `size` is highest                                     |
| `round`        | `round`                 | Global round, FormItem `round` takes priority, control `round` is highest                                  |
| `clearable`    | `clearable`             | Global clearable, FormItem `clearable` takes priority, control `clearable` is highest                      |
| `requiredIcon` | `requiredIcon`          | When `true`, `required` only shows asterisk without triggering default validation, FormItem takes priority |
| `showMessage`  | `showMessage`           | Whether to show validation messages, FormItem `showMessage` takes priority                                 |
| `labelWidth`   | `labelWidth`            | Label width, FormItem `labelWidth` takes priority, supports `'auto'`                                       |

### Global Rules vs Local Rules

```html
<OForm :model="model" :rules="globalRules">
  <OFormItem label="Username" field="username" required />
  <OFormItem label="Email" field="email" :rules="localRules" />
</OForm>
```

## Global CSS Variable Recommendation

OForm provides CSS variables for standard widths of each form control that respond to breakpoints. **It is recommended to apply these in your project's global styles**, so that all form control widths automatically follow breakpoint changes without needing `style="width:..."` or `:style` in templates (OButton is excluded; its width is determined by the caller):

```scss
// Apply once in project global styles (e.g., src/styles/form-controls.scss)
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

OForm width variables and their responsive behavior:

| CSS Variable                                            | Desktop Default                                                                               | Landscape Pad (841–1200px)     | ≤840px                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------ |
| `--form-item-main-box-width-standard` ^[1.2.2](primary) | `min(var(--o-r-grid-6), 100%)`                                                                | `min(var(--o-r-grid-4), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-width-wide` ^[1.2.2](primary)     | `min(var(--o-r-grid-14), 100%)`                                                               | `min(var(--o-r-grid-8), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-inline-gap` ^[1.2.2](primary)     | `var(--o-r-gap-4)`                                                                            | —                              | —                              |
| `--form-item-main-box-width-min` ^[1.2.2](primary)      | `calc((var(--form-item-main-box-width-standard) - var(--form-item-main-box-inline-gap)) / 2)` | —                              | —                              |

If project design specs differ from defaults, override the variables globally:

```css
.o-form {
  --form-item-main-box-width-standard: 280px;
  --form-item-main-box-width-wide: 560px;
}
```

### Runtime Dynamic Variables

The following CSS variables are dynamically assigned by component runtime logic, CSS override ineffective:

| CSS Variable                               | Description                   |
| ------------------------------------------ | ----------------------------- |
| --form-label-width ⚠ Runtime assignment   | Assigned by `labelWidth` prop |
| --form-label-align ⚠ Runtime assignment   | Assigned by `labelAlign` prop |
| --form-label-justify ⚠ Runtime assignment | Assigned by computed          |
| --form-item-align ⚠ Runtime assignment    | Assigned by computed          |

## API

<!-- @api OForm -->
<!-- @api OFormItem -->
