<script setup lang="ts">
import { ref, reactive } from 'vue';
import { OTab, OTabPane } from '../index';
import { IconSearch } from '../../icons';
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
const onChange = (v: string | number, oldv?: string | number) => {
  console.log('change', v, oldv);
};
const updateTab = (v: string) => {
  activeTab.value = v;
};
</script>
<template>
  <h4>Variant</h4>
  <div class="sec">
    <p>Solid</p>
    <OTab variant="solid" @change="onChange">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" unmount-on-hide>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTab>
    <p>line:false</p>
    <OTab variant="solid" :line="false">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTab>
    <br />
    <p>Text</p>
    <OTab variant="text">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTab>
    <p>line:false</p>
    <OTab variant="text" :line="false">
      <OTabPane class="pane" label="Tab 1">pane 1</OTabPane>
      <OTabPane class="pane" label="Tab 2" closable lazy><div style="height: 50px">pane 2</div></OTabPane>
      <OTabPane class="pane" label="Tab 3" lazy>pane 3</OTabPane>
      <OTabPane class="pane" label="Tab 4" disabled closable>pane 4</OTabPane>
    </OTab>
  </div>
  <h4>Slot & change</h4>
  <div class="sec">
    <p @click="updateTab('Tab A')">click to active Tab A</p>

    <OTab v-model="activeTab" addable @change="tabChange">
      <template #prefix>Prefix</template>
      <template #suffix>Suffix</template>
      <OTabPane value="Tab A" class="pane"><template #nav>Nav 1</template>pane 1 </OTabPane>
      <OTabPane value="Tab B" class="pane">pane 2</OTabPane>
      <OTabPane value="Tab C" class="pane">
        <template #nav><IconSearch /> Nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="Tab D" class="pane">pane 4</OTabPane>
    </OTab>
    <p>center</p>
    <OTab v-model="activeTab" :style="{ '--tab-nav-justify': 'center' }" addable @change="tabChange">
      <template #prefix>Prefix</template>
      <template #suffix>Suffix</template>
      <OTabPane value="Tab A" class="pane"><template #nav>Nav 1</template>pane 1 </OTabPane>
      <OTabPane value="Tab B" class="pane">pane 2</OTabPane>
      <OTabPane value="Tab C" class="pane">
        <template #nav><IconSearch /> Nav 3</template>pane 3
      </OTabPane>
      <OTabPane value="Tab D" class="pane">pane 4</OTabPane>
    </OTab>
  </div>
  <h4>Add & Lazy</h4>
  <div class="sec">
    <OTab v-model="activeTab2" lazy addable @change="tabChange" @add="tabAdd" @delete="tabDelete">
      <OTabPane v-for="(item, idx) in tabList" :key="item.id" :value="item.id" class="pane" :label="item.label" :closable="idx > 1">
        {{ item.content }}
      </OTabPane>
    </OTab>
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
