<script setup lang="ts">
/**
 * @description 验证 beforeToggle 异步回调与 setVisible 重入的竞态
 *
 * 修复点：OPopup 内 `setVisible` 通过 `visibleToggleId` 序号守卫，避免
 *   - 慢的 beforeShow 回调在后续 setVisible 之后才完成并错误地把 popup 显示出来
 *   - 慢的 beforeHide 回调在后续 setVisible 之后才完成并错误地把 popup 隐藏掉
 *
 * 测试方式：
 *   - 「快速切换 4 次」按钮以 30ms 间隔连续修改 visible (true→false→true→false)，
 *     让 beforeShow/beforeHide 异步回调 (200ms 延迟) 有充分机会与 setVisible 重入
 *   - 等待 400ms 后观察 visible 最终值、applyVisible 调用次数与 update:visible 事件日志
 *   - 修复后：4 次切换结束时 visible=false，update:visible 仅触发 1 次 (false)；
 *     apply 次数 = 1 (最后一次调用)，过期异步结果被 visibleToggleId 守卫丢弃
 *   - 修复前：apply 次数 ≥ 1 次，过期回调可能错误地翻转 visible
 */
import { nextTick, ref, watch } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'async beforeToggle race demo';

const visible = ref(false);
const applyCount = ref(0);
const eventLog = ref<string[]>([]);

let logId = 0;

const handleBeforeShow = (): Promise<boolean> => {
  const id = ++logId;
  eventLog.value.push(`[${id}] beforeShow pending...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      eventLog.value.push(`[${id}] beforeShow resolve(true)`);
      resolve(true);
    }, 200);
  });
};

const handleBeforeHide = (): Promise<boolean> => {
  const id = ++logId;
  eventLog.value.push(`[${id}] beforeHide pending...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      eventLog.value.push(`[${id}] beforeHide resolve(true)`);
      resolve(true);
    }, 200);
  });
};

const handleUpdateVisible = (val: boolean) => {
  applyCount.value += 1;
  eventLog.value.push(`update:visible -> ${val} (apply #${applyCount.value})`);
};

/**
 * 连续 4 次以 30ms 间隔修改 visible，让 4 次 setVisible 的 beforeToggle 异步回调
 * 产生重入。如果 visibleToggleId 守卫生效，4 次过期回调都被丢弃，仅最后一次
 * setVisible 走到 applyVisible。
 */
const fastToggle = () => {
  const sequence: boolean[] = [true, false, true, false];
  sequence.forEach((val, i) => {
    setTimeout(() => {
      visible.value = val;
    }, i * 30);
  });
};

const reset = () => {
  visible.value = false;
  applyCount.value = 0;
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
  <h4>popup async beforeToggle race</h4>
  <section class="test-section">
    <div class="row">visible: {{ visible }} | apply count: {{ applyCount }}</div>
    <div class="row">
      <OButton class="btn" @click="fastToggle">快速切换 4 次 (验证序号守卫)</OButton>
      <OButton class="btn" @click="reset">重置</OButton>
    </div>
    <div class="hint">
      期望：4 次快速切换后 visible 最终为 false 且 update:visible 仅触发 1 次 (false)。<br />
      修复前：过期异步回调可能错误地翻转 visible，apply 次数大于 1。
    </div>
    <div class="row">
      <OPopup
        v-model:visible="visible"
        position="bottom"
        trigger="none"
        :before-show="handleBeforeShow"
        :before-hide="handleBeforeHide"
        @update:visible="handleUpdateVisible"
      >
        <div class="popup-box">{{ content }}</div>
      </OPopup>
    </div>
    <div class="log" ref="logRef">
      <div class="log-title">事件日志</div>
      <ul>
        <li v-for="(item, i) in eventLog" :key="`race-${i}`">{{ item }}</li>
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
