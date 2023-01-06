<script setup lang="ts">
import { ref } from 'vue';
import { OTabs, OTabPane } from '../index';
import { IconSearch } from '../../icons';
const activeTab = ref('');
</script>
<template>
  <h4>Default</h4>
  <section>
    <OTabs v-model="activeTab">
      <OTabPane value="1">pane 1</OTabPane>
      <OTabPane value="2">pane 2</OTabPane>
      <OTabPane value="3">pane 3</OTabPane>
      <OTabPane value="4">pane 4</OTabPane>
    </OTabs>
  </section>
  <section>
    <OTabs v-model="activeTab">
      <OTabPane value="a"><template #nav>nav 1</template>pane 1 </OTabPane>
      <OTabPane value="b">pane 2</OTabPane>
      <OTabPane value="c">
        <template #nav><IconSearch /> nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="d"><template #nav>nav 4</template>pane 4</OTabPane>
    </OTabs>
  </section>
</template>
<style lang="scss"></style>
