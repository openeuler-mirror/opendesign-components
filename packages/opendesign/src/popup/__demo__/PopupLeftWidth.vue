<script setup lang="ts">
/**
 * @description 使用 position="left" 时 popup 宽度死循环问题的测试 demo
 *
 * 用于验证以下修复点：
 * 使用 left 定位 popup 时，popup 宽度不会因为 100vw - left 计算而不断变化，
 * 进而避免宽度变化再次触发 left 计算的死循环。
 *
 * 操作方式：连续点击 trigger 按钮多次，popup 宽度应保持稳定（不会无限缩小/放大）。
 */
import { onUnmounted, ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content this is popup content this is popup content this is popup content this is popup content';
const btn = ref(null);
const visible = ref(false);
const popupWidthHistory = ref<number[]>([]);
let observer: ResizeObserver | null = null;

/**
 * popup 内部内容 ref 挂载回调：建立 ResizeObserver 监听宽度变化，
 * 用于验证宽度是否持续变化（死循环）或保持稳定
 */
const onPopupBoxMounted = (el: unknown) => {
  observer?.disconnect();
  if (!(el instanceof HTMLElement)) return;
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) {
        const list = popupWidthHistory.value;
        if (list[list.length - 1] !== w) {
          list.push(w);
          if (list.length > 30) list.shift();
        }
      }
    }
  });
  observer.observe(el);
};

onUnmounted(() => observer?.disconnect());

const toggle = () => {
  visible.value = !visible.value;
};

const reset = () => {
  popupWidthHistory.value = [];
};
</script>
<template>
  <h4>popup left position width loop</h4>
  <section class="test-section">
    <div class="row">visible: {{ visible }}</div>
    <div class="row">
      <OButton ref="btn" class="btn" @click="toggle">切换 popup (验证宽度稳定)</OButton>
      <OButton class="btn" @click="reset">清空记录</OButton>
    </div>
    <div class="row">
      <OPopup v-model:visible="visible" position="left" trigger="none" :target="btn">
        <div :ref="(el) => onPopupBoxMounted(el)" class="popup-box" style="height: 120px">
          {{ content }}
        </div>
      </OPopup>
    </div>
    <div class="log">
      <div class="log-title">popup 宽度变化记录 (期望：宽度稳定，不会持续变化)</div>
      <div class="width-list">
        <span v-for="(w, i) in popupWidthHistory" :key="i" class="width-chip">[{{ i + 1 }}] {{ w }}px</span>
        <span v-if="popupWidthHistory.length === 0" class="empty">无</span>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.test-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--o-color-line1);
  border-radius: var(--o-radius_control-s);
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.log {
  background-color: var(--o-color-fill2);
  padding: 8px 12px;
  border-radius: var(--o-radius_control-xs);
  font-size: 12px;
}
.log-title {
  font-weight: 600;
  margin-bottom: 6px;
}
.width-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.width-chip {
  padding: 2px 6px;
  background-color: var(--o-color-info1);
  color: var(--o-color-info1-inverse);
  border-radius: 4px;
  font-family: monospace;
}
.empty {
  color: var(--o-color-info2);
}
</style>
