<script setup lang="ts">
import { ref } from 'vue';
import { OVirtualList } from '../index';
import '../style';

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    label: idx + 1,
    height: Math.floor(Math.random() * 80 + 40),
  }))
);

const defaultStartIndex = 10;
const index = ref(5);
const virtualRef = ref<InstanceType<typeof OVirtualList>>();
const virtualRef2 = ref<InstanceType<typeof OVirtualList>>();
const onClick = () => {
  virtualRef.value?.scrollToView(index.value, 'center', 'smooth');
  virtualRef2.value?.scrollToView(index.value, 'start');
};
</script>
<template>
  <h4>API 调用</h4>
  <div>
    <div>
      <input v-model="index" />
      <button @click="onClick">滚动到</button>
    </div>
    <div class="row">
      <div class="col">
        <div>
          <h5>高度固定且一致</h5>
          <OVirtualList ref="virtualRef" class="container" :list="list" :default-start-index="defaultStartIndex" :item-size="80">
            <template #default="{ item, index }">
              <div :key="item.label" class="section" :class="`item-${index + 1}`">
                <span>Row:</span> <span>{{ item.label }}</span
                >------<span>Height:</span> <span>80px</span>
              </div>
            </template>
          </OVirtualList>
        </div>
      </div>
      <div class="col">
        <div>
          <h5>动态高度</h5>
          <OVirtualList ref="virtualRef2" class="container" :list="list" :default-start-index="defaultStartIndex" :default-item-size="20">
            <template #default="{ item, index }">
              <div :key="item.label" class="section" :class="`item-${index + 1}`" :style="{ height: item.height + 'px' }">
                <span>Row:</span> <span>{{ item.label }}</span
                >------<span>Height:</span> <span>{{ item.height }}</span>
              </div>
            </template>
          </OVirtualList>
        </div>
      </div>
    </div>
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
