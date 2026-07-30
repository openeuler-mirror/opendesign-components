<script lang="ts" setup>
import { ref } from 'vue';
import { OVirtualList } from '../index';
import '../style';

/** 水平定宽列表数据 */
const hList = ref(
  new Array(20).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `卡片 ${idx + 1}`,
  })),
);

/** 水平不定宽列表数据 */
const hDynamicList = ref(
  new Array(20).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `卡片 ${idx + 1}`,
    width: Math.floor(Math.random() * 120 + 100),
  })),
);

const hVirtualRef = ref<InstanceType<typeof OVirtualList>>();
const scrollIndex = ref(10);

/** 水平模式下 scrollToView 演示 */
const onHScrollToView = () => {
  hVirtualRef.value?.scrollToView(scrollIndex.value, 'center', 'smooth');
};
</script>
<template>
  <h4>水平布局</h4>
  <h5>定宽水平布局（itemSize=160）</h5>
  <OVirtualList :buffer="2" :item-size="160" :list="hList" class="h-container" layout="horizontal">
    <template #default="{ item, index }">
      <div :class="`h-item-${(index % 8) + 1}`" class="h-card">
        <span>{{ item.label }}</span>
      </div>
    </template>
  </OVirtualList>

  <h5>不定宽水平布局（运行时测量宽度）</h5>
  <OVirtualList :buffer="2" :default-item-size="150" :list="hDynamicList" class="h-container" layout="horizontal">
    <template #default="{ item, index }">
      <div :class="`h-item-${(index % 8) + 1}`" :style="{ width: item.width + 'px' }" class="h-card">
        <span>{{ item.label }}</span>
        <span class="h-width">{{ item.width }}px</span>
      </div>
    </template>
  </OVirtualList>

  <h5>水平 scrollToView 演示</h5>
  <div class="h-controls">
    <label>索引：<input v-model.number="scrollIndex" max="19" min="0" type="number" /></label>
    <button @click="onHScrollToView">滚动到</button>
  </div>
  <OVirtualList ref="hVirtualRef" :buffer="2" :default-start-index="5" :item-size="160" :list="hList" class="h-container" layout="horizontal">
    <template #default="{ item, index }">
      <div :class="`h-item-${(index % 8) + 1}`" class="h-card">
        <span>{{ item.label }}</span>
      </div>
    </template>
  </OVirtualList>
</template>
<style lang="scss" scoped>
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.h-container {
  width: 100%;
  height: 120px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
}

.h-card {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: var(--o-radius_control-s);
}

.h-width {
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
  margin-top: var(--o-gap-1);
}

.h-controls {
  display: flex;
  align-items: center;
  gap: var(--o-gap-2);
  margin-bottom: var(--o-gap-2);

  label {
    display: flex;
    align-items: center;
    gap: var(--o-gap-1);
  }

  input {
    width: 60px;
  }

  button {
    cursor: pointer;
  }
}

@for $i from 1 through 8 {
  .h-item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
