<script lang="ts" setup>
import { ref } from 'vue';
import { uniqueId } from '../../_utils/helper';
import { OVirtualList, RenderIndexInfo } from '../index';
import '../style';

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    id: uniqueId(),
    label: `${idx + 1}`,
    height: Math.floor(Math.random() * 80 + 40),
  })),
);

const onRenderChange = (renderIndex: RenderIndexInfo) => {
  const { start, end, visible, count } = renderIndex;
  console.log(start, end, visible, count);
  if (start <= 5) {
    const n = new Array(10).fill(1).map((_, idx) => ({
      id: uniqueId(),
      label: `add${idx + 1}`,
      height: Math.floor(Math.random() * 80 + 40),
    }));
    list.value = n.concat(list.value);
  } else if (start >= list.value.length - 5) {
    const n = new Array(10).fill(1).map((_, idx) => ({
      id: uniqueId(),
      label: `add${idx + 1}`,
      height: Math.floor(Math.random() * 80 + 40),
    }));
    list.value = list.value.concat(n);
  }
};
</script>
<template>
  <h4>动态追加数据（支持头部或尾部追加数据）</h4>
  <div>
    <h5>【数据添加id】根据滚动显示的位置，动态增加数据（向上滚动头部添加数据，向下滚动尾部追加数据）</h5>
    <OVirtualList :default-start-index="10" :item-size="80" :list="list" class="container" @render-change="onRenderChange">
      <template #default="{ item, index }">
        <div :key="item.label" :class="`item-${(index % 8) + 1}`" class="section">
          <span>Row:</span> <span>{{ item.label }}</span
          >------<span>Height:</span> <span>80px</span>
        </div>
      </template>
    </OVirtualList>
  </div>
</template>
<style lang="scss" scoped>
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.container {
  width: 400px;
  height: 300px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
  display: flex;
}

.section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--o-gap-2) 0;
}

@for $i from 1 through 8 {
  .item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
