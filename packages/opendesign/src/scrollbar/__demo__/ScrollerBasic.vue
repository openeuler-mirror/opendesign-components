<script setup lang="ts">
import { OScroller } from '../index';
import '../../popover/style';
import TheSubComp from './TheSubComp.vue';
</script>
<template>
  <h4>Scroller basic</h4>
  <section>
    <div>
      <h3>Native</h3>
      <div class="container native">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </div>
    </div>
    <div>
      <h3>showType="auto"</h3>
      <OScroller class="container">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>
    <div>
      <h3>showType="always"</h3>
      <OScroller class="container" show-type="always">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>

    <div>
      <h3>showType="hover"</h3>
      <OScroller class="container" show-type="hover">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>

    <div>
      <h3>size="small"</h3>
      <OScroller class="container" show-type="always" size="small">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>
    <div>
      <h3>禁用横向滚动</h3>
      <OScroller class="container" show-type="hover" size="small" disabled-x>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
      </OScroller>
    </div>
    <div>
      <h3>禁用竖向滚动</h3>
      <OScroller class="container" show-type="hover" size="small" disabled-y>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
      </OScroller>
    </div>
    <div>
      <h3>子元素为组件</h3>
      <OScroller class="container" show-type="always">
        <TheSubComp />
      </OScroller>
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
}
</style>
