<docs lang="md">
<!-- zh-CN -->

#### 自定义播放图标

可通过 `play-icon` 插槽自定义播放图标。

<!-- en-US -->

#### Custom Play Icon

You can customize the play icon through the `play-icon` slot.
</docs>

<script setup lang="ts">
import { OFigure, OIconLoading, OIconVideoPlay } from '@opensig/opendesign';
</script>
<template>
  <OFigure src="/card-cover.jpg" video-poster class="custom-play-icon">
    <template #play-icon>
      <OIconLoading class="icon-item loading" />
      <OIconVideoPlay class="icon-item play" />
    </template>
  </OFigure>
</template>

<style lang="scss" scoped>
@keyframes rotating {
  to {
    transform: rotate(360deg);
  }
}
.icon-item {
  font-size: var(--o-icon_size-l);
  color: #fff;
}
.loading {
  animation: rotating 1s linear infinite;
}
.play {
  display: none;
}
.custom-play-icon {
  max-width: 500px;
  &:hover {
    .loading {
      display: none;
    }
    .play {
      display: block;
    }
  }
}
</style>
