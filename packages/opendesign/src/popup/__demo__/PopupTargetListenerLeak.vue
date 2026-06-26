<script setup lang="ts">
/**
 * @description 验证 OPopup 在 target 切换时不会泄漏旧 target 上的 trigger 监听器
 *
 * 修复点：OPopup 内的 `bindTargetEvent` 在入口先调用 `removeTriggerListener()`，
 * 解除旧 targetEl 上累积的 click 监听器，避免切换 target 时旧 DOM 上的监听器泄漏。
 *
 * 测试方式：
 *   - 「show popup」按钮通过 v-model:visible 显示 popup
 *   - 「switch to A / B」在 A、B 两个按钮间反复切换 target
 *   - 切换若干次后点击 A 按钮 / B 按钮（注意：不是切换按钮），观察 popup 是否被触发
 *   - 修复前：旧 target 上的 click 监听器累积，无论点 A 还是点 B 都会切换 visible
 *   - 修复后：仅当前 target 上的 click 监听器有效，切换 target 后旧 target 点击不会触发 popup
 */
import { nextTick, ref, watch } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'target switch listener leak demo';

const targetA = ref<HTMLButtonElement | null>(null);
const targetB = ref<HTMLButtonElement | null>(null);
const target = ref<HTMLButtonElement | null>(null);
const visible = ref(false);

const targetSwitchCount = ref(0);
const currentTarget = ref<'A' | 'B' | 'none'>('none');
const eventLog = ref<string[]>([]);

const switchToA = () => {
  target.value = targetA.value;
  currentTarget.value = 'A';
  targetSwitchCount.value += 1;
  eventLog.value.push(`switch -> A (switch #${targetSwitchCount.value})`);
};

const switchToB = () => {
  target.value = targetB.value;
  currentTarget.value = 'B';
  targetSwitchCount.value += 1;
  eventLog.value.push(`switch -> B (switch #${targetSwitchCount.value})`);
};

const handleUpdateVisible = (val: boolean) => {
  eventLog.value.push(`update:visible -> ${val}`);
};

const reset = () => {
  targetSwitchCount.value = 0;
  currentTarget.value = 'none';
  target.value = null;
  visible.value = false;
  eventLog.value = [];
};

/** 事件日志容器引用，用于自动滚动到底部 */
const logRef = ref<HTMLDivElement | null>(null);

/** 日志追加后自动滚动到容器底部，便于查看最新事件 */
watch(
  eventLog,
  () => {
    nextTick(() => {
      const el = logRef.value;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  },
  { flush: 'post', deep: true },
);
</script>

<template>
  <h4>popup target switch listener leak</h4>
  <section class="test-section">
    <div class="row">
      current target: <b>{{ currentTarget }}</b> | switch count: <b>{{ targetSwitchCount }}</b>
    </div>
    <div class="row">
      <OButton class="btn" @click="visible = !visible">show / hide popup</OButton>
      <OButton class="btn" @click="switchToA">switch target → A</OButton>
      <OButton class="btn" @click="switchToB">switch target → B</OButton>
      <OButton class="btn" @click="reset">重置</OButton>
    </div>
    <div class="hint">
      操作步骤：<br />
      1. 点击「switch target → A」几次，<br />
      2. 再点击「switch target → B」几次，<br />
      3. 反复「switch target → A / B」多次，<br />
      4. 在按钮 A / B 本身 (非切换按钮) 上点击，<br />
      期望：仅当前 target 按钮的点击能触发 popup 显隐；旧 target 按钮无响应。<br />
      进阶验证：使用 Chrome DevTools → Performance Monitor / Memory 反复切换 target，修复前每次切回旧 target 仍会触发 click 处理函数 (可观察 update:visible
      事件日志变化)，修复后仅当前 target 触发。
    </div>
    <div class="row">
      <button ref="targetA" class="btn target-btn">A (旧 target 验证)</button>
      <button ref="targetB" class="btn target-btn">B (当前 target 验证)</button>
      <OPopup v-model:visible="visible" position="bottom" trigger="click" :target="target" @update:visible="handleUpdateVisible">
        <div class="popup-box">{{ content }}</div>
      </OPopup>
    </div>
    <div class="log" ref="logRef">
      <div class="log-title">事件日志</div>
      <ul>
        <li v-for="(item, i) in eventLog" :key="`leak-${i}`">{{ item }}</li>
        <li v-if="eventLog.length === 0" class="empty">无</li>
      </ul>
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
.target-btn {
  min-width: 200px;
  padding: 4px 16px;
  border: 1px solid var(--o-color-line2);
  background-color: var(--o-color-fill2);
  color: var(--o-color-info1);
  border-radius: var(--o-radius_control-s);
  cursor: pointer;
  font: inherit;
}
.hint {
  font-size: 12px;
  color: var(--o-color-info2);
  background-color: var(--o-color-fill1);
  padding: 6px 10px;
  border-radius: var(--o-radius_control-xs);
  line-height: 1.6;
}
.log {
  background-color: var(--o-color-fill2);
  padding: 8px 12px;
  border-radius: var(--o-radius_control-xs);
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}
.log-title {
  font-weight: 600;
  margin-bottom: 4px;
}
.log ul {
  margin: 0;
  padding-left: 20px;
}
.empty {
  color: var(--o-color-info2);
  list-style: none;
  margin-left: -20px;
}
</style>
