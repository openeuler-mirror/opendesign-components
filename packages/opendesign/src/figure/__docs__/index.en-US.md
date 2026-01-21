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

### API

#### CSS Variable

| CSS Variable | Description |
| --- | --- |
| \-\-figure-padding-top | The percentage of the container's width that determines the image height, corresponding to the `ratio` value |
| \-\-figure-fit | Value corresponding to the `fit` property (recommended to set via the `fit` attribute) |
| \-\-figure-position | Image display position, used to assign values to the `background-position` or `object-position` property |
| \-\-figure-radius | Image border radius |
| \-\-figure-error-color | Text color for the error message when image loading fails |
| \-\-figure-error-size | Text size or icon size for the error prompt when image loading fails |
| \-\-figure-play-icon-size | Play icon size |

<!-- @api OFigure  -->
