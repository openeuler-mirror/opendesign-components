<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTab, OTabPane } from '../index';

/** 测试1：number 类型 paneKey（重构前依赖 .toString() 桥接） */
const numActive = ref(1);
const numChangeLog = ref<string[]>([]);
const onNumChange = (val: string | number, oldVal?: string | number) => {
  numChangeLog.value.push(`${oldVal ?? 'undefined'} → ${val} (type: ${typeof val})`);
};

/** 测试2：外部改变 modelValue（验证 paneKeyToUid 反向索引） */
const extActive = ref('A');
const extChangeLog = ref<string[]>([]);
const onExtChange = (val: string | number, oldVal?: string | number) => {
  extChangeLog.value.push(`${oldVal ?? 'undefined'} → ${val} (type: ${typeof val})`);
};
const switchExternally = () => {
  const options = ['A', 'B', 'C', 'D'];
  const currentIndex = options.indexOf(extActive.value);
  extActive.value = options[(currentIndex + 1) % options.length];
};

/** 测试3：closable + addable 组合（验证 uid 驱动的 onDeletePane / addChild） */
const dynamicList = reactive(
  new Array(4).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `Tab ${idx + 1}`,
    content: `Content ${idx + 1}`,
  })),
);
const dynamicActive = ref(1);
const deleteLog = ref<string[]>([]);
const addLog = ref<string[]>([]);
const onDynamicChange = (val: string | number, oldVal?: string | number) => {
  console.log(`dynamic change: ${oldVal} → ${val}`);
};
const onDelete = (val: string | number) => {
  deleteLog.value.push(`delete: ${val} (type: ${typeof val})`);
  const idx = dynamicList.findIndex((item) => item.id === val);
  if (idx > -1) {
    dynamicList.splice(idx, 1);
  }
};
const onAdd = () => {
  const newId = Math.max(...dynamicList.map((item) => item.id as number), 0) + 1;
  addLog.value.push(`add: ${newId} (type: ${typeof newId})`);
  dynamicList.push({
    id: newId,
    label: `Tab ${newId}`,
    content: `Content ${newId}`,
  });
};

/** 测试4：nav 插槽渲染（验证 childMap[uid].navRenderer） */
const slotChangeLog = ref<string[]>([]);
const onSlotChange = (val: string | number, oldVal?: string | number) => {
  slotChangeLog.value.push(`${oldVal ?? 'undefined'} → ${val} (type: ${typeof val})`);
};

/** 测试4 辅助：closable 列表，父级通过 splice 响应 delete 事件 */
interface SlotPaneItem {
  id: number;
  label: string;
  nav?: string;
  closable: boolean;
  disabled: boolean;
}
const slotPaneList = reactive<SlotPaneItem[]>([
  { id: 1, label: 'Normal', closable: false, disabled: false },
  { id: 2, label: 'Closable', nav: '🔒 可关闭', closable: true, disabled: false },
  { id: 3, label: 'Disabled', nav: '🚫 已禁用', closable: false, disabled: true },
  { id: 4, label: 'Closable+Disabled', nav: '⚠️ 关闭+禁用', closable: true, disabled: true },
]);
const onSlotDelete = (val: string | number) => {
  const idx = slotPaneList.findIndex((item) => item.id === val);
  if (idx > -1) {
    slotPaneList.splice(idx, 1);
  }
};
</script>
<template>
  <h4>重构验证：Number paneKey</h4>
  <p>使用 number 作为 value，验证不再依赖 .toString() 桥接，change 事件保持 number 类型</p>
  <div class="sec">
    <OTab v-model="numActive" @change="onNumChange">
      <OTabPane :value="1" label="Tab 1" class="pane">Pane 1</OTabPane>
      <OTabPane :value="2" label="Tab 2" class="pane">Pane 2</OTabPane>
      <OTabPane :value="3" label="Tab 3" class="pane">Pane 3</OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in numChangeLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>重构验证：外部改变 modelValue（paneKeyToUid 反向索引）</h4>
  <p>通过按钮从外部改变 v-model，验证 paneKeyToUid 能正确将 paneKey 映射到 uid，change 事件保持原始类型</p>
  <div class="sec">
    <button class="btn" @click="switchExternally">切换到下一个 (当前: {{ extActive }})</button>
    <OTab v-model="extActive" @change="onExtChange">
      <OTabPane value="A" label="Tab A" class="pane">Pane A</OTabPane>
      <OTabPane value="B" label="Tab B" class="pane">Pane B</OTabPane>
      <OTabPane value="C" label="Tab C" class="pane">Pane C</OTabPane>
      <OTabPane value="D" label="Tab D" class="pane">Pane D</OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in extChangeLog" :key="i">{{ log }}</p>
    </div>
  </div>

  <h4>重构验证：Closable + Addable（uid 驱动的删除/新增）</h4>
  <p>动态新增和删除页签，验证 uid 索引下的 onDeletePane 和 addChild 逻辑</p>
  <div class="sec">
    <OTab v-model="dynamicActive" addable @change="onDynamicChange" @add="onAdd" @delete="onDelete">
      <OTabPane v-for="(item, idx) in dynamicList" :key="item.id" :value="item.id" :label="item.label" :closable="idx > 1" class="pane">
        {{ item.content }}
      </OTabPane>
    </OTab>
    <div class="log">
      <p><strong>新增日志:</strong></p>
      <p v-for="(log, i) in addLog" :key="'a' + i">{{ log }}</p>
      <p><strong>删除日志:</strong></p>
      <p v-for="(log, i) in deleteLog" :key="'d' + i">{{ log }}</p>
    </div>
  </div>

  <h4>重构验证：Nav 插槽 + Closable + Disabled（childMap 属性访问）</h4>
  <p>覆盖 nav 插槽渲染、closable、disabled 等属性，验证 childMap[uid].xxx 访问路径。删除由父级通过 splice 响应</p>
  <div class="sec">
    <OTab @change="onSlotChange" @delete="onSlotDelete">
      <OTabPane
        v-for="item in slotPaneList"
        :key="item.id"
        :value="item.id"
        :label="item.label"
        :closable="item.closable"
        :disabled="item.disabled"
        class="pane"
      >
        <template v-if="item.nav" #nav>{{ item.nav }}</template>
        {{ item.label }} 内容
      </OTabPane>
    </OTab>
    <div class="log">
      <p v-for="(log, i) in slotChangeLog" :key="i">{{ log }}</p>
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
  max-height: 200px;
  overflow-y: auto;
}
.log p {
  margin: 2px 0;
  font-family: monospace;
}
.btn {
  margin-bottom: 12px;
  padding: 6px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.btn:hover {
  background: #f0f0f0;
}
</style>
