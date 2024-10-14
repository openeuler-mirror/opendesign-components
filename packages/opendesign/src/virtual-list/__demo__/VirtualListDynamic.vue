<script setup lang="ts">
import { ref } from 'vue';
import { uniqueId } from '../../_utils/helper';
import { OVirtualList } from '../index';
import '../style';

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    id: uniqueId(),
    label: `${idx + 1}`,
    height: Math.floor(Math.random() * 80 + 40),
  }))
);

const onRenderChange = (start: number, end: number) => {
  console.log(start, end);

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
    <OVirtualList class="container" :list="list" :default-start-index="10" :item-size="80" @renderChange="onRenderChange">
      <template #default="{ item, index }">
        <div :key="item.label" class="section" :class="`item-${index + 1}`">
          <span>Row:</span> <span>{{ item.label }}</span
          >------<span>Height:</span> <span>80px</span>
        </div>
      </template>
    </OVirtualList>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 400px;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
  display: flex;
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

@for $i from 1 through 100 {
  .item-#{$i} {
    background-color: rgba(random(255), random(255), random(255), 1);
  }
}
</style>
