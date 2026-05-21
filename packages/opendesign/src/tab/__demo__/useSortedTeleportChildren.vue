<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTab, OTabPane } from '../index';

type PaneItem = { id: number; label: string; content: string };

/** 测试1：基本排序 — 模板书写顺序即为显示顺序 */
const basicList = reactive<PaneItem[]>([
  { id: 3, label: 'Pane C', content: '第三个定义' },
  { id: 1, label: 'Pane A', content: '第一个定义' },
  { id: 2, label: 'Pane B', content: '第二个定义' },
]);
const basicActive = ref(1);
const basicLog = ref<string[]>([]);
const onBasicChange = (val: string | number, oldVal?: string | number) => {
  basicLog.value.push(`${oldVal ?? '-'} → ${val}`);
};

/** 测试2：动态新增 — addChild 后将新 uid 追加到 sortedChildren 末尾 */
const dynList = reactive<PaneItem[]>([
  { id: 1, label: 'Pane 1', content: 'Content 1' },
  { id: 2, label: 'Pane 2', content: 'Content 2' },
]);
const dynActive = ref(1);
const dynLog = ref<string[]>([]);
let dynIdSeq = 3;
const dynAdd = () => {
  const id = dynIdSeq++;
  dynList.push({ id, label: `Pane ${id}`, content: `Content ${id}` });
  dynLog.value.push(`➕ 新增 Pane ${id}`);
};
const dynDelete = (v: string | number) => {
  const idx = dynList.findIndex((item) => item.id === v);
  if (idx > -1) {
    dynLog.value.push(`➖ 删除 Pane ${v}`);
    dynList.splice(idx, 1);
  }
};

/** 测试3：全部删除后再新增 — delete children[key] 后重新 addChild */
const cycleList = reactive<PaneItem[]>([
  { id: 1, label: 'Pane 1', content: '1' },
  { id: 2, label: 'Pane 2', content: '2' },
]);
const cycleActive = ref(1);
const cycleLog = ref<string[]>([]);
const cycleDelete = (v: string | number) => {
  const idx = cycleList.findIndex((item) => item.id === v);
  if (idx > -1) {
    cycleList.splice(idx, 1);
    cycleLog.value.push(`删除: ${v}, 剩余: ${cycleList.map((item) => item.id).join(',') || '(空)'}`);
  }
};
let cycleIdSeq = 3;
const cycleAdd = () => {
  const id = cycleIdSeq++;
  cycleList.push({ id, label: `Pane ${id}`, content: `${id}` });
  cycleLog.value.push(`新增: ${id}`);
};
const resetCycle = () => {
  cycleList.splice(0, cycleList.length, { id: 1, label: 'Pane 1', content: '1' }, { id: 2, label: 'Pane 2', content: '2' });
  cycleActive.value = 1;
  cycleIdSeq = 3;
  cycleLog.value.push('🔄 重置');
};

/** 测试4：禁用 + 删除 混合 */
const mixList = reactive<PaneItem[]>([
  { id: 1, label: 'Normal', content: '正常页签' },
  { id: 2, label: 'Closable', content: '可关闭' },
  { id: 3, label: 'Disabled', content: '已禁用' },
]);
const mixActive = ref(1);
const mixLog = ref<string[]>([]);
const mixDelete = (v: string | number) => {
  const idx = mixList.findIndex((item) => item.id === v);
  if (idx > -1) {
    mixList.splice(idx, 1);
    mixLog.value.push(`删除: ${v}`);
  }
};

/** 测试5：打乱数组顺序 — v-for 顺序变化后 flatComponentVNode 重新遍历 VNode 树 */
const shuffleList = reactive<PaneItem[]>([
  { id: 1, label: 'A', content: 'Item A' },
  { id: 2, label: 'B', content: 'Item B' },
  { id: 3, label: 'C', content: 'Item C' },
  { id: 4, label: 'D', content: 'Item D' },
  { id: 5, label: 'E', content: 'Item E' },
]);
const shuffleActive = ref(1);
const shuffleLog = ref<string[]>([]);
const getOrderStr = () => shuffleList.map((item) => item.label).join(' → ');

const onShuffle = () => {
  const prev = getOrderStr();
  for (let i = shuffleList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffleList[i], shuffleList[j]] = [shuffleList[j], shuffleList[i]];
  }
  shuffleLog.value.push(`🔀 打乱: ${prev}  →  ${getOrderStr()}`);
};

const onShuffleReset = () => {
  const prev = getOrderStr();
  shuffleList.splice(
    0,
    shuffleList.length,
    { id: 1, label: 'A', content: 'Item A' },
    { id: 2, label: 'B', content: 'Item B' },
    { id: 3, label: 'C', content: 'Item C' },
    { id: 4, label: 'D', content: 'Item D' },
    { id: 5, label: 'E', content: 'Item E' },
  );
  shuffleLog.value.push(`↩️ 还原: ${prev}  →  ${getOrderStr()}`);
};
</script>
<template>
  <h4>useSortedTeleportChildren 验证：基本排序</h4>
  <p>Pane 定义顺序为 C→A→B（id=3,1,2），useSortedTeleportChildren 应保持模板书写顺序，导航显示为 C, A, B</p>
  <div class="sec">
    <OTab v-model="basicActive" @change="onBasicChange">
      <OTabPane v-for="item in basicList" :key="item.id" :value="item.id" :label="item.label" class="pane">
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in basicLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>useSortedTeleportChildren 验证：动态新增/删除</h4>
  <p>通过 addChild 注册新的 OTabPane，验证 sortedChildren 实时更新。点击关闭删除后，剩余页签保持模板顺序</p>
  <div class="sec">
    <div class="actions">
      <button class="btn" @click="dynAdd">➕ 新增页签</button>
    </div>
    <OTab v-model="dynActive" addable @add="dynAdd" @delete="dynDelete">
      <OTabPane v-for="(item, idx) in dynList" :key="item.id" :value="item.id" :label="item.label" :closable="idx > 0" class="pane">
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in dynLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>useSortedTeleportChildren 验证：全删再增（children[uid] 的 delete 与重新 addChild）</h4>
  <p>将所有页签删除后，children 对象被清空，再新增页签应重新注册到 childMap 并正确排序</p>
  <div class="sec">
    <div class="actions">
      <button class="btn" @click="cycleAdd">➕ 新增</button>
      <button class="btn" @click="resetCycle">🔄 重置</button>
    </div>
    <OTab v-model="cycleActive" @delete="cycleDelete">
      <OTabPane v-for="item in cycleList" :key="item.id" :value="item.id" :label="item.label" closable class="pane">
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="empty-hint" v-if="cycleList.length === 0">所有页签已删除，点击"新增"添加</div>
    <div class="log">
      <p v-for="(log, i) in cycleLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>useSortedTeleportChildren 验证：禁用 + 删除 混合</h4>
  <p>验证 childMap[uid].props.disabled 和 childMap[uid].props.closable 在排序后依然可正确访问</p>
  <div class="sec">
    <OTab @delete="mixDelete">
      <OTabPane
        v-for="item in mixList"
        :key="item.id"
        :value="item.id"
        :label="item.label"
        :closable="item.label === 'Closable'"
        :disabled="item.label === 'Disabled'"
        class="pane"
      >
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in mixLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>useSortedTeleportChildren 验证：打乱数组顺序</h4>
  <p>通过 Fisher-Yates 算法随机打乱 tabList 数组，v-for 按新数组顺序渲染 VNode，flatComponentVNode 重新遍历后 sortedChildren 应跟随 VNode 顺序变化</p>
  <div class="sec">
    <div class="actions">
      <button class="btn" @click="onShuffle">🔀 打乱顺序</button>
      <button class="btn" @click="onShuffleReset">↩️ 还原顺序</button>
      <span class="order-hint">当前数组: {{ getOrderStr() }}</span>
    </div>
    <OTab v-model="shuffleActive">
      <OTabPane v-for="item in shuffleList" :key="item.id" :value="item.id" :label="item.label" class="pane">
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in shuffleLog" :key="i">{{ log }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sec {
  border: 1px solid #eee;
  padding: 24px;
  margin-bottom: 24px;
}
.pane {
  padding: 36px;
  background-color: #fff;
}
.log {
  margin-top: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 13px;
  max-height: 180px;
  overflow-y: auto;
}
.log p {
  margin: 2px 0;
  font-family: monospace;
}
.actions {
  margin-bottom: 10px;
}
.btn {
  margin-right: 8px;
  margin-bottom: 6px;
  padding: 4px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.btn:hover {
  background: #f0f0f0;
}
.order-hint {
  font-size: 13px;
  color: #666;
  font-family: monospace;
}
.empty-hint {
  margin-top: 10px;
  padding: 20px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>
