<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { OForm, OFormItem } from '../../form';
import '../../form/style';
import { OInputNumber } from '../../input-number';
import '../../input-number/style';
import { ORadio } from '../../radio';
import '../../radio/style';
import { ORadioGroup } from '../../radio-group';
import '../../radio-group/style';

import { mockTreeArr, MockTreeParams } from './utils.ts';
import { OMenu } from '../index';
import RecursiveSubMenu from './RecursiveSubMenu.vue';
import OIconMore from './OIconMore.vue';

const params = reactive<Pick<MockTreeParams, 'depth' | 'maxChild' | 'minChild'> & {
  iconType: 'all' | 'some' | 'none'
}>({
  depth: 3, minChild: 2, maxChild: 10, iconType: 'none'
});
const data = computed(() => mockTreeArr({
  ...params,
  getIcon(item, i) {
    if (params.iconType === 'all') {
      return OIconMore;
    } else if (params.iconType === 'some') {
      return i % 2 ? OIconMore : undefined;
    }
    return undefined;
  }
}));
const activeVal = ref();
const expandedArr = ref([]);
</script>

<template>
  <h4>带缩进指示线及背景颜色</h4>
  <div>
    <OForm>
      <OFormItem label="最大深度" required>
        <OInputNumber v-model="params.depth"/>
      </OFormItem>
      <OFormItem label="最小子节点数量" required>
        <OInputNumber v-model="params.minChild"/>
      </OFormItem>
      <OFormItem label="最大子节点数量" required>
        <OInputNumber v-model="params.maxChild"/>
      </OFormItem>
      <OFormItem label="图标" field="radio">
        <ORadioGroup v-model="params.iconType">
          <ORadio value="all">全部</ORadio>
          <ORadio value="some">部分</ORadio>
          <ORadio value="none">无</ORadio>
        </ORadioGroup>
      </OFormItem>
    </OForm>
  </div>
  <section :key="params.iconType">
    <div>
      medium
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" accordion size="medium">
        <RecursiveSubMenu v-for="item in data" :key="item.label" :data="item"/>
      </OMenu>
    </div>
    <div>
      small
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" accordion size="small">
        <RecursiveSubMenu v-for="item in data" :key="item.label" :data="item"/>
      </OMenu>
    </div>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  align-items: stretch;
  gap: 120px;
}
</style>