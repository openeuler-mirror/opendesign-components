<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';
const btn1 = ref(null);
const btn2 = ref(null);
const visible = ref(false);
setTimeout(() => {
  visible.value = true;
}, 2000);
</script>
<template>
  <h4>popup visible</h4>
  <section>
    <div class="row">visible: {{ visible }}</div>
    <div>
      <OButton ref="btn1" class="btn">Button</OButton>
      <OPopup v-model:visible="visible" position="tl" :target="btn1">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
      <OButton ref="btn2" class="btn"> TOP </OButton>
      <OPopup :visible="visible" position="bottom" :target="btn2" trigger="none">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.btn {
  margin-left: 100px;
}
.popup-box {
  background-color: var(--popup-bg);
  box-shadow: var(--popup-shadow);
  padding: 4px 8px;
  border-radius: var(--popup-radius);
  border: 1px solid red;
}
</style>
