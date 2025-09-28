<docs lang="md">
<!-- zh-CN -->

#### 插槽

- `icon`: 自定义图标
- `label`: 自定义加载文案
- `default`: 自定义所有内容

<!-- en-US -->

#### Slots

- `icon`: Custom icon
- `label`: Custom loading text
- `default`: Custom content
</docs>
<script setup lang="ts">
import { OLoading } from '@opensig/opendesign';
</script>
<template>
  <div class="container">
    <OLoading visible :wrapper="null" label="custom icon loading...">
      <template #icon>
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50" />
        </svg>
      </template>
    </OLoading>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100px;
  max-width: 200px;
  position: relative;
}
svg {
  width: var(--o-icon_size-l);
  transform-origin: center;
  animation: rotate 2s linear infinite;
}

circle {
  fill: none;
  stroke: var(--o-color-primary1-light);
  stroke-width: 3;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
