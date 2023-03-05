<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTabs, OTabPane } from '../index';
import { IconSearch } from '../../icons';
const activeTab = ref('Tab A');
const tabChange = (val: string | number, oldVal: string | number) => {
  console.log(`active: ${val}, old: ${oldVal}`);
};
function getPanelItem(key: string) {
  return {
    id: key,
    label: `Nav ${key}`,
    content: `Panel Content: ${key}`,
  };
}
const tabList = reactive(
  new Array(4).fill(1).map((k, idx) => {
    return getPanelItem(`${idx + 1}`);
  })
);
const tabAdd = () => {
  console.log('add tab');
  tabList.push(getPanelItem(`${tabList.length + 1}`));
};

const tabDelete = (v: string | number) => {
  console.log(v);
};
</script>
<template>
  <h4>Variant</h4>
  <div class="sec">
    <p>Solid</p>
    <OTabs variant="solid">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTabs>
    <p>line:false</p>
    <OTabs variant="solid" :line="false">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTabs>
    <br />
    <p>Text</p>
    <OTabs variant="text">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTabs>
    <p>line:false</p>
    <OTabs variant="text" :line="false">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTabs>
  </div>
  <h4>Slot & change</h4>
  <div class="sec">
    <OTabs v-model="activeTab" @change="tabChange">
      <template #prefix>Prefix</template>
      <template #suffix>Suffix</template>
      <OTabPane value="Tab A" class="pane"><template #nav>Nav 1</template>pane 1 </OTabPane>
      <OTabPane value="Tab B" class="pane">pane 2</OTabPane>
      <OTabPane value="Tab C" class="pane">
        <template #nav><IconSearch /> Nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="Tab D" class="pane">pane 4</OTabPane>
    </OTabs>
    <p>center</p>
    <OTabs v-model="activeTab" nav-justify="center" @change="tabChange">
      <template #prefix>Prefix</template>
      <template #suffix>Suffix</template>
      <OTabPane value="Tab A" class="pane"><template #nav>Nav 1</template>pane 1 </OTabPane>
      <OTabPane value="Tab B" class="pane">pane 2</OTabPane>
      <OTabPane value="Tab C" class="pane">
        <template #nav><IconSearch /> Nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="Tab D" class="pane">pane 4</OTabPane>
    </OTabs>
  </div>
  <h4>Add & Delete</h4>
  <div class="sec">
    <OTabs v-model="activeTab" lazy addable @change="tabChange" @add="tabAdd" @delete="tabDelete">
      <OTabPane v-for="(item, idx) in tabList" :key="item.id" :value="item.id" class="pane" :label="item.label" :closable="idx > 1">
        {{ item.content }}
      </OTabPane>
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
  background-color: #fff;
}
</style>
