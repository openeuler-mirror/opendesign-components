<docs lang="md">
<!-- zh-CN -->

### 使用

两种尺寸：`medium`、`small` ；

四种显示方式：`auto`、`always`、`hover`、`never` ；

滚动条显示方式为 `auto` 时,可以通过 `duration` 属性控制滚动条在停止滚动后持续显示的时间；

<!-- en-US -->

Two sizes: `medium`、`small`.

Four display methods: `auto`、`always`、`hover` and `never`.

When the display mode of the scroll bar is `auto`, the duration of the scroll bar's continuous display after it stops scrolling can be controlled through the `duration` attribute.

### Usage
</docs>
<script setup lang="ts">
import { ref } from 'vue';
const container = ref();
const showType = ref('always');
const disabledX = ref(false);
const disabledY = ref(false);
const size = ref('medium');
const duration = ref(600);
</script>
<template>
  <div class="demo-scrollbar-usage-operation">
    <div class="detail-operation">
      <span class="operation-des">滚动条显示方式</span>
      <ORadioGroup v-model="showType">
        <ORadio value="auto">auto</ORadio>
        <ORadio value="always">always</ORadio>
        <ORadio value="hover">hover</ORadio>
        <ORadio value="never">never</ORadio>
      </ORadioGroup>
    </div>
    <div class="detail-operation">
      <span class="operation-des">滚动条大小</span>
      <ORadioGroup v-model="size">
        <ORadio value="medium">medium</ORadio>
        <ORadio value="small">small</ORadio>
      </ORadioGroup>
    </div>
    <div class="detail-operation">
      <span class="operation-des">隐藏横向滚动条</span>
      <OSwitch v-model="disabledX" />
    </div>
    <div class="detail-operation">
      <span class="operation-des">隐藏纵向滚动条</span>
      <OSwitch v-model="disabledY" />
    </div>
    <div class="detail-operation">
      <span class="operation-des">控制持续的时间</span>
      <OInputNumber v-model="duration" autoWidth round="pill" :step="100" />
    </div>
  </div>
  <div class="demo-scrollbar-usage-wrapper">
    <div class="container" ref="container">
      <div class="section">1</div>
      <div class="section">2</div>
      <div class="section">3</div>
    </div>
    <OScrollbar :target="container" :show-type="showType" :disabledX="disabledX" :disabledY="disabledY" :size="size" :duration="duration" />
  </div>
</template>
<style lang="scss">
.demo-scrollbar-usage-operation {
  .detail-operation {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .operation-des {
    margin-right: 12px;
  }
}
.demo-scrollbar-usage-wrapper {
  position: relative;
  .container {
    width: 100%;
    height: 300px;
    border: 2px solid rgb(111, 45, 234);
    box-sizing: border-box;
    overflow: auto;
  }
  .section {
    height: 75%;
    width: 150%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
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
}
</style>
