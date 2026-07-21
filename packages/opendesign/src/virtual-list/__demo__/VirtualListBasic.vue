<script lang="ts" setup>
import { ref } from 'vue';
import { OVirtualList, RenderIndexInfo } from '../index';
import '../style';
import { BaseScrollerPropsT } from '../../scrollbar';
import { uniqueId } from '../../_utils/helper';

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    label: idx + 1,
    height: Math.floor(Math.random() * 80 + 40),
  })),
);

const onClick = (item: any) => {
  item.height -= 10;
};

const containerHeight = ref(300);
const changeContainerSize = () => {
  containerHeight.value += 100;
};

const list2 = ref(
  new Array(20).fill(1).map((_, idx) => ({
    id: uniqueId(),
    label: `${idx + 1}`,
    height: Math.floor(Math.random() * 80 + 40),
  })),
);
const changeListData = () => {
  const n = new Array(10).fill(1).map((_, idx) => ({
    id: uniqueId(),
    label: `add${idx + 1}`,
    height: Math.floor(Math.random() * 80 + 40),
  }));
  list2.value = list2.value.concat(n);
};

const scrollbarProps: Partial<BaseScrollerPropsT> = {
  showType: 'always',
  size: 'medium',
  autoUpdateOnScrollSize: true,
};
const onRenderChange = (params: RenderIndexInfo) => {
  console.log(params.start, params.end, params.count, params.visible);
};
</script>
<template>
  <h4>Scroller basic</h4>
  <div class="row">
    <div class="col">
      <h5>高度固定且一致 default-start-index: 10</h5>
      <OVirtualList :default-start-index="10" :item-size="80" :list="list" class="container" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <h5>动态高度 default-start-index: 10</h5>
      <OVirtualList :default-start-index="10" :list="list" class="container" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section" @click="onClick(item)">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>{{ item.height }}</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>

  <h4>容器变化</h4>
  <button @click="changeContainerSize">容器高度+20</button>

  <div class="row">
    <div class="col">
      <OVirtualList
        :default-start-index="10"
        :item-size="80"
        :list="list"
        :style="{ height: containerHeight + 'px' }"
        class="container2"
        @render-change="onRenderChange"
      >
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <OVirtualList :default-start-index="44" :list="list" :style="{ height: containerHeight + 'px' }" class="container2" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>
  <h4>数据变化</h4>
  <button @click="changeListData">数据变化 长度+10</button> <span> list length: {{ list2.length }}</span>

  <div class="row">
    <div class="col">
      <OVirtualList
        :default-start-index="10"
        :item-size="80"
        :list="list2"
        :scrollbar="scrollbarProps"
        :style="{ height: containerHeight + 'px' }"
        class="container2"
      >
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <OVirtualList
        :default-start-index="10"
        :list="list2"
        :scrollbar="scrollbarProps"
        :style="{ height: containerHeight + 'px' }"
        class="container2"
        @render-change="onRenderChange"
      >
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>{{ item.height }}</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.container {
  width: 100%;
  height: 300px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
  display: flex;
}
.container2 {
  width: 100%;
  border: 2px solid var(--o-color-control4);
}
.col {
  flex: 1;
}
.section {
  display: flex;
  align-items: center;
  justify-content: center;
}
@for $i from 1 through 8 {
  .item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
