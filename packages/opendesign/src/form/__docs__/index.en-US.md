---
sidebar: OForm
kind: container
---

# OForm

## Demo

<!-- @usage FormUsage -->
<!-- @case ValidateData -->
<!-- @case FormCustom -->

## Global CSS Variable Recommendation

OForm provides CSS variables for standard widths of each form control that respond to breakpoints. **It is recommended to apply these in your project's global styles**, so that all form control widths automatically follow breakpoint changes without needing `style="width:..."` or `:style` in templates (OButton is excluded; its width is determined by the caller):

```scss
// Apply once in project global styles (e.g., src/styles/form-controls.scss)
.o-form {
  .o-input, .o-select, .o-input-number, .o-cascader, .o-ip-input {
    width: var(--form-item-main-box-width-standard);
  }
  .o-textarea {
    width: var(--form-item-main-box-width-wide);
  }
}
```

OForm width variables and their responsive behavior:

| CSS Variable | Desktop Default | Landscape Pad (841–1200px) | ≤840px |
|---------|------------|----------------------|--------|
| `--form-item-main-box-width-standard` ^[1.2.2](primary) | `min(var(--o-r-grid-6), 100%)` | `min(var(--o-r-grid-4), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-width-wide` ^[1.2.2](primary) | `min(var(--o-r-grid-14), 100%)` | `min(var(--o-r-grid-8), 100%)` | `min(var(--o-r-grid-6), 100%)` |
| `--form-item-main-box-inline-gap` ^[1.2.2](primary) | `var(--o-r-gap-4)` | — | — |
| `--form-item-main-box-width-min` ^[1.2.2](primary) | `calc((var(--form-item-main-box-width-standard) - var(--form-item-main-box-inline-gap)) / 2)` | — | — |

If project design specs differ from defaults, override the variables globally:

```css
.o-form {
  --form-item-main-box-width-standard: 280px;
  --form-item-main-box-width-wide: 560px;
}
```

### Runtime Dynamic Variables

The following CSS variables are dynamically assigned by component runtime logic, CSS override ineffective:

| CSS Variable | Description |
| --- | --- |
| --form-label-width ⚠ Runtime assignment | Assigned by `labelWidth` prop |
| --form-label-align ⚠ Runtime assignment | Assigned by `labelAlign` prop |
| --form-label-justify ⚠ Runtime assignment | Assigned by computed |
| --form-item-align ⚠ Runtime assignment | Assigned by computed |

## API

<!-- @api OForm -->
<!-- @api OFormItem -->
