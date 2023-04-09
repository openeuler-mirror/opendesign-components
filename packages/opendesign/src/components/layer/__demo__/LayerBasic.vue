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
    <OLayer v-model:visible="show3" :wrapper="wrapperRef" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle3()">Close</OButton>
      </div>
    </OLayer>
  </section>
</template>
<style lang="scss" scoped>
.box {
  padding: 24px;
  background-color: var(--o-color-control-light);
}
.wrap {
  height: 200vh;
  align-items: flex-start;
  position: relative;
}
</style>
