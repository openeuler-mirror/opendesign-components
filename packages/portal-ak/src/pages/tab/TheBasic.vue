<script setup lang="ts">
import { OTab, OTabPane, OIcon, OIconCalendar, OIconAdd } from '@components/index';

const tabList = [
  { id: 1, label: '页签文字1', icon: OIconCalendar },
  { id: 2, label: '页签文字2', icon: OIconAdd },
  { id: 3, label: '页签文字3', icon: OIconCalendar },
  { id: 4, label: '页签文字4', icon: OIconAdd },
  { id: 5, label: '页签文字5', icon: OIconCalendar },
  { id: 6, label: '页签文字6', icon: OIconAdd },
  { id: 7, label: '页签文字7', icon: OIconCalendar },
  { id: 8, label: '页签文字8', icon: OIconAdd },
];
</script>
<template>
  <h4>无图标页签 L</h4>
  <OTab variant="text" :line="false">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :label="item.label" :value="item.id">
      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <br />

  <OTab variant="text" :line="false">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :value="item.id">
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
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :label="item.label" :value="item.id">
      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <br />
  <OTab variant="text" :line="false" class="c-tab-large">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :value="item.id">
      <template #nav>
        <div class="o-tab-nav-title">
          <OIcon :icon="item.icon" />
          {{ item.label }}
        </div>
      </template>

      <div style="height: 100px; background-color: #fff">pane {{ item.id }}</div>
    </OTabPane>
  </OTab>
  <br />
  <OTab variant="text" :line="false" class="c-tab-large" :model-value="4">
    <OTabPane v-for="item in tabList" :key="item.id" class="pane" :value="item.id">
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
