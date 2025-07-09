## API OButton

### props

| Property | Type | Description |
| --- | --- | --- |
| disabled | boolean \| undefined | Whether the button is in a disabled state |
| loading | boolean \| undefined | Whether the button is in a loading state |
| color | "success" \| "normal" \| "primary" \| "warning" \| "danger" \| undefined | Color type (ColorT) |
| variant | "text" \| "solid" \| "outline" \| undefined | Button style variant |
| tag | string \| undefined | Custom element tag |
| size | "medium" \| "small" \| "large" \| undefined | Button size (ButtonSizeT) |
| round | string \| undefined | Border radius value (RoundT) |
| icon | Component \| undefined | Prefix icon component |
| href | string \| undefined | Link destination URL |

### events

| Event | Signature |
| --- | --- |
| click | (event: "click", evt: MouseEvent): void |

### slots

| Slot | Props |
| --- | --- |
| icon | {} |
| default | {} |
| suffix | {} |