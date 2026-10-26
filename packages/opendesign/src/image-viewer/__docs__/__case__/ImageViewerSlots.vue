<docs lang="md">
<!-- zh-CN -->

### 自定义插槽

`OImageViewer` 提供以下插槽，便于按需替换或扩展 UI：

| 插槽       | 作用域参数                                                              | 说明                                                                                            |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `preview`  | `src`                                                                   | 自定义预览内容，替换默认的图片查看器 UI（如视频播放器），仍享有 OLayer 的遮罩层、关闭按钮等能力 |
| `default`  | —                                                                       | 渲染在图片容器内，可叠加自定义覆盖层                                                            |
| `toolbar`  | `actions` / `prev` / `next` / `reset` / `activeIndex` / `setActiveItem` | 自定义工具栏，可调用提供的方法实现交互                                                          |
| `progress` | `activeIndex` / `total`                                                 | 自定义图片切换进度指示器                                                                        |
| `error`    | `activeIndex` / `src`                                                   | 自定义图片加载失败提示                                                                          |

下方示例演示 `#toolbar`、`#progress`、`#error` 三个插槽的自定义渲染：

- `#toolbar`：用作用域参数 `prev` / `next` / `actions` / `reset` 自绘按钮，调用即可实现切图、缩放、旋转、重置。
- `#progress`：用 `activeIndex` / `total` 渲染"当前 / 总数"指示器。
- `#error`：当图片加载失败时，用 `activeIndex` / `src` 渲染差异化错误占位。

<!-- en-US -->

### Custom Slots

`OImageViewer` exposes the following slots for on-demand UI replacement or extension:

| Slot       | Scope Props                                                             | Description                                                                                                                             |
| ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `preview`  | `src`                                                                   | Custom preview content, replaces the default image viewer UI (e.g. video player), still benefits from OLayer's mask, close button, etc. |
| `default`  | —                                                                       | Rendered inside the image container, useful for overlaying custom content                                                               |
| `toolbar`  | `actions` / `prev` / `next` / `reset` / `activeIndex` / `setActiveItem` | Custom toolbar, call the provided methods for interaction                                                                               |
| `progress` | `activeIndex` / `total`                                                 | Custom progress indicator                                                                                                               |
| `error`    | `activeIndex` / `src`                                                   | Custom image load error display                                                                                                         |

The example below demonstrates custom rendering for the `#toolbar`, `#progress`, and `#error` slots:

- `#toolbar`: draw buttons using scope props `prev` / `next` / `actions` / `reset` — call them to switch images, zoom, rotate, and reset.
- `#progress`: render a "current / total" indicator using `activeIndex` / `total`.
- `#error`: render a differentiated error placeholder using `activeIndex` / `src` when an image fails to load.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';
import type { ImageViewerAction } from '../../types';

const imgList = [
  'https://www.openeuler.org/img/banners/20230418-odd.png',
  'https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG',
  'https://www.openeuler.org/img/nonexistent-broken-image.png',
];
const visible = ref(false);

const onShow = () => {
  visible.value = true;
};
const onClose = () => {
  visible.value = false;
};

/**
 * 自定义工具栏按钮调用缩放 / 旋转 action
 * @param actions 作用域提供的 handleActions 函数
 * @param action action 名称
 */
const callAction = (actions: (action: ImageViewerAction) => void, action: ImageViewerAction) => {
  actions(action);
};
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" @click="onShow">显示预览（自定义插槽）</OButton>
    <OImageViewer v-model:visible="visible" :preview-list="imgList" :current-index="0" :show-progress="false" :toolbar="false" @close="onClose">
      <template #toolbar="{ actions, prev, next, reset, activeIndex, setActiveItem }">
        <div class="demo-toolbar">
          <button type="button" class="demo-btn" :disabled="activeIndex === 0" @click="prev">‹ 上一张</button>
          <button type="button" class="demo-btn" @click="callAction(actions, 'zoomOut')">缩小</button>
          <button type="button" class="demo-btn" @click="callAction(actions, 'zoomIn')">放大</button>
          <button type="button" class="demo-btn" @click="callAction(actions, 'rotateLeft')">↺</button>
          <button type="button" class="demo-btn" @click="callAction(actions, 'rotateRight')">↻</button>
          <button type="button" class="demo-btn" @click="reset">重置</button>
          <button type="button" class="demo-btn" :disabled="activeIndex === imgList.length - 1" @click="next">下一张 ›</button>
          <span class="demo-jump">
            跳转：
            <button v-for="(_, i) in imgList" :key="i" type="button" class="demo-dot" :class="{ active: i === activeIndex }" @click="setActiveItem(i)">
              {{ i + 1 }}
            </button>
          </span>
        </div>
      </template>

      <template #progress="{ activeIndex, total }">
        <span class="demo-progress">{{ activeIndex + 1 }} / {{ total }}</span>
      </template>

      <template #error="{ activeIndex, src }">
        <div class="demo-error">
          <div class="demo-error-icon">⚠</div>
          <p>第 {{ activeIndex + 1 }} 张加载失败</p>
          <p class="demo-error-src">{{ src }}</p>
          <p class="demo-error-hint">点击图片可重试</p>
        </div>
      </template>
    </OImageViewer>
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}

.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--o-color-fill2);
  border-radius: var(--o-radius_control-m);
}

.demo-btn {
  padding: 4px 10px;
  font-size: var(--o-font_size-text2);
  color: var(--o-color-info1-inverse);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--o-radius_control-s);
  cursor: pointer;

  &:hover {
    background: var(--o-color-fill3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.demo-jump {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  font-size: var(--o-font_size-tip1);
  color: var(--o-color-info2-inverse);
}

.demo-dot {
  width: 22px;
  height: 22px;
  font-size: var(--o-font_size-tip1);
  color: var(--o-color-info2-inverse);
  background: transparent;
  border: 1px solid var(--o-color-fill3);
  border-radius: 50%;
  cursor: pointer;

  &.active {
    color: var(--o-color-info1-inverse);
    background: var(--o-color-primary);
    border-color: var(--o-color-primary);
  }
}

.demo-progress {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  font-size: var(--o-font_size-text2);
  color: var(--o-color-info1-inverse);
  background: var(--o-color-fill2);
  border-radius: var(--o-radius_control-m);
}

.demo-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px;
  color: var(--o-color-info2);
  cursor: pointer;

  .demo-error-icon {
    font-size: 48px;
    color: var(--o-color-auxiliary4);
  }

  .demo-error-src {
    font-size: var(--o-font_size-tip2);
    color: var(--o-color-info3);
    word-break: break-all;
  }

  .demo-error-hint {
    font-size: var(--o-font_size-tip1);
    color: var(--o-color-info3);
  }
}
</style>
