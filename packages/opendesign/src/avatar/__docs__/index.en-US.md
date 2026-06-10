---
sidebar: OAvatar ^[1.2.3](primary)
kind: display
---

# Avatar

Component for displaying user avatars, supporting image, text, and icon content modes. Can be composed into avatar groups.

## Demo

<!-- @usage AvatarUsage -->
<!-- @case AvatarImage -->
<!-- @case AvatarContentType -->
<!-- @case AvatarNameFormatter -->
<!-- @case AvatarTrigger -->

<!-- @case AvatarGroupHorizontal -->
<!-- @case AvatarGroupSymmetric -->

## API

### CSS Variables

| CSS Variable                      | Description                                                                    | Default                          |
| ----------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `--avatar-size` ⚠ Runtime assignment | Avatar size (dynamically assigned by `size` prop, CSS override may be overridden by inline style priority) | -                                |
| `--avatar-bg` ⚠ Runtime assignment | Avatar background color (random auxiliary for text mode, fill2 for image mode; assigned by `background` prop or internal random logic, CSS override ineffective) | -                                |
| `--avatar-color`  | Text color / mask icon color                                                   | `var(--o-color-white)`           |
| `--avatar-mask`   | Mask background color when clickable                                           | `var(--o-color-mask1)`           |
| `--avatar-border` | Border for avatars in group (used to distinguish stacking layers)              | `2px solid var(--o-color-fill2)` |

<!-- @api OAvatar -->
<!-- @api OAvatarGroup -->
