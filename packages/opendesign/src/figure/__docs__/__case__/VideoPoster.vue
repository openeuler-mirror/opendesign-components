<docs lang="md">
<!-- zh-CN -->

### 视频海报

设置 `OFigure` 组件的 `videoPoster` 属性为 `true`，开启视频海报模式：

- 自动添加中心播放图标
- 自动启用悬停放大效果

#### 自定义预览内容

- 设置组件的 `preview` 属性为 `true` 开启预览功能
- 使用 `preview` 插槽自定义预览内容（如：视频播放界面）
- 使用 `preview-extra` 插槽可添加预览区域底部内容（例如：播放控制按钮）

<!-- en-US -->

### Video Poster

Set the `videoPoster` property of the `OFigure` component to `true` to enable video poster mode:

- Automatically adds a center play icon
- Automatically enables the hover zoom effect

#### Custom Preview Content

- Set the component's `preview` property to `true` to enable the preview functionality
- Use the `preview` slot to customize the preview content (e.g., video playback interface)
- Use the `preview-extra` slot to add content at the bottom of the preview area (e.g., playback control buttons)
</docs>
<script setup lang="ts">
import { OFigure } from '@opensig/opendesign';
import posterSrc from '@assets/images/opendesign.png';
import videoSrc from '@assets/images/opendesign-twinkle.mp4';
</script>
<template>
  <OFigure :src="posterSrc" video-poster preview class="figure-poster">
    <template #preview>
      <video :src="videoSrc" autoplay muted controls class="figure-video"></video>
    </template>
  </OFigure>
</template>
<style scoped lang="scss">
.figure-poster {
  max-width: 500px;
}
.figure-video {
  width: 100%;
}
</style>
