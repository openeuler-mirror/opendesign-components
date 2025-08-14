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
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" accordion :level-indicator="true" size="medium">
        <RecursiveSubMenu v-for="item in data" :key="item.label" :data="item"/>
      </OMenu>
    </div>
    <div>
      small
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" accordion :level-indicator="true" size="small">
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

  :deep(.o-menu1) {

    /*箭头调整*/
    .o-sub-menu-title-arrow {
      display: none;
    }

    .o-sub-menu-title-icon {
      transition: transform var(--o-duration-m2) var(--o-easing-standard);
    }

    .o-sub-menu-expanded > .o-sub-menu-title .o-sub-menu-title-icon {
      transform: rotate(-180deg);
    }

    /*引导线*/
    .o-sub-menu-expanded {
      .o-sub-menu-children {
        position: relative;

        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: var(--guid-line-z-index);
          width: 1px;
          height: 100%;
          background-color: red;
          left: var(--parent-padding-left);
          top: 0;
          bottom: 0;
        }
      }
    }

    > .o-sub-menu > .o-sub-menu-children:before {
      display: none;
    }

    /*尺寸调整*/
    .o-sub-menu {
      --sub-menu-radius: 0;
      --sub-menu-icon-size: 16px;
      --padding-y: calc((var(--o-control_size-m) - var(--menu-item-secondary-text-height)) / 2);
    }

    .o-menu-item {
      --menu-item-radius: 0;
      padding-top: var(--padding-y);
      padding-bottom: var(--padding-y);
    }

    .o-menu-item + .o-menu-item {
      margin-top: 0;
    }

    .o-sub-menu-associated-selected {
      background-color: #f7f8fa;

      > .o-sub-menu-title .o-sub-menu-title-content {
        color: var(--o-color-info1);
        font-weight: 700;

      }
    }

    .o-menu-item-selected {
      background-color: #d1d6db;
      color: var(--o-color-info1);
      font-weight: 700;
    }
  }
}
</style>