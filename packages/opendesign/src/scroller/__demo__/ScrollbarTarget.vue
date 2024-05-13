<script setup lang="ts">
import { ref } from 'vue';
import { OScrollbar } from '../index';
import '../../popover/style';
import TheScrollComp from './TheScrollComp.vue';

const containerRef = ref<HTMLElement | null>(null);
const compRef = ref<InstanceType<typeof TheScrollComp> | null>(null);
</script>
<template>
  <h4>Scroller target</h4>
  <section>
    <div>
      <h3>Native</h3>
      <div ref="containerRef" class="container native">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </div>
    </div>
    <div>
      <h3>映射窗口</h3>
      <div class="out-container">
        <OScrollbar class="out-scroller" show-type="always" size="small" :target="containerRef" />
      </div>
    </div>
    <TheScrollComp ref="compRef" />
    <div>
      <h3>映射窗口</h3>
      <div class="out-container">
        <OScrollbar class="out-scroller" show-type="always" size="small" :target="compRef" />
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.container {
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
}
.native {
  overflow: auto;
}
section > div {
  flex: 0 1 30%;
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
.out-scroller {
  height: 100%;
}
.out-container {
  width: 300px;
  height: 200px;
  background-color: #efefef;
  position: relative;
}
</style>
