<script setup lang="ts">
/**
 * @description Popup 外部修改 prop.visible 行为的测试 demo
 *
 * 用于验证以下修复点：
 * 1. 外部修改 prop.visible 不会再触发两次 beforeShow / beforeHide（修复前会调用两次）
 * 2. 外部修改 prop.visible 不会再触发冗余的 update:visible / change 事件（修复前每次变化都会触发）
 *
 * 测试方法：
 * - 外部点击「外部切换 visible」按钮改变 visible 状态
 * - 检查 beforeShow / beforeHide 调用次数：每次外部变化应只增加 1 次（任一）
 * - 检查 update:visible / change 事件日志：外部修改应不产生新日志
 * - 点击「点击触发」按钮弹出 popup，对比内部触发与外部触发的行为差异
 */
import { nextTick, ref, watch } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content this is popup content';

const targetBtn = ref(null);

const beforeShowCount = ref(0);
const beforeHideCount = ref(0);
const updateVisibleLog = ref<string[]>([]);
const changeLog = ref<string[]>([]);

const visible = ref(false);

/**
 * 每次 popup 显示前调用，记录调用次数用于验证外部修改 visible 时是否被多次调用
 */
const handleBeforeShow = (): boolean => {
  beforeShowCount.value += 1;
  return true;
};

/**
 * 每次 popup 隐藏前调用，记录调用次数用于验证外部修改 visible 时是否被多次调用
 */
const handleBeforeHide = (): boolean => {
  beforeHideCount.value += 1;
  return true;
};

/**
 * 监听 update:visible 事件，记录触发日志用于验证外部修改 visible 时不会冗余触发
 */
const handleUpdateVisible = (val: boolean) => {
  updateVisibleLog.value.push(`update:visible -> ${val} (${new Date().toLocaleTimeString()})`);
};

/**
 * 监听 change 事件，记录触发日志用于验证外部修改 visible 时不会冗余触发
 */
const handleChange = (val: boolean) => {
  changeLog.value.push(`change -> ${val} (${new Date().toLocaleTimeString()})`);
};

const toggleExternal = () => {
  visible.value = !visible.value;
};

const reset = () => {
  beforeShowCount.value = 0;
  beforeHideCount.value = 0;
  updateVisibleLog.value = [];
  changeLog.value = [];
};

/** 两个日志容器的引用，用于独立自动滚动到底部 */
const updateVisibleLogRef = ref<HTMLDivElement | null>(null);
const changeLogRef = ref<HTMLDivElement | null>(null);

/** 滚动指定 div 到底部 */
const scrollToBottom = (el: HTMLDivElement | null) => {
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};

/** 日志追加后自动滚动到容器底部，便于查看最新事件 */
watch(
  updateVisibleLog,
  () => {
    nextTick(() => scrollToBottom(updateVisibleLogRef.value));
  },
  { flush: 'post' },
);

watch(
  changeLog,
  () => {
    nextTick(() => scrollToBottom(changeLogRef.value));
  },
  { flush: 'post' },
);
</script>
<template>
  <h4>popup beforeToggle & event behavior</h4>
  <section class="test-section">
    <div class="row">visible: {{ visible }}</div>
    <div class="row">
      <OButton class="btn" @click="toggleExternal">外部切换 visible (修复验证)</OButton>
      <OButton class="btn" @click="reset">重置计数器</OButton>
    </div>
    <div class="row counters">
      <span
        >beforeShow / beforeHide 总调用次数：<b class="count">{{ beforeShowCount + beforeHideCount }}</b></span
      >
      <span class="sub">（beforeShow: {{ beforeShowCount }}, beforeHide: {{ beforeHideCount }}）</span>
    </div>
    <div class="hint">期望行为：每次外部切换 visible 总调用次数只 +1（修复前会 +2）</div>
    <div class="row">
      <OPopup
        v-model:visible="visible"
        position="bottom"
        trigger="click"
        :target="targetBtn"
        :before-show="handleBeforeShow"
        :before-hide="handleBeforeHide"
        @update:visible="handleUpdateVisible"
        @change="handleChange"
      >
        <div class="popup-box">{{ content }}</div>
      </OPopup>
      <OButton ref="targetBtn" class="btn">点击触发 (内部 trigger)</OButton>
    </div>
    <div class="log" ref="updateVisibleLogRef">
      <div class="log-title">update:visible 事件日志 (期望：仅点击「点击触发」内部 trigger 时输出)</div>
      <ul>
        <li v-for="(item, i) in updateVisibleLog" :key="`uv-${i}`">{{ item }}</li>
        <li v-if="updateVisibleLog.length === 0" class="empty">无</li>
      </ul>
    </div>
    <div class="log" ref="changeLogRef">
      <div class="log-title">change 事件日志 (期望：仅点击「点击触发」内部 trigger 时输出)</div>
      <ul>
        <li v-for="(item, i) in changeLog" :key="`c-${i}`">{{ item }}</li>
        <li v-if="changeLog.length === 0" class="empty">无</li>
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
.counters {
  font-size: 14px;
}
.sub {
  color: var(--o-color-info2);
  font-size: 12px;
}
.count {
  color: var(--o-color-danger1);
  font-weight: 600;
}
.hint {
  font-size: 12px;
  color: var(--o-color-info2);
  background-color: var(--o-color-fill1);
  padding: 6px 10px;
  border-radius: var(--o-radius_control-xs);
}
.log {
  background-color: var(--o-color-fill2);
  padding: 8px 12px;
  border-radius: var(--o-radius_control-xs);
  font-size: 12px;
  max-height: 140px;
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
