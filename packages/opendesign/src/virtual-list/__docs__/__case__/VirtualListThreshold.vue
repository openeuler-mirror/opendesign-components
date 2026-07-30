<docs lang="md">
<!-- zh-CN -->

### 虚拟化阈值 ^[1.2.6](primary)

通过 `threshold` 属性控制虚拟滚动的启用条件：数据量低于阈值时全量渲染，高于阈值时启用虚拟化。设为 `null` 时始终启用虚拟化。

<!-- en-US -->

### Virtualization Threshold ^[1.2.6](primary)

Control the virtual scrolling enable condition via the `threshold` prop: full rendering when data count is below the threshold, virtualization enabled when above. Set to `null` to always enable virtualization.
</docs>

<script lang="ts" setup>
import { ref } from 'vue';
import { OButton, OVirtualList } from '@opensig/opendesign';

/** 小数据集（低于 threshold） */
const smallList = ref(
  new Array(10).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项目 ${idx + 1}`,
  })),
);

/** 大数据集（高于 threshold） */
const largeList = ref(
  new Array(1000).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项目 ${idx + 1}`,
  })),
);

/** 动态增减数据量演示 */
const dynamicList = ref(
  new Array(8).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项目 ${idx + 1}`,
  })),
);

/** 追加数据，超过 threshold 后自动启用虚拟化 */
const addItem = () => {
  const nextId = dynamicList.value.length + 1;
  dynamicList.value = dynamicList.value.concat([{ id: nextId, label: `项目 ${nextId}` }]);
};

/** 删除数据 */
const removeItem = () => {
  if (dynamicList.value.length > 0) {
    dynamicList.value = dynamicList.value.slice(0, -1);
  }
};
</script>
<template>
  <div>
    <h5>threshold=20，小数据集（10 条，低于阈值→全量渲染）</h5>
    <OVirtualList :item-size="40" :list="smallList" :threshold="20" class="container">
      <template #default="{ item, index }">
        <div :class="`item-${(index % 8) + 1}`" class="item">{{ item.label }}（全量渲染）</div>
      </template>
    </OVirtualList>

    <h5>threshold=20，大数据集（1000 条，高于阈值→虚拟化）</h5>
    <OVirtualList :item-size="40" :list="largeList" :threshold="20" class="container">
      <template #default="{ item, index }">
        <div :class="`item-${(index % 8) + 1}`" class="item">{{ item.label }}（虚拟化渲染）</div>
      </template>
    </OVirtualList>

    <h5>动态增减数据——threshold=15，当前 {{ dynamicList.length }} 条</h5>
    <div class="controls">
      <OButton size="small" @click="addItem">追加 1 条</OButton>
      <OButton size="small" @click="removeItem">删除 1 条</OButton>
      <span>低于 15 条：全量渲染 | 高于 15 条：虚拟化</span>
    </div>
    <OVirtualList :item-size="40" :list="dynamicList" :threshold="15" class="container">
      <template #default="{ item, index }">
        <div :class="`item-${(index % 8) + 1}`" class="item">
          {{ item.label }}
        </div>
      </template>
    </OVirtualList>

    <h5>threshold=null（始终启用虚拟化）</h5>
    <OVirtualList :item-size="40" :list="smallList" :threshold="null" class="container">
      <template #default="{ item, index }">
        <div :class="`item-${(index % 8) + 1}`" class="item">{{ item.label }}（始终虚拟化）</div>
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
  width: 100%;
  height: 200px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
}

.item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  display: flex;
  align-items: center;
  gap: var(--o-gap-2);
  margin-bottom: var(--o-gap-2);

  button {
    cursor: pointer;
  }

  span {
    font-size: var(--o-font_size-tip2);
    line-height: var(--o-line_height-tip2);
  }
}

@for $i from 1 through 8 {
  .item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
