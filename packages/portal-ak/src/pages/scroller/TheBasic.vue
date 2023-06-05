<script setup lang="ts">
import { OScroller } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <h4 style="width: 40px">M:</h4>
    <section>
      <OScroller class="container" show-type="hover" size="small">
        <div class="section">横、竖向滚动</div>
        <div class="section">横、竖向滚动</div>
        <div class="section">横、竖向滚动</div>
      </OScroller>
      <OScroller class="container" show-type="hover" size="small" disabled-x>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
      </OScroller>
      <OScroller class="container" show-type="hover" size="small" disabled-y>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
      </OScroller>
    </section>
    <h4 style="width: 40px">L:</h4>
    <section>
      <OScroller class="container" show-type="hover">
        <div class="section">横、竖向滚动</div>
        <div class="section">横、竖向滚动</div>
        <div class="section">横、竖向滚动</div>
      </OScroller>
      <OScroller class="container" show-type="hover" disabled-x>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
        <div class="section">禁用横向滚动</div>
      </OScroller>

      <OScroller class="container" show-type="hover" disabled-y>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
        <div class="section">禁用竖向滚动</div>
      </OScroller>
    </section>
  </div>
</template>
<style lang="scss">
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
.container {
  width: 30%;
  height: 300px;
  // border: 1px solid red;
}
</style>
