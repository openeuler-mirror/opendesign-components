<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTab, OTabPane, OIcon, OIconCalendar, OIconAdd } from '@components/index';

const tabList = [
  { id: 1, label: '页签文字1', icon: OIconCalendar },
  { id: 2, label: '页签文字2', icon: OIconAdd },
  { id: 3, label: '页签文字3', icon: OIconCalendar },
  { id: 4, label: '页签文字4', icon: OIconAdd },
];

const activeTab = ref('Tab A');
const activeTab2 = ref('1');
const tabChange = (val: string | number, oldVal?: string | number) => {
  console.log(`active: ${val}, old: ${oldVal}`);
};
function getPanelItem(key: string) {
  return {
    id: key,
    label: `Nav ${key}`,
    content: `Panel Content: ${key}`,
  };
}
const onChange = (v: string | number, oldv?: string | number) => {
  console.log('change', v, oldv);
};
</script>
<template>
  <h4>无图标页签 L</h4>
  <OTab variant="text" :line="false">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :label="item.label">
      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <br />

  <OTab variant="text" :line="false">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane">
      <template #nav>
        <div class="o-tab-nav-title">
          <OIcon :icon="item.icon" />
          {{ item.label }}
        </div>
      </template>
      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <h4>带图标页签 L</h4>
  <OTab variant="text" :line="false" class="c-tab-large">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :label="item.label">
      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <br />
  <OTab variant="text" :line="false" class="c-tab-large">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane">
      <template #nav>
        <div class="o-tab-nav-title">
          <OIcon :icon="item.icon" />
          {{ item.label }}
        </div>
      </template>

      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
</template>
<style lang="scss"></style>
