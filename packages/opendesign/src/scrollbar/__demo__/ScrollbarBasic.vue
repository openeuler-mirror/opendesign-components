<script setup lang="ts">
import { ref } from 'vue';
import TheScrollComp from './TheScrollComp.vue';
import { OScrollbar } from '../index';

const showType = ref<'auto' | 'always' | 'hover' | 'never'>('hover');
const setShowType = (type: 'auto' | 'hover' | 'always') => {
  showType.value = type;
};

const wrapper = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const txtarea = ref<HTMLElement | null>(null);

const compRef = ref<InstanceType<typeof TheScrollComp> | null>(null);
</script>
<template>
  <h4>Scroller basic</h4>
  <div>
    <h3>Genneral</h3>
    <div>
      showType: <button @click="setShowType('auto')">auto</button><button @click="setShowType('always')">always</button
      ><button @click="setShowType('hover')">hover</button>
    </div>
    <div class="scrollbar-wrapper" ref="wrapper">
      <div class="container" ref="container">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </div>
      <OScrollbar :target="container" :show-type="showType" />
    </div>
  </div>
  <div>
    <h3>Scroller to component</h3>
    <div style="display: inline-flex" class="scrollbar-wrapper">
      <TheScrollComp ref="compRef" />
      <OScrollbar :target="compRef" :show-type="showType" />
    </div>
  </div>
  <div>
    <h3>Scroller to textarea</h3>
    <div style="display: inline-flex" class="scrollbar-wrapper">
      <textarea ref="txtarea" rows="5" cols="30"></textarea>
      <OScrollbar :target="txtarea" :show-type="showType" />
    </div>
  </div>

  <br />
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  position: relative;
}
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
