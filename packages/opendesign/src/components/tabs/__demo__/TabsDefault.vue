<script setup lang="ts">
import { ref } from 'vue';
import { OTabs, OTabPane } from '../index';
import { IconSearch } from '../../icons';
const activeTab = ref('Tab A');
const tabChange = (val: string | number, oldVal: string | number) => {
  console.log(`active: ${val}, old: ${oldVal}`);
};
</script>
<template>
  <h4>Default</h4>
  <div class="sec">
    <OTabs>
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTabs>
  </div>
  <div class="sec">
    <OTabs v-model="activeTab" lazy @change="tabChange">
      <template #act>action</template>
      <OTabPane value="Tab A" class="pane"><template #nav>Nav 1</template>pane 1 </OTabPane>
      <OTabPane value="Tab B" class="pane">pane 2</OTabPane>
      <OTabPane value="Tab C" class="pane">
        <template #nav><IconSearch /> Nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="Tab D" class="pane">pane 4</OTabPane>
    </OTabs>
  </div>
</template>
<style lang="scss">
.sec {
  border: 1px solid #eee;
  padding: 24px;
  margin-bottom: 24px;
}
.pane {
  padding: 36px;
  background-color: bisque;
}
</style>
