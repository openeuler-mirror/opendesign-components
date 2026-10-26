<docs lang="md">
<!-- zh-CN -->

### 固定显示 + 窗口缩放

`OPopup` 在固定显示（弹层保持打开）时，窗口宽度变化后仍会持续贴合触发元素。本例模拟业务门户常见的右侧悬浮窗：`position: fixed` 的右对齐容器同时承载触发元素与 `wrapper`，弹层内容宽度随窗口宽度自适应。

要点：

- 触发元素与 `wrapper` 位于同一 `fixed` 右对齐容器内，容器随窗口宽度移动而自身尺寸不变；
- 弹层通过 `target` 指向触发元素、`wrapper` 指定挂载容器，`auto-hide="false"` 保持弹层不随 hover 移出而关闭；
- `offset` 控制弹层与触发元素的距离，`position` 可设置贴合方位。

点击下方按钮切换「窗口宽度」，观察弹层在不同视口宽度下始终贴合触发图标；面板内容宽度随之自适应。

<!-- en-US -->

### Fixed Display + Window Resize

`OPopup` keeps tracking the trigger element when the window width changes, even in a fixed-display (kept-open) scenario. This demo mimics a common floating widget on business portals: a `position: fixed` right-aligned container holds both the trigger element and the `wrapper`, and the popup content width adapts to the window width.

Key points:

- The trigger element and `wrapper` live in the same `fixed` right-aligned container, whose viewport position moves with the window width while its own size stays unchanged;
- The popup is anchored to the trigger via `target` and mounted into the `wrapper` container; `auto-hide="false"` keeps it open regardless of hover-out;
- `offset` controls the distance between the popup and the trigger, and `position` sets the tracking side.

Click the buttons below to switch the "window width" and observe the popup staying glued to the trigger icon at different viewport widths; the panel content width adapts accordingly.
</docs>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { OPopup, OSwitch } from '@opensig/opendesign';

// 触发元素与 wrapper 所在容器：fixed 右对齐，模拟业务门户的悬浮窗
const floatTargetRef = ref<HTMLElement | null>(null);
// 触发元素（图标）：弹层定位的目标
const iconRef = ref<HTMLElement | null>(null);
// 评分值（交互演示用）
const score = ref(0);
// 弹层显隐：固定显示场景，默认打开
const visible = ref(true);

// 模拟窗口宽度：驱动容器右偏移与面板宽度联动，等价于真实缩放窗口
const simWidth = ref(1920);

/**
 * @description 模拟窗口宽度 → 容器 right 偏移：真实窗口宽度 W 时容器左缘为
 * `W - right - 48`；用固定 right 基准 40 + 差值，让不同 simWidth 产生与真实
 * 窗口一致的容器视口位置（如 simWidth=1100 等价于真实 1100 窗口）
 */
const floatStyle = computed(() => ({
  right: `${40 + (1920 - simWidth.value)}px`,
}));

/**
 * @description 弹层内容宽度：随模拟窗口宽度自适应（模拟业务面板），
 * 各档位产生不同宽度，切换时弹层内容尺寸变化会触发 popup 自身 RO 重算，
 * 使 OPopup 依据实时定位源更新贴合位置
 */
const panelWidth = computed(() => Math.min(480, Math.max(200, Math.round(simWidth.value * 0.25))));

// 预设窗口宽度（覆盖桌面端到窄屏的典型区间）
const presets = [1920, 1400, 1100];
</script>
<template>
  <div class="demo-popup-resize-fixed">
    <div class="demo-popup-resize-float" :style="floatStyle">
      <div ref="floatTargetRef" class="demo-popup-resize-nav">
        <div ref="iconRef" class="demo-popup-resize-icon">☆</div>
        <OPopup
          v-model:visible="visible"
          position="rt"
          :target="iconRef"
          :wrapper="floatTargetRef"
          :offset="20"
          trigger="hover"
          :auto-hide="false"
          wrap-class="demo-popup-resize-panel"
        >
          <div class="demo-popup-resize-card" :style="{ width: `${panelWidth}px` }">
            <div class="demo-popup-resize-title">满意度反馈</div>
            <div class="demo-popup-resize-stars">
              <span v-for="n in 5" :key="n" :class="{ active: score >= n }" @click="score = n">★</span>
            </div>
            <div class="demo-popup-resize-note">
              {{ score ? `已选 ${score} 星` : '请选择评分' }}
            </div>
          </div>
        </OPopup>
      </div>
    </div>
    <div class="demo-popup-resize-toolbar">
      <label class="demo-popup-resize-switch">
        <OSwitch v-model="visible" size="small" />
        <span>弹层显示</span>
      </label>
      <span class="demo-popup-resize-preset-label">窗口宽度：</span>
      <button v-for="w in presets" :key="w" class="demo-popup-resize-preset" :class="{ active: simWidth === w }" @click="simWidth = w">{{ w }}</button>
      <code class="demo-popup-resize-readout">面板宽 {{ panelWidth }}px</code>
    </div>
  </div>
</template>
<style lang="scss">
// 弹层内容 Teleport 到 body，需通过 wrapClass 提供非 scoped 的外观定制
.demo-popup-resize-panel {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-bd: 1px solid var(--o-color-control4);
  --popup-padding: 0;

  color: var(--o-color-info1);
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
}
</style>
<style lang="scss" scoped>
.demo-popup-resize-fixed {
  position: relative;
  min-height: 140px;
}

// 业务悬浮窗容器：fixed 右对齐，容器 right 随模拟窗口宽度变化，
// 使触发元素视口位置移动而自身尺寸不变（等价于真实窗口缩放）
.demo-popup-resize-float {
  position: fixed;
  bottom: 200px;
  width: 48px;
}

// 触发元素与 wrapper 的承载容器
.demo-popup-resize-nav {
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
}

// 触发图标
.demo-popup-resize-icon {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-primary1);
  color: var(--o-color-info1-inverse);
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
  cursor: pointer;
  user-select: none;
}

.demo-popup-resize-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: 12px;
}

.demo-popup-resize-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--o-color-info1);
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
}

.demo-popup-resize-preset-label {
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}

.demo-popup-resize-preset {
  padding: 2px 10px;
  border: 1px solid var(--o-color-control3);
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-fill1);
  color: var(--o-color-info1);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  cursor: pointer;

  &.active {
    border-color: var(--o-color-primary1);
    background-color: var(--o-color-primary1-light);
    color: var(--o-color-primary1);
  }
}

.demo-popup-resize-readout {
  padding: 2px 8px;
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-fill2);
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}

.demo-popup-resize-card {
  padding: 16px;
}

.demo-popup-resize-title {
  margin-bottom: 12px;
  color: var(--o-color-info1);
  font-size: var(--o-font_size-text1);
  font-weight: 600;
  line-height: var(--o-line_height-text1);
}

.demo-popup-resize-stars {
  display: flex;
  gap: 4px;

  span {
    font-size: 20px;
    line-height: 1;
    color: var(--o-color-control4);
    cursor: pointer;

    &.active {
      color: var(--o-color-warning1);
    }
  }
}

.demo-popup-resize-note {
  margin-top: 12px;
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}
</style>
