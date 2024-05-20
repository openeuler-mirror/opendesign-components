<script setup lang="ts">
import TheScrollComp from './TheScrollComp.vue';
import { vScrollbar, BaseScrollerPropsT } from '../index';

const setting: Partial<BaseScrollerPropsT> = {
  showType: 'always',
  size: 'small',
};
</script>
<template>
  <h2>指令</h2>
  <div>
    <h3>Scroller to dom</h3>
    <div class="wrapper" ref="wrapper">
      <div class="container" ref="container" v-scrollbar="setting">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </div>
    </div>
  </div>
  <div>
    <h3>Scroller to component</h3>
    <div style="display: inline-flex">
      <TheScrollComp
        ref="compRef"
        v-scrollbar="{
          showType: 'always',
          autoUpdateOnScrollSize: true,
        }"
      />
    </div>
  </div>
  <div>
    <h3>Scroller to Textarea</h3>
    <div style="display: inline-flex">
      <textarea ref="txtarea" rows="5" cols="30" v-scrollbar="{ showType: 'always', size: 'small' }"></textarea>
    </div>
  </div>

  <br />
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
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
</style>
