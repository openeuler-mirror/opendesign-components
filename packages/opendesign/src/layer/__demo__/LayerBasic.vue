<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OLayer } from '../index';

const wrapperRef = ref<HTMLElement | null>(null);
const show1 = ref(false);

const toggle1 = (show?: boolean) => {
  if (show === undefined) {
    show1.value = !show1.value;
  } else {
    show1.value = show;
  }
};
const show2 = ref(false);
const toggle2 = (show?: boolean) => {
  if (show === undefined) {
    show2.value = !show2.value;
  } else {
    show2.value = show;
  }
};

const show3 = ref(false);
const toggle3 = (show?: boolean) => {
  if (show === undefined) {
    show3.value = !show3.value;
  } else {
    show3.value = show;
  }
};

const show4 = ref(false);
const toggle4 = (show?: boolean) => {
  if (show === undefined) {
    show4.value = !show4.value;
  } else {
    show4.value = show;
  }
};

const onChane = (v: boolean) => {
  console.log('dialog change', v);
};
</script>
<template>
  <h4>基本</h4>
  <section ref="wrapperRef" class="wrap">
    <OButton @click="toggle1(true)">Open</OButton>
    <OLayer v-model:visible="show1" :unmount-on-hide="false" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle1()">Close</OButton>
      </div>
    </OLayer>

    <OButton @click="toggle2(true)">Open unmount-on-hide</OButton>
    <OLayer v-model:visible="show2" :unmount-on-hide="true" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle2()">Close</OButton>
      </div>
    </OLayer>
    <OButton @click="toggle3(true)">Open to Section</OButton>
    <OButton class="center" @click="toggle3(true)">Open to Section</OButton>
    <OButton class="left" @click="toggle3(true)">Open to Section</OButton>
    <OLayer v-model:visible="show3" :wrapper="wrapperRef" transition-orign="css" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle3()">Close</OButton>
      </div>
    </OLayer>
    <OButton @click="toggle4(true)">Open to Parent</OButton>
    <OLayer v-model:visible="show4" :wrapper="null" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle4()">Close</OButton>
      </div>
    </OLayer>
  </section>
  <section class="wrap">
    <OButton @click="toggle1(true)">Open</OButton>
    <OButton @click="toggle2(true)">Open unmount-on-hide</OButton>
    <OButton @click="toggle3(true)">Open to Section</OButton>
    <OButton @click="toggle4(true)">Open to Parent</OButton>
  </section>
</template>
<style lang="scss" scoped>
.box {
  padding: 24px;
  background-color: var(--o-color-control-light);
}
.wrap {
  height: 100vh;
  align-items: flex-start;
  position: relative;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
}
.left {
  position: absolute;
  left: 0;
  top: 50%;
}
</style>
