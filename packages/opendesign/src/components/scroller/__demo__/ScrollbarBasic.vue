<script setup lang="ts">
import { OScroller } from '../index';
</script>
<template>
  <h4>resize observer</h4>
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
      <h3>Scroller showType="auto"</h3>
      <OScroller class="container">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>

    <div>
      <h3>Scroller showType="always"</h3>
      <OScroller class="container" show-type="always">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>

    <div>
      <h3>Scroller showType="hover"</h3>
      <OScroller class="container" show-type="hover">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>

    <div>
      <h3>Scroller size="small"</h3>
      <OScroller class="container" show-type="always" size="small">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.container {
  width: 300px;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
}
.native {
  overflow: auto;
}

.section {
  height: 200px;
  width: 400px;
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
