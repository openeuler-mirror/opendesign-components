<script setup lang="ts">
import { ref } from 'vue';
import TheScrollComp from './TheScrollComp.vue';
import { useScrollbar } from '../index';

const wrapper = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const compRef = ref<InstanceType<typeof TheScrollComp> | null>(null);

useScrollbar({
  wrapper: wrapper,
  target: container,
  showType: 'always',
});

const { scrollbar } = useScrollbar({
  target: compRef,
  showType: 'always',
});
console.log(scrollbar);

const txtarea = ref<HTMLElement | null>(null);
useScrollbar({
  target: txtarea,
  showType: 'always',
  size: 'small',
});
</script>
<template>
  <h3>Scrollbar Hooks</h3>
  <div>
    <h3>Native</h3>
    <div class="wrapper" ref="wrapper">
      <div class="container" ref="container">
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </div>
    </div>
  </div>
  <div>
    <h3>Scroller to component</h3>
    <div style="display: inline-flex">
      <TheScrollComp ref="compRef" />
    </div>
  </div>
  <div>
    <h3>Scroller to Textarea</h3>
    <div style="display: inline-flex">
      <textarea ref="txtarea" rows="5" cols="30"></textarea>
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
