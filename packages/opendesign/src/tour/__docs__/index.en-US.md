---
sidebar: OTour Tour ^[1.2.7](primary)
kind: nav
---

# Tour

## Examples

<!-- @usage TourUsage -->
<!-- @case TourNonModal -->
<!-- @case TourCenter -->

## Responsive

When the viewport width is ≤ 840px (phone / pad_v breakpoints), OTour does not render the guide card or mask to avoid covering content on small screens; it resumes display once the viewport returns to > 840px. This is driven by the component's built-in breakpoint detection and requires no extra configuration.

## Behaviors

### Keyboard Navigation

While the guide card is displayed, press **←** (Left Arrow) to go to the previous step and **→** (Right Arrow) to go to the next step. When focus is inside an `input`, `textarea`, `select`, or `contentEditable` element, arrow keys are reserved for text editing and do not trigger step navigation.

### Reset on Close

When the Tour is closed (`visible` set to `false`), `current` automatically resets to `0`, so the next opening starts from the first step. To preserve the step position, save the current step index in the `close` / `finish` event and restore it via `v-model:current` on the next opening.

### Auto Close

Clicking "Next" on the last step dispatches the `finish` event and automatically sets `visible` to `false`. Pressing `ESC` to close (when `closeOnPressEscape=true`, enabled by default) dispatches the `close` event with the current step index.

### Button Callback Timing

`prevButtonProps.onClick` / `nextButtonProps.onClick` are called **after** the step switch completes — they cannot be used to prevent navigation. To intercept before switching (e.g. for validation), use `v-model:current` + `watch` to control navigation manually.

### Mask Body Class

When the mask is enabled (`mask=true`, default) and the Tour is visible, an `o-tour-open` class is added to `<body>`; it is removed when the Tour is hidden. You can use this class for custom styles such as scroll locking:

```css
body.o-tour-open {
  overflow: hidden;
}
```

## API

### CSS Variables

| CSS Variable                | Description                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------- |
| \-\-tour-width              | Guide card width                                                                        |
| \-\-tour-radius             | Guide card border radius                                                                |
| \-\-tour-padding            | Guide card padding                                                                      |
| \-\-tour-bg-color           | Guide card background color                                                             |
| \-\-tour-shadow             | Guide card shadow                                                                       |
| \-\-tour-title-size         | Title font size                                                                         |
| \-\-tour-title-height       | Title line height                                                                       |
| \-\-tour-title-color        | Title color                                                                             |
| \-\-tour-title-weight       | Title font weight                                                                       |
| \-\-tour-detail-size        | Detail font size                                                                        |
| \-\-tour-detail-height      | Detail line height                                                                      |
| \-\-tour-detail-color       | Detail text color                                                                       |
| \-\-tour-detail-gap         | Detail spacing                                                                          |
| \-\-tour-footer-gap         | Footer area spacing                                                                     |
| \-\-tour-btn-gap            | Button gap                                                                              |
| \-\-tour-indicators-size    | Indicator font size                                                                     |
| \-\-tour-indicators-height  | Indicator line height                                                                   |
| \-\-tour-indicators-color   | Indicator color                                                                         |
| \-\-tour-close-size         | Close button size                                                                       |
| \-\-tour-close-color        | Close button color                                                                      |
| \-\-tour-close-color-hover  | Close button hover color                                                                |
| \-\-tour-close-color-active | Close button active color                                                               |
| \-\-tour-close-img-size     | Close button size in image mode                                                         |
| \-\-tour-close-img-bg       | Close button background color in image mode                                             |
| \-\-tour-mask-fill          | Mask fill color                                                                         |
| \-\-popup-bd                | Popup border (Tour overrides OPopup default)                                            |
| \-\-popup-bg-color          | Popup background color (Tour overrides OPopup default)                                  |
| \-\-\_tour-anchor-bg        | Arrow background color (sampled from image; internal, falls back to \-\-popup-bg-color) |

<!-- @api OTour -->
<!-- @api OTourStep -->
