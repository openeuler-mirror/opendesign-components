<docs lang="md">
<!-- zh-CN -->

### 定位源矩形 targetRect ^[1.2.7-sp1](primary)

`targetRect` 接收视口坐标系下的矩形快照（结构兼容 `DOMRect`）作为弹层定位源，优先级高于 `target` 属性与 `#target` 插槽，适用于没有真实触发元素、定位目标由外部数据描述的场景（如 OTour 的高亮步骤）。

数据模式下组件不持有交互元素：`trigger` 需设为 `none`，显隐通过 `v-model:visible` 受控；滚动、缩放的跟随由调用方负责——更新 `targetRect` 即可触发重新定位。本例用 `useElementBounding` 实时换算舞台的视口位置，页面滚动时弹层会持续跟随虚线矩形。

拖动虚线矩形，观察弹层位置与坐标读数的实时变化。

<!-- en-US -->

### Target Rect ^[1.2.7-sp1](primary)

`targetRect` accepts a rect snapshot in viewport coordinates (DOMRect-compatible) as the positioning source of the popup. It takes priority over the `target` prop and the `#target` slot, and fits scenarios where no real trigger element exists and the positioning target is described by external data (e.g. highlighted steps of OTour).

In data mode the component holds no interactive element: set `trigger` to `none` and control visibility via `v-model:visible`. Following scroll and zoom is the caller's responsibility — updating `targetRect` triggers repositioning. This demo converts the stage's viewport position with `useElementBounding`, so the popup keeps following the dashed rect while the page scrolls.

Drag the dashed rect to see how the popup and the coordinate readout update in real time.
</docs>
<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { OPopup, OSwitch } from '@opensig/opendesign';
import type { TargetRect } from '@opensig/opendesign';

// 舞台元素：定位矩形的参照容器，视口位置由 useElementBounding 实时测量
const stageRef = ref<HTMLElement | null>(null);
const { left: stageLeft, top: stageTop } = useElementBounding(stageRef);

// 定位矩形数据（舞台相对坐标）：拖拽只修改这份状态
const box = reactive({ left: 120, top: 60, width: 144, height: 64 });
// 数据模式下无交互元素，显隐完全受控
const visible = ref(true);

/**
 * @description 定位源矩形：舞台相对坐标叠加舞台视口原点，换算为视口坐标系快照。
 * useElementBounding 随滚动 / 窗口尺寸自动更新，体现"跟随由调用方负责"的契约
 */
const targetRect = computed<TargetRect | null>(() => {
  if (!stageRef.value) {
    return null;
  }
  return {
    left: stageLeft.value + box.left,
    top: stageTop.value + box.top,
    width: box.width,
    height: box.height,
  };
});

/** 虚线矩形的内联样式：在舞台内绝对定位 */
const boxStyle = computed(() => ({
  left: `${box.left}px`,
  top: `${box.top}px`,
  width: `${box.width}px`,
  height: `${box.height}px`,
}));

/** 坐标读数：展示当前传给 OPopup 的视口坐标快照 */
const rectText = computed(() => {
  const r = targetRect.value;
  return r ? `{ left: ${Math.round(r.left)}, top: ${Math.round(r.top)}, width: ${r.width}, height: ${r.height} }` : 'null';
});

// 拖拽监听清理函数：拖拽结束或组件卸载时调用，防止 window 监听泄漏
let stopDrag: (() => void) | null = null;
onUnmounted(() => stopDrag?.());

/**
 * @description 拖拽虚线矩形：以指针落点为原点增量更新舞台相对坐标，并夹取在舞台范围内
 * @param e - 虚线矩形上的 pointerdown 事件
 */
const onBoxPointerDown = (e: PointerEvent) => {
  const stage = stageRef.value;
  if (!stage) {
    return;
  }
  e.preventDefault();
  const { clientX: startX, clientY: startY } = e;
  const originLeft = box.left;
  const originTop = box.top;
  const maxLeft = stage.clientWidth - box.width;
  const maxTop = stage.clientHeight - box.height;
  /** 将舞台相对坐标夹取在 [0, max] 区间 */
  const clamp = (val: number, max: number) => Math.min(Math.max(val, 0), max);

  const onMove = (ev: PointerEvent) => {
    box.left = clamp(originLeft + ev.clientX - startX, maxLeft);
    box.top = clamp(originTop + ev.clientY - startY, maxTop);
  };
  const onUp = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    stopDrag = null;
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  stopDrag = onUp;
};
</script>
<template>
  <div class="demo-popup-rect">
    <div ref="stageRef" class="demo-popup-stage">
      <div class="demo-popup-box" :style="boxStyle" @pointerdown="onBoxPointerDown">
        <span class="demo-popup-box-label">TargetRect</span>
      </div>
      <OPopup v-model:visible="visible" trigger="none" :target-rect="targetRect" position="bottom" :offset="8" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">
          <div>定位源是外部数据，而非触发元素。</div>
          <div>{{ rectText }}</div>
        </div>
      </OPopup>
    </div>
    <div class="demo-popup-toolbar">
      <label class="demo-popup-switch">
        <OSwitch v-model="visible" size="small" />
        <span>弹层显隐（trigger="none"，受控）</span>
      </label>
      <code class="demo-popup-readout">targetRect = {{ rectText }}</code>
    </div>
  </div>
</template>
<style lang="scss">
// 弹层内容 Teleport 到 body，需通过 wrapClass 提供非 scoped 的外观定制
.demo-popup-case {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-bd: 1px solid var(--o-color-control4);
  --popup-padding: 8px 12px;

  color: var(--o-color-info1);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}
</style>
<style lang="scss" scoped>
.demo-popup-stage {
  position: relative;
  height: 280px;
  border: 1px dashed var(--o-color-control4);
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-fill1);
}

.demo-popup-box {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--o-color-primary1);
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-primary1-light);
  cursor: move;
  // 拖拽时屏蔽触摸滚动，保证 pointermove 连续触发
  touch-action: none;
  user-select: none;
}

.demo-popup-box-label {
  color: var(--o-color-primary1);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}

.demo-popup-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin-top: 12px;
}

.demo-popup-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--o-color-info1);
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
}

.demo-popup-readout {
  padding: 2px 8px;
  border-radius: var(--o-radius_control-s);
  background-color: var(--o-color-fill2);
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}
</style>
