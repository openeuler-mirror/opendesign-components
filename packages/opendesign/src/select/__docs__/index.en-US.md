---
sidebar: OSelect
kind: input
---

# Selector

## Examples

<!-- @usage SelectUsage -->
<!-- @case SelectSize -->
<!-- @case SelectSingle -->
<!-- @case SelectMultiple -->
<!-- @case SelectResponsive -->
<!-- @case SelectText -->
<!-- @case SelectOptions -->
<!-- @case SelectVNodeLabel -->
<!-- @case SelectSlotRender -->
<!-- @case SelectFilterable -->
<!-- @case SelectAllowCreate -->
<!-- @case SelectTokenSeparators -->
<!-- @case SelectMultipleInput -->
<!-- @case SelectVirtual -->
<!-- @case SelectLimit -->
<!-- @case SelectFallback -->

## Api

### CSS Variables

| CSS Variable                                        | Description                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| \-\-\_overlay-left                                  | Single input left offset (internal, JS-measured)                            |
| \-\-\_overlay-right                                 | Single input right offset (internal, JS-measured)                           |
| \-\-select-text-size                                | Select text size                                                            |
| \-\-select-text-height                              | Select text line height                                                     |
| \-\-select-color                                    | Select text color                                                           |
| \-\-select-color-hover                              | Select text color on hover                                                  |
| \-\-select-color-focus                              | Select text color on focus                                                  |
| \-\-select-color-disabled                           | Select text color in disabled state                                         |
| \-\-select-placeholder                              | Select placeholder text color                                               |
| \-\-select-bg-color                                 | Select background color                                                     |
| \-\-select-bg-color-hover                           | Select background color on hover                                            |
| \-\-select-bg-color-focus                           | Select background color on focus                                            |
| \-\-select-bg-color-disabled                        | Select background color in disabled state                                   |
| \-\-select-bd-color                                 | Select border color                                                         |
| \-\-select-bd-color-hover                           | Select border color on hover                                                |
| \-\-select-bd-color-focus                           | Select border color on focus                                                |
| \-\-select-bd-color-disabled                        | Select border color in disabled state                                       |
| \-\-select-icon-color                               | Select icon color                                                           |
| \-\-select-icon-color-disabled                      | Select icon color in disabled state                                         |
| \-\-select-icon-gap                                 | Spacing between select icon and text                                        |
| \-\-select-icon-size                                | Select icon size                                                            |
| \-\-select-padding                                  | Select padding                                                              |
| \-\-select-radius                                   | Select border radius ⚠ Overridden by inline style when `round` prop is set |
| \-\-select-height                                   | Select height                                                               |
| \-\-select-tag-bg-color                             | Select tag background color                                                 |
| \-\-select-tag-radius                               | Select tag border radius                                                    |
| \-\-select-tag-text-size                            | Select tag text size                                                        |
| \-\-select-tag-text-height                          | Select tag text line height                                                 |
| \-\-select-tag-padding                              | Select tag padding                                                          |
| \-\-select-tag-margin                               | Select tag margin                                                           |
| \-\-select-tag-popover-max-width                    | Select tag popover maximum width                                            |
| \-\-select-multiple-max-height                      | Select maximum height in multiple mode                                      |
| \-\-select-multiple-padding                         | Select padding in multiple mode                                             |
| \-\-select-empty-padding                            | Empty option padding                                                        |
| \-\-option-list-max-height-default ^[NEXT](primary) | Default max height of the option list in virtual scroll mode                |

### Internal CSS Classes

| Class                       | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `.o-sr-only`                | Screen reader-only hidden text node, visually zero impact @since NEXT |
| `.o-select-native-fallback` | Native select fallback element, always rendered @since NEXT           |

<!-- @api OSelect -->
<!-- @api ../../option/__docs__/OOption -->
