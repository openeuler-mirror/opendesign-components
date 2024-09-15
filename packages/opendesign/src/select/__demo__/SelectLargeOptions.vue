<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';
import { OVirtualList } from '../../virtual-list';
import '../../virtual-list/style';

const selectVal1 = ref('opt4');
const options = new Array(10000).fill(0).map((_, idx) => ({ label: `option-${idx}`, value: `opt-${idx}` }));
</script>
<template>
  <h4>Select Large Options</h4>
  <section>
    <div>Options: {{ options.length }}</div>
    <OSelect v-model="selectVal1" placeholder="select..." clearable>
      <OVirtualList :list="options" class="option-list" :scrollbar="{ showType: 'hover', size: 'small' }">
        <template #default="{ item }">
          <OOption :key="item.value" :label="item.label" :value="item.value" />
        </template>
      </OVirtualList>
    </OSelect>
  </section>
</template>
<style lang="scss">
.diy-group {
  border-top: 1px solid #999;
  background-color: #efefef;
  padding: var(--option-group-name-padding);
}
.option-list {
  max-height: inherit;
}
</style>
