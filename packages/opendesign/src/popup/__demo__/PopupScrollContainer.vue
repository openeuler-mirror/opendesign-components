<script setup lang="ts">
/**
 * @description Popup 监听滚动事件重定位行为的测试 demo
 *
 * 用于验证以下修复点：
 * 1. targetEl 异步切换时能正确监听其父级滚动容器的 scroll 事件
 * 2. 弹层能够监听 window 对象的 scroll 事件，确保跨容器滚动时位置正确更新
 *
 * 操作方式：
 * - 点击「toggle」按钮显示 popup
 * - 滚动「parent scroll」容器，验证 popup 跟随 target 位置调整
 * - 滚动「window」长内容，验证 popup 跟随 window 滚动调整
 */
import { onMounted, ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';

const case1Visible = ref(false);
const case2Visible = ref(false);
const case3Visible = ref(false);

const target1 = ref<HTMLElement | null>(null);
const target2 = ref<HTMLElement | null>(null);
const target3 = ref<HTMLElement | null>(null);

const case1Key = ref(0);
const case2Key = ref(0);
const case3Key = ref(0);

const innerBtn1 = ref<HTMLElement | null>(null);
const outerBtn1 = ref<HTMLElement | null>(null);
const innerBtn2 = ref<HTMLElement | null>(null);
const outerBtn2 = ref<HTMLElement | null>(null);
const innerBtn3 = ref<HTMLElement | null>(null);
const outerBtn3 = ref<HTMLElement | null>(null);

const switchTarget1 = () => {
  target1.value = target1.value === innerBtn1.value ? outerBtn1.value : innerBtn1.value;
  case1Key.value += 1;
};
const switchTarget2 = () => {
  target2.value = target2.value === innerBtn2.value ? outerBtn2.value : innerBtn2.value;
  case2Key.value += 1;
};
const switchTarget3 = () => {
  target3.value = target3.value === innerBtn3.value ? outerBtn3.value : innerBtn3.value;
  case3Key.value += 1;
};

// 初始化时将 target 设置为内层按钮，确保初始 popup 可正常显示
onMounted(() => {
  target1.value = innerBtn1.value;
  target2.value = innerBtn2.value;
  target3.value = innerBtn3.value;
});
</script>
<template>
  <h4>popup scroll container & window scroll repositioning</h4>

  <section class="test-section">
    <h5>case 1: target 异步切换后父级容器滚动应能触发重定位</h5>
    <p class="hint">点击两个按钮切换 popup 的 target，target 变化后父容器滚动 popup 应跟随重定位</p>
    <div class="outer-scroll">
      <div class="scroll-filler">向下滚动</div>
      <div class="scroll-filler">向下滚动</div>
      <div class="inner-row">
        <OButton ref="innerBtn1" class="btn" @click="switchTarget1">内 target (异步切换)</OButton>
        <OButton ref="outerBtn1" class="btn" @click="switchTarget1">外 target (异步切换)</OButton>
      </div>
      <OPopup v-model:visible="case1Visible" position="bottom" trigger="click" :target="target1">
        <div class="popup-box">{{ content }} (target key: {{ case1Key }})</div>
      </OPopup>
      <div class="scroll-filler">向下滚动</div>
      <div class="scroll-filler">向下滚动</div>
      <div class="scroll-filler">向下滚动</div>
      <div class="scroll-filler">向下滚动</div>
    </div>
    <div class="row">
      <OButton class="btn" @click="case1Visible = !case1Visible">toggle popup (case 1)</OButton>
      <span>visible: {{ case1Visible }}</span>
    </div>
  </section>

  <section class="test-section">
    <h5>case 2: 父容器 + window 同时滚动，popup 应能在两个维度跟随重定位</h5>
    <p class="hint">父容器内的 target 在外层 window 滚动时，popup 位置应同步更新</p>
    <div class="outer-scroll">
      <div class="scroll-filler">滚动此处</div>
      <div class="scroll-filler">滚动此处</div>
      <div class="inner-row">
        <OButton ref="innerBtn2" class="btn" @click="switchTarget2">内 target</OButton>
        <OButton ref="outerBtn2" class="btn" @click="switchTarget2">外 target</OButton>
      </div>
      <OPopup v-model:visible="case2Visible" position="bottom" trigger="click" :target="target2">
        <div class="popup-box">{{ content }} (target key: {{ case2Key }})</div>
      </OPopup>
      <div class="scroll-filler">滚动此处</div>
      <div class="scroll-filler">滚动此处</div>
    </div>
    <div class="row">
      <OButton class="btn" @click="case2Visible = !case2Visible">toggle popup (case 2)</OButton>
      <span>visible: {{ case2Visible }}</span>
    </div>
  </section>

  <section class="test-section">
    <h5>case 3: window 滚动时 popup 应能跟随重定位</h5>
    <p class="hint">滚动整个页面 (window 滚动)，popup 位置应随 target 同步更新</p>
    <div class="inner-row">
      <OButton ref="innerBtn3" class="btn" @click="switchTarget3">内 target</OButton>
      <OButton ref="outerBtn3" class="btn" @click="switchTarget3">外 target</OButton>
    </div>
    <OPopup v-model:visible="case3Visible" position="bottom" trigger="click" :target="target3">
      <div class="popup-box">{{ content }} (target key: {{ case3Key }})</div>
    </OPopup>
    <div class="row">
      <OButton class="btn" @click="case3Visible = !case3Visible">toggle popup (case 3)</OButton>
      <span>visible: {{ case3Visible }}</span>
    </div>
    <div class="scroll-filler window-filler">向下滚动 window</div>
    <div class="scroll-filler window-filler">向下滚动 window</div>
    <div class="scroll-filler window-filler">向下滚动 window</div>
    <div class="scroll-filler window-filler">向下滚动 window</div>
  </section>
</template>
<style lang="scss" scoped>
.test-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--o-color-line1);
  border-radius: var(--o-radius_control-s);
  margin-bottom: 16px;
}
h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.hint {
  margin: 0;
  font-size: 12px;
  color: var(--o-color-info2);
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.outer-scroll {
  height: 240px;
  overflow: auto;
  border: 1px dashed var(--o-color-info2);
  background-color: var(--o-color-fill2);
  padding: 8px;
}
.scroll-filler {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--o-color-fill1);
  margin-bottom: 8px;
  border-radius: var(--o-radius_control-xs);
}
.window-filler {
  background-color: var(--o-color-warning1);
  color: var(--o-color-warning1-inverse);
}
.inner-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background-color: var(--o-color-fill1);
}
</style>
