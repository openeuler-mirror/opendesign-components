<script setup lang="ts">
import { OAnchor, OAnchorItem } from '../index';
</script>

<template>
  <h4>自定义Container</h4>
  <section>
    <div id="wrap" class="demo-wrap">
      <div id="container-block1" class="block">container-block1</div>
      <div id="container-block2" class="block">container-block2</div>
      <div id="container-block3" class="block">container-block3</div>
      <div id="container-block4" class="block">container-block4</div>
    </div>
    <div class="demo-anchor">
      <OAnchor container="#wrap">
        <OAnchorItem href="#container-block1" title="自定义Container锚点1" />
        <OAnchorItem href="#container-block2" title="自定义Container锚点2" />
        <OAnchorItem href="#container-block3" title="自定义Container锚点3" />
        <OAnchorItem href="#container-block4" title="自定义Container锚点4" />
      </OAnchor>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.block {
  height: 300px;

  &:nth-child(even) {
    background-color: paleturquoise;
  }

  &:nth-child(odd) {
    background-color: pink;
  }
}

.demo-wrap {
  width: 400px;
  height: 800px;
  overflow: auto;
}

.anchor {
  position: fixed;
  top: 800px;
  right: 60px;
}
</style>
