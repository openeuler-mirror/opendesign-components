<docs lang="md">
<!-- zh-CN -->

### 头像组 - 水平堆叠

`layout='horizontal'` 时（默认），头像水平排列并部分堆叠（负 margin 实现）。当头像数量超过 2 个时，第 3 个位置显示溢出头像。

通过 `overflowType` 配置溢出头像的展示方式：

- `ellipsis`（默认）：显示省略号图标
- `count`：显示 +N 数量（超过 99 显示 99+）

<!-- en-US -->

### Avatar Group - Horizontal

When `layout='horizontal'` (default), avatars are arranged horizontally with stacking (via negative margin). When there are more than 2 avatars, the 3rd position shows overflow avatar.

Configure overflow display via `overflowType`:

- `ellipsis` (default): shows ellipsis icon
- `count`: shows +N count (shows 99+ when exceeding 99)
</docs>
<script setup lang="ts">
import { OAvatarGroup } from '@opensig/opendesign';

const urlList = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'Dave' }, { name: 'Eve' }, { name: 'Frank' }, { name: 'Grace' }];
const urlListWithUrl = [
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=1', name: 'Alice' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=2', name: 'Bob' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=3', name: 'Carol' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=4', name: 'Dave' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=5', name: 'Eve' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=6', name: 'Frank' },
  { url: 'https://api.dicebear.com/9.x/micah/svg?seed=7', name: 'Grace' },
];

const generateList = (count: number) => Array.from({ length: count }, (_, i) => ({ name: `User${i + 1}` }));
const generateUrlList = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ url: `https://api.dicebear.com/9.x/micah/svg?seed=${i + 1}`, name: `User${i + 1}` }));
</script>
<template>
  <div class="row">
    <span class="label">ellipsis (文字头像)</span>
    <OAvatarGroup :url-list="urlList.slice(0, 1)" size="60px" />
    <OAvatarGroup :url-list="urlList.slice(0, 2)" size="60px" />
    <OAvatarGroup :url-list="urlList.slice(0, 3)" size="60px" />
    <OAvatarGroup :url-list="urlList.slice(0, 5)" size="60px" />
  </div>
  <div class="row">
    <span class="label">count (文字头像)</span>
    <OAvatarGroup :url-list="urlList.slice(0, 3)" size="60px" overflow-type="count" />
    <OAvatarGroup :url-list="urlList.slice(0, 5)" size="60px" overflow-type="count" />
  </div>
  <div class="row">
    <span class="label">ellipsis (图片头像)</span>
    <OAvatarGroup :url-list="urlListWithUrl.slice(0, 3)" size="60px" />
    <OAvatarGroup :url-list="urlListWithUrl.slice(0, 5)" size="60px" />
  </div>
  <div class="row">
    <span class="label">count (图片头像)</span>
    <OAvatarGroup :url-list="urlListWithUrl.slice(0, 3)" size="60px" overflow-type="count" />
    <OAvatarGroup :url-list="urlListWithUrl.slice(0, 5)" size="60px" overflow-type="count" />
  </div>
  <div class="row">
    <span class="label">count (超多溢出)</span>
    <OAvatarGroup :url-list="urlList.slice(0, 2)" size="60px" overflow-type="count" />
    <OAvatarGroup :url-list="generateList(300)" size="60px" overflow-type="count" />
    <OAvatarGroup :url-list="generateUrlList(300)" size="60px" overflow-type="count" />
  </div>
</template>
