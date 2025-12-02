<script setup lang="ts">
import { OAnchor, OAnchorItem } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <div class="demo-wrap">
      <div id="block1" class="block">block1</div>
      <div id="block2" class="block">block2</div>
      <div id="block3" class="block">block3</div>
      <div id="block3-1" class="block">block3-1</div>
      <div id="block3-2" class="block">block3-2</div>
      <div id="block4" class="block">block4</div>
    </div>
    <div class="demo-anchor">
      <div>
        <div>medium:</div>
        <OAnchor style="max-width: 200px" size="medium">
          <OAnchorItem href="#block1" title="锚点1" />
          <OAnchorItem href="#block2" title="bbbbbbbbbbbbbbbbbbbbbbbb" />
          <OAnchorItem href="#block3" title="锚点3">
            <OAnchorItem href="#block3-1" title="锚点3-1aaaaaaaaaaaaaaaaaaaa" />
            <OAnchorItem href="#block3-2" title="锚点2" disabled/>
          </OAnchorItem>
          <OAnchorItem href="#block4" title="锚点4" />
        </OAnchor>
      </div>
      <div>
        <div>small:</div>
        <OAnchor style="max-width: 200px" size="small">
          <OAnchorItem href="#block1" title="锚点1" />
          <OAnchorItem href="#block2" title="bbbbbbbbbbbbbbbbbbbbbbbb" />
          <OAnchorItem href="#block3" title="锚点3">
            <OAnchorItem href="#block3-1" title="锚点3-1aaaaaaaaaaaaaaaaaaaa" />
            <OAnchorItem href="#block3-2" title="锚点2" />
          </OAnchorItem>
          <OAnchorItem href="#block4" title="锚点4" />
        </OAnchor>
      </div>
      <div>
        <div>menu:</div>
        <OAnchor style="max-width: 200px" size="menu">
          <OAnchorItem href="#block1" title="锚点1" />
          <OAnchorItem href="#block2" title="锚点2" />
          <OAnchorItem href="#block3" title="锚点3">
            <OAnchorItem href="#block3-1" title="锚点3-1换行-openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区" />
            <OAnchorItem href="#block3-2" title="锚点3-2" />
          </OAnchorItem>
          <OAnchorItem href="#block4" title="锚点4" />
        </OAnchor>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.block {
  width: 400px;
  height: 600px;
}

#block1 {
  background: peachpuff;
}

#block2 {
  background: rgb(0, 255, 225);
}

#block3 {
  background: rgba(255, 255, 0, 0.959);
}

#block4 {
  background: pink;
}

.demo-anchor {
  position: fixed;
  top: 200px;
  right: 60px;
  display: flex;
}
</style>
