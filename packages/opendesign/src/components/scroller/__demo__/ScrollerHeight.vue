<script setup lang="ts">
import { ref } from 'vue';
import { OScroller } from '../index';
import { OPopover } from '../../popover';
import '../../popover/style';
const height = ref(200);
let d = 1;
const changeHeight = () => {
  if (height.value > 700) {
    d = -1;
  } else if (height.value < 300) {
    d = 1;
  }
  height.value += d * 200;
};
</script>
<template>
  <h4>动态</h4>
  <section>
    <div>
      <h3 @click="changeHeight">高度动态变化 {{ height }}</h3>
      <OScroller class="container" show-type="always" size="small">
        <OPopover>
          <template #target>
            <div class="section" :style="{ height: `${height}px` }">高度动态变化</div>
          </template>
          <div>123</div>
        </OPopover>
      </OScroller>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
}
.section {
  height: 75%;
  width: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:nth-child(1) {
    background-color: #a4dcc26e;
  }
  &:nth-child(2) {
    background-color: #6288e66e;
  }
  &:nth-child(3) {
    background-color: #f4f8726e;
  }
}
</style>
