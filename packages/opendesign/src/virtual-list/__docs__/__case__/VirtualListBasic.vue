<docs lang="md">
<!-- zh-CN -->

### 基础用法

<!-- en-US -->

### Basic Usage
</docs>

<script lang="ts" setup>
import { ref } from 'vue';
import { BaseScrollerPropsT, OButton, OVirtualList, RenderIndexInfo } from '@opensig/opendesign';
import { uniqueId } from '../../../_utils/helper';

const list = ref(
  new Array(1000).fill(1).map((_, idx) => ({
    label: idx + 1,
    height: (idx % 8) * 10 + 40,
  })),
);

/** 按项定高：偶数行 40px，奇数行 80px */
const perIndexSize = (_item: unknown, index: number) => (index % 2 === 0 ? 40 : 80);

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
    height: (idx % 8) * 10 + 40,
  })),
);
const changeListData = () => {
  const n = new Array(10).fill(1).map((_, idx) => ({
    id: uniqueId(),
    label: `add${idx + 1}`,
    height: (idx % 8) * 10 + 40,
  }));
  list2.value = list2.value.concat(n);
};

const scrollbarProps: Partial<BaseScrollerPropsT> = {
  showType: 'always',
  size: 'medium',
  autoUpdateOnScrollSize: true,
};
const onRenderChange = (params: RenderIndexInfo) => {
  console.log(params);
};
</script>
<template>
  <div class="row">
    <div class="col">
      <h5>定高模式（itemSize=80）</h5>
      <OVirtualList :default-start-index="500" :item-size="80" :list="list" class="container" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>80px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
    <div class="col">
      <h5>按索引定高（itemSize 为函数）</h5>
      <OVirtualList :default-start-index="500" :item-size="perIndexSize" :list="list" class="container" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>{{ index % 2 === 0 ? 40 : 80 }}px</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h5>不定高模式（运行时测量）</h5>
      <OVirtualList :default-start-index="500" :list="list" class="container" @render-change="onRenderChange">
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
  <OButton size="small" @click="changeContainerSize">容器高度+100</OButton>

  <div class="row">
    <div class="col">
      <OVirtualList
        :default-start-index="500"
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
      <OVirtualList :default-start-index="800" :list="list" :style="{ height: containerHeight + 'px' }" class="container2" @render-change="onRenderChange">
        <template #default="{ item, index }">
          <div :key="item.label" :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section">
            <span>Row:</span> <span>{{ item.label }}</span
            >------<span>Height:</span> <span>{{ item.height }}</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>
  <h4>数据变化</h4>
  <OButton size="small" @click="changeListData">追加数据（长度+10）</OButton> <span>列表长度：{{ list2.length }}</span>

  <div class="row">
    <div class="col">
      <OVirtualList
        :default-start-index="15"
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
        :default-start-index="15"
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
