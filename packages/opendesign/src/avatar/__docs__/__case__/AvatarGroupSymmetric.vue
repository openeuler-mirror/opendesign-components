<docs lang="md">
<!-- zh-CN -->

### 头像组 - 对称堆叠

`layout='symmetric'` 时，头像以网格布局展示：

- **1-2 个头像**：水平排列
- **3 个头像**：1 个在上、2 个在下，呈等腰三角形
- **4 个头像**：2×2 正方形网格
- **≥5 个头像**：2×2 网格 + 溢出头像

通过 `overflowType` 配置溢出头像的展示方式：

- `ellipsis`（默认）：显示省略号图标
- `count`：显示 +N 数量（超过 99 显示 99+）

<!-- en-US -->

### Avatar Group - Symmetric

When `layout='symmetric'`, avatars are displayed in a grid layout:

- **1-2 avatars**: horizontal arrangement
- **3 avatars**: 1 on top, 2 on bottom, forming an isosceles triangle
- **4 avatars**: 2×2 square grid
- **≥5 avatars**: 2×2 grid + overflow avatar

Configure overflow display via `overflowType`:

- `ellipsis` (default): shows ellipsis icon
- `count`: shows +N count (shows 99+ when exceeding 99)
</docs>
<script setup lang="ts">
import { OAvatarGroup } from '@opensig/opendesign';

const urlList = [
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=1', name: 'Alice' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=2', name: 'Bob' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=3', name: 'Carol' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=4', name: 'Dave' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=5', name: 'Eve' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=6', name: 'Frank' },
];

const generateList = (count: number) => Array.from({ length: count }, (_, i) => ({ name: `User${i + 1}` }));
const generateUrlList = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ url: `https://api.dicebear.com/9.x/micah/svg?seed=${i + 1}`, name: `User${i + 1}` }));
</script>
<template>
  <div class="row">
    <span class="label">ellipsis</span>
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 1)" size="60px" />
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 2)" size="60px" />
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 3)" size="60px" />
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 4)" size="60px" />
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 5)" size="60px" />
  </div>
  <div class="row">
    <span class="label">count (单数字)</span>
    <OAvatarGroup layout="symmetric" :url-list="urlList.slice(0, 5)" size="60px" overflow-type="count" />
  </div>
  <div class="row">
    <span class="label">count (超多溢出)</span>
    <OAvatarGroup layout="symmetric" :url-list="generateList(300)" size="60px" overflow-type="count" />
    <OAvatarGroup layout="symmetric" :url-list="generateUrlList(300)" size="60px" overflow-type="count" />
  </div>
</template>
