---
sidebar: ODialog
kind: container
---

# ODialog

## Demo

<!-- @usage DialogSizeUsage -->
<!-- @case DialogActions -->
<!-- @case DialogSlot -->
<!-- @case DialogSlotForm -->

## API

### CSS Variables

| CSS Variable               | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| \-\-dlg-close-size         | Size of the close button                                                    |
| \-\-dlg-close-color        | Color of the close button                                                   |
| \-\-dlg-close-color-hover  | Color of the close button when hovered                                      |
| \-\-dlg-close-color-active | Color of the close button when active                                       |
| \-\-dlg-color              | Text color                                                                  |
| \-\-dlg-header-color       | Header color, overrides `--dlg-color`                                       |
| \-\-dlg-bg-color           | Background color                                                            |
| \-\-dlg-radius             | Border radius                                                               |
| \-\-dlg-shadow             | Box shadow                                                                  |
| \-\-dlg-max-height         | Maximum height                                                              |
| \-\-dlg-min-height         | Minimum height                                                              |
| \-\-dlg-min-width          | Minimum width                                                               |
| \-\-dlg-width              | Width                                                                       |
| \-\-dlg-margin             | Margin                                                                      |
| \-\-dlg-edge-gap           | Padding                                                                     |
| \-\-dlg-inner-gap          | Spacing between the default header and footer                               |
| \-\-dlg-header-gap         | Spacing between the header and default content, overrides `--dlg-inner-gap` |
| \-\-actions-justify        | Alignment of the action buttons at the bottom                               |

<!-- @api ODialog -->

### DialogActionT

```ts
interface DialogActionT {
  id: string | number;
  color?: 'normal' | 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'outline' | 'text';
  size?: 'large' | 'medium' | 'small';
  label?: string;
  round?: 'pill' | (string & {});
  icon?: Component;
  disabled?: boolean;
  loading?: boolean;
  // Button click event callback function
  onClick: () => void;
}
```

See [OButton API Props](/en-US/components/button#props)

### BaseScrollerPropsT

```ts
type BaseScrollerPropsT = {
  disabledX: boolean;
  disabledY: boolean;
  duration: number;
  showType: 'auto' | 'always' | 'hover' | 'never';
  size: 'medium' | 'small';
  autoUpdateOnScrollSize: boolean;
  barClass?: string | undefined;
};
```

See [Scroller API Props](/en-US/components/scroller#props)
