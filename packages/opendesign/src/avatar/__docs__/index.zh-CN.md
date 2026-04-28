---
sidebar: OAvatar 头像
kind: display
---

# 头像

用于展示用户头像，支持图片、文字、图标三种内容形态，可组合为头像组展示。

## 示例

<!-- @usage AvatarUsage -->
<!-- @case AvatarImage -->
<!-- @case AvatarContentType -->
<!-- @case AvatarNameFormatter -->
<!-- @case AvatarTrigger -->

<!-- @case AvatarGroupHorizontal -->
<!-- @case AvatarGroupSymmetric -->

## API

### CSS 变量

| CSS 变量          | 描述                                                        | 默认值                           |
| ----------------- | ----------------------------------------------------------- | -------------------------------- |
| `--avatar-size`   | 头像尺寸                                                    | -                                |
| `--avatar-bgc`    | 头像背景色（文字模式随机取 auxiliary 色，图片模式为 fill2） | -                                |
| `--avatar-color`  | 头像文字颜色 / 遮罩层图标颜色                               | `var(--o-color-info1-inverse)`   |
| `--avatar-mask`   | 可点击状态下遮罩层背景色                                    | `var(--o-color-mask1)`           |
| `--avatar-border` | 头像组内头像边框（用于堆叠时区分层级）                      | `2px solid var(--o-color-fill2)` |

<!-- @api OAvatar -->
<!-- @api OAvatarGroup -->
