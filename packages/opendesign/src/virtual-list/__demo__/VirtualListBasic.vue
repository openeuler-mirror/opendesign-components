<script setup lang="ts">
import { ref } from 'vue';
import { OVirtualList, RenderIndexInfo } from '../index';
import '../style';
import { BaseScrollerPropsT } from '../../scrollbar';
import { uniqueId } from '../../_utils/helper';

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    label: idx + 1,
    height: Math.floor(Math.random() * 80 + 40),
  }))
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
  }))
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
      <h5>高度固定且一致</h5>
      <OVirtualList class="container" :list="list" :default-start-index="10" :item-size="80" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <h5>动态高度</h5>
      <OVirtualList class="container" :list="list" :default-start-index="10">
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`" :style="{ height: item.height + 'px' }" @click="onClick(item)">
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
        class="container2"
        :list="list"
        :default-start-index="10"
        :style="{ height: containerHeight + 'px' }"
        :item-size="80"
        @render-change="onRenderChange"
      >
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <OVirtualList class="container2" :list="list" :default-start-index="44" :style="{ height: containerHeight + 'px' }">
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`" :style="{ height: item.height + 'px' }">
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
        class="container2"
        :list="list2"
        :default-start-index="10"
        :style="{ height: containerHeight + 'px' }"
        :item-size="80"
        :scrollbar="scrollbarProps"
      >
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <OVirtualList
        class="container2"
        :list="list2"
        :default-start-index="10"
        :style="{ height: containerHeight + 'px' }"
        :scrollbar="scrollbarProps"
        @render-change="onRenderChange"
      >
        <template #default="{ item, index }">
          <div :key="item.label" class="section" :class="`item-${index + 1}`" :style="{ height: item.height + 'px' }">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>{{ item.height }}</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  position: relative;
}
.container {
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
  display: flex;
}
.col {
  flex: 1;
}

section > div {
  flex: 0 1 30%;
}
.section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

@for $i from 1 through 50 {
  .item-#{$i} {
    background-color: rgba(random(255), random(255), random(255), 1);
  }
}

.container2 {
  width: 100%;
  border: 2px solid rgb(111, 45, 234);
}
</style>
