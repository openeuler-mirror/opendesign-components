<script setup lang="ts">
import { ref, computed } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';
import { OVirtualList } from '../../virtual-list';
import '../../virtual-list/style';

const selectVal1 = ref('opt-4');
const options = new Array(10000).fill(0).map((_, idx) => ({ label: `option-${idx}`, value: `opt-${idx}` }));
const startIndex = computed(() => options.findIndex((item) => item.value == selectVal1.value));
const isVisible = ref(false);
const virtualList = ref<InstanceType<typeof OVirtualList>>();
const onOptionsToggle = (visible: boolean) => {
  isVisible.value = visible;
  if (visible) {
    setTimeout(() => {
      virtualList.value?.scrollToView(startIndex.value);
    }, 50);
  }
};
</script>
<template>
  <h4>Select Large Options</h4>
  <section>
    <div>Options: {{ options.length }}</div>
    <OSelect v-model="selectVal1" placeholder="select..." clearable @options-visible-change="onOptionsToggle">
      <OVirtualList ref="virtualList" :list="options" class="option-list" :scrollbar="{ showType: 'hover', size: 'small' }" :default-start-index="startIndex">
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
