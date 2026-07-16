<script lang="ts" setup>
import { ref } from 'vue';
import { OVirtualList } from '../index';
import '../style';

/** 测试用的 item 类型：{ foo: string, bar: number } */
interface DemoItem {
  foo: string;
  bar: number;
}

const list = ref<DemoItem[]>(
  new Array(50).fill(1).map((_, idx) => ({
    foo: `Item-${idx + 1}`,
    bar: idx * 2,
  })),
);

/** 错误属性引用——如果类型推断生效，此处应报 TS 错误 */
// const wrongProp = list.value[0].baz; // ← TS2339: Property 'baz' does not exist on type 'DemoItem'

/** itemSize 回调函数——item 参数应自动推断为 DemoItem */
const itemSizeFn = (item: DemoItem, index: number): number => {
  // ✅ item.foo 自动补全为 string
  // ✅ item.bar 自动补全为 number
  return item.bar + 20;
};
</script>

<template>
  <h4>泛型类型验证——item 类型为 { foo: string, bar: number }</h4>

  <!-- 1. slot 类型验证 -->
  <OVirtualList :item-size="80" :list="list" class="container">
    <template #default="{ item, index }">
      <div class="section">
        <!-- ✅ item.foo 自动补全为 string -->
        <!-- ✅ item.bar 自动补全为 number -->
        <!-- ❌ item.baz 会报 TS2339 -->
        <span>{{ item.foo }}</span> <span>{{ item.bar }}</span> <span>idx: {{ index }}</span>
      </div>
    </template>
  </OVirtualList>

  <!-- 2. itemSize 回调函数验证 -->
  <OVirtualList :item-size="itemSizeFn" :list="list" class="container">
    <template #default="{ item, index }">
      <div class="section">
        <span>{{ item.foo }}</span> <span>{{ item.bar }}</span>
      </div>
    </template>
  </OVirtualList>

  <!-- 3. 内联 itemSize 回调函数验证 -->
  <OVirtualList :item-size="(item: DemoItem, index: number) => item.bar + 30" :list="list" class="container">
    <template #default="{ item }">
      <div class="section">
        <span>{{ item.foo }}</span>
      </div>
    </template>
  </OVirtualList>
</template>

<style lang="scss" scoped>
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
  gap: var(--o-gap-2);
}
</style>
