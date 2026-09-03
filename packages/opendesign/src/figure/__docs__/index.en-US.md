---
sidebar: OFigure
kind: display
---

# OFigure

## Demo

<!-- @usage FigureUsage -->
<!-- @case LoadError -->
<!-- @case HandlePreview -->
<!-- @case VideoPoster -->
<!-- @case CustomPlayIcon -->

### Card

- The image title can be rendered through the `title` or `content` slot
- Cards containing text content can be rendered through the `default` slot

For details: [Image-Only Card](/en-US/components/card#image-only-card?__skin=a)

<!-- @case LazyLoad -->

### Image Preview

- When `preview` is `true`, clicking the image opens the preview. Pass an object to forward as `OImageViewer` props (e.g. `zoomRate`, `minScale`, `toolbar`).
- The `#preview` slot replaces the entire preview UI (e.g. video player). In this case, `scalable` is automatically set to `false` — custom preview content is not suitable for image zoom interactions. To enable zoom, explicitly set `scalable: true` in the `preview` object.
- The `#preview-extra` slot overlays content on the preview image (e.g. playback controls).
- `preview-close` controls close behavior: `'mask'` (click mask), `'button'` (close button), `'body'` (click image), `'none'` (disable default close, use with `preview(false)` for manual close).

<!-- @case HandlePreview -->

### API

#### CSS Variable

| CSS Variable              | Description                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| \-\-figure-padding-top    | The percentage of the container's width that determines the image height, corresponding to the `ratio` value |
| \-\-figure-fit            | Value corresponding to the `fit` property (recommended to set via the `fit` attribute)                       |
| \-\-figure-position       | Image display position, used to assign values to the `background-position` or `object-position` property     |
| \-\-figure-radius         | Image border radius                                                                                          |
| \-\-figure-error-color    | Text color for the error message when image loading fails                                                    |
| \-\-figure-error-size     | Text size or icon size for the error prompt when image loading fails                                         |
| \-\-figure-play-icon-size | Play icon size                                                                                               |

<!-- @api OFigure  -->
