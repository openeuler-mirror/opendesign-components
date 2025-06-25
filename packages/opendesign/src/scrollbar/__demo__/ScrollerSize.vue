<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { OScroller } from '../index';
import { OPopover } from '../../popover';
import '../../popover/style';
const height = ref(200);
const width = ref(200);
let d = 1;
const changeHeight = () => {
  if (height.value > 700) {
    d = -1;
  } else if (height.value < 300) {
    d = 1;
  }
  height.value += d * 200;
};
const changeWidth = () => {
  if (width.value > 700) {
    d = -1;
  } else if (width.value < 300) {
    d = 1;
  }
  width.value += d * 200;
};
const mo = new MutationObserver((o, e) => {
  console.log(o, e);
});

const container = ref();
onMounted(() => {
  if (container.value) {
    mo.observe(container.value, {
      childList: true,
      attributes: true,
    });
  }
});
</script>
<template>
  <h4>尺寸动态变化</h4>
  <section>
    <div>
      <h3 @click="changeHeight">高度动态变化 {{ height }}</h3>
      <h3 @click="changeWidth">宽度动态变化 {{ width }}</h3>
      <OScroller class="container" show-type="always" size="small">
        <div style="display: flex; width: fit-content;">
          <OPopover>
            <template #target>
              <div class="section" :style="{ height: `${height}px`, width: `${width}px` }">尺寸动态变化</div>
            </template>
            <div>123</div>
          </OPopover>
        </div>
      </OScroller>
    </div>

    <div>
      <div ref="container" class="box">
        <div class="section" :style="{ height: `${height}px`, width: `${width}px` }">尺寸动态变化</div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.container {
  width: 400px;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: content-box;
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
.box {
  width: 400px;
  height: 300px;
  border: 1px solid red;
  overflow: auto;
}
</style>
