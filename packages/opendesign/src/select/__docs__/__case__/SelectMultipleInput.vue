<docs lang="md">
  <!-- zh-CN -->

### 多选 Tag 状态下的搜索与创建 ^[NEXT](primary)

当 `multiple=true` 且已有选中项（渲染了 tag）时，展开下拉后会在 `filterable=true` 或 `allowCreate=true` 时出现内联搜索 input，支持搜索过滤与创建新值；两者均关闭时不渲染 input，避免无意义换行。

- **镜像撑宽**：input 宽度随输入内容自动增长，无需手动调整
- **最小 80px**：input 有最小宽度限值，保证足够的输入空间
- **自动聚焦**：展开下拉时 input 自动获得焦点；多选首次选中后焦点不丢失
- **干净收起**：关闭下拉时 input 从 DOM 移除，只保留 tag，无空行

  <!-- en-US -->

### Search & Create in Multiple Tag Mode ^[NEXT](primary)

When `multiple=true` and selected items exist (tags rendered), an inline search input appears on dropdown open, supporting search filtering and new value creation.

- **Auto-width**: input width grows with content via mirror span, no manual sizing needed
- **Min 80px**: input has a minimum width guarantee for sufficient typing space
- **Auto-focus**: input auto-focuses on dropdown open; focus is retained after first selection in multiple mode
- **Clean collapse**: input is removed from DOM on dropdown close, leaving only tags
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OSelect } from '@opensig/opendesign';

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
  { label: '芒果', value: 'mango' },
  { label: '草莓', value: 'strawberry' },
  { label: '蓝莓', value: 'blueberry' },
];

// 场景 1：多选 + 有选中项 + filterable（核心修复场景）
const filterableVal = ref<string[]>(['apple']);

// 场景 2：多选 + 有选中项 + allowCreate
const createVal = ref<string[]>(['apple']);

// 场景 3：多选 + 有选中项 + filterable=false（readonly input）
const nonFilterableVal = ref<string[]>(['banana', 'orange']);

// 场景 4：多选 + 有选中项 + maxTagCount='responsive'
const responsiveVal = ref<string[]>(['apple', 'banana', 'orange', 'grape', 'watermelon']);

// 场景 5：从空开始多选（验证首次选中后焦点不丢失）
const fromEmptyVal = ref<string[]>([]);

// 事件日志
const eventLog = ref<string[]>([]);
const log = (msg: string) => {
  eventLog.value.unshift(`${new Date().toLocaleTimeString()} ${msg}`);
};
const onCreate = (v: string) => log(`create: ${v}`);
const onSearch = (v: string) => log(`search: "${v}"`);
const onChange = (v: unknown) => log(`change: ${JSON.stringify(v)}`);
</script>

<template>
  <OForm layout="v" class="demo-select-multi-input">
    <OFormItem label="多选 + filterable">
      <OSelect
        v-model="filterableVal"
        :options="options"
        multiple
        filterable
        placeholder="搜索水果"
        clearable
        class="demo-select"
        @search="onSearch"
        @change="onChange"
      />
      <template #extra>
        <u>已选：{{ JSON.stringify(filterableVal) }} — 展开后输入"芒"过滤到"芒果"</u>
      </template>
    </OFormItem>

    <OFormItem label="多选 + allowCreate">
      <OSelect
        v-model="createVal"
        :options="options"
        multiple
        filterable
        allow-create
        placeholder="输入新水果名创建"
        clearable
        class="demo-select"
        @create="onCreate"
        @change="onChange"
      />
      <template #extra>
        <u>已选：{{ JSON.stringify(createVal) }} — 展开后输入"猕猴桃"创建</u>
      </template>
    </OFormItem>

    <OFormItem label="多选 + 非 filterable">
      <OSelect v-model="nonFilterableVal" :options="options" multiple placeholder="不可搜索，仅选项点击" clearable class="demo-select" />
      <template #extra>
        <u>已选：{{ JSON.stringify(nonFilterableVal) }} — 展开后不渲染 input，仅选项点击</u>
      </template>
    </OFormItem>

    <OFormItem label="responsive 折叠">
      <OSelect
        v-model="responsiveVal"
        :options="options"
        multiple
        filterable
        max-tag-count="responsive"
        placeholder="搜索"
        clearable
        class="demo-select demo-select-narrow"
      />
      <template #extra>
        <u>已选：{{ JSON.stringify(responsiveVal) }} — 展开后 input ≥ 80px 可见</u>
      </template>
    </OFormItem>

    <OFormItem label="从空开始多选">
      <OSelect v-model="fromEmptyVal" :options="options" multiple filterable placeholder="点击选项开始多选" clearable class="demo-select" @change="onChange" />
      <template #extra>
        <u>已选：{{ JSON.stringify(fromEmptyVal) }} — 首次选中后焦点不丢失</u>
      </template>
    </OFormItem>

    <OFormItem v-if="eventLog.length" label="事件日志">
      <div class="demo-event-log">
        <div v-for="(line, i) in eventLog" :key="i">{{ line }}</div>
      </div>
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-multi-input {
  .demo-select {
    max-width: 360px;
  }
  .demo-select-narrow {
    max-width: 280px;
  }
  .demo-event-log {
    font-size: 12px;
    font-family: monospace;
    max-height: 100px;
    overflow-y: auto;
    background: var(--o-color-fill2);
    padding: 8px;
    border-radius: var(--o-radius_control-m);
  }
}
</style>
