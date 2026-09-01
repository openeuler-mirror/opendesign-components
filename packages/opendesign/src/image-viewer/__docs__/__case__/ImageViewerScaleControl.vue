<docs lang="md">
<!-- zh-CN -->

### 父组件控制缩放比例

`scale` 属性支持 `v-model:scale` 双向绑定。不传 `scale` 时，图片加载后自动计算适屏缩放比例（小图放大至 200%，大图缩至整屏可见）；传入 `scale` 时，图片加载后保持该比例，跳过自动适屏。

下方示例通过开关切换两种模式：

- **自动适屏**：不传 `scale`，图片加载后自动放大到 200%（1×1 测试图）
- **父组件控制**：传入 `scale`，图片加载后保持指定比例，用户缩放后比例通过 `v-model:scale` 回传

切换模式或调整比例后点击「显示预览」即可观察效果。重置按钮在自动适屏模式下回到 200%，在父组件控制模式下回到传入的初始比例。

<!-- en-US -->

### Parent-Controlled Scale

The `scale` property supports `v-model:scale` two-way binding. When `scale` is omitted, the image auto-fits after loading (small images zoom to 200%, large images shrink to fit screen). When `scale` is provided, the image keeps that scale after loading, skipping auto-fit.

Toggle between two modes below:

- **Auto-fit**: no `scale` passed — image auto-zooms to 200% after load (1×1 test image)
- **Parent-controlled**: `scale` provided — image keeps the specified ratio after load; user zoom updates propagate back via `v-model:scale`

After switching modes or adjusting the ratio, click "Show Preview" to observe the effect. The reset button returns to 200% in auto-fit mode, or to the initially passed scale in parent-controlled mode.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton, OSwitch, OSlider } from '@opensig/opendesign';

/** 1×1 测试图，fitScale = min(2, scaleW, scaleH) = 2（200%） */
const imgList = ['https://dummyimage.com/3840x2160/CEDBF5/626270.jpg&text=4K-H'];
const visible = ref(false);

/** 是否由父组件控制缩放（true=传入 scale，false=自动适屏） */
const controlled = ref(false);
/** 父组件指定的初始缩放比例 */
const customScale = ref(0.5);
/** v-model:scale 双向绑定的当前值 */
const currentScale = ref<number | undefined>(undefined);

/** 重建 key，切换模式或调整比例时强制组件重新挂载以重置 initialScale */
const viewerKey = ref(0);

const onShow = () => {
  // 受控模式下传入 customScale，非受控模式下传 undefined（触发自动适屏）
  currentScale.value = controlled.value ? customScale.value : undefined;
  viewerKey.value++;
  visible.value = true;
};

/** 将比例格式化为百分比文本 */
const scalePercent = (val?: number) => {
  if (val == null) return '—';
  return `${Math.round(val * 100)}%`;
};
</script>

<template>
  <div class="demo-wrap">
    <div class="demo-controls">
      <label class="demo-row">
        <span>父组件控制缩放</span>
        <OSwitch v-model="controlled" />
      </label>
      <label v-if="controlled" class="demo-row">
        <span>初始缩放：{{ scalePercent(customScale) }}</span>
        <OSlider v-model="customScale" :min="0.1" :max="5" :step="0.1" class="demo-slider" />
      </label>
    </div>
    <OButton color="primary" variant="solid" @click="onShow">显示预览</OButton>
    <p class="demo-status">当前模式：{{ controlled ? '父组件控制' : '自动适屏' }} ｜ 当前缩放：{{ scalePercent(currentScale) }}</p>
    <OImageViewer
      :key="viewerKey"
      v-model:visible="visible"
      v-model:scale="currentScale"
      :preview-list="imgList"
      :show-zoom-ratio="true"
      :toolbar="['zoomOut', 'zoomIn', 'reset']"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.demo-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}

.demo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
}

.demo-slider {
  flex: 1;
}

.demo-status {
  font-size: 13px;
  color: var(--o-color-info2);
  margin: 0;
}
</style>
