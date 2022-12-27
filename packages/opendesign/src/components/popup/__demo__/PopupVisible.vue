<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { PopupPosition, OPopup, PopupTrigger } from '../index';

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
      <OPopup v-model:visible="visible" :position="PopupPosition.TL" :target="btn1">TL {{ content }} </OPopup>
      <OButton ref="btn2" class="btn"> TOP </OButton>
      <OPopup :visible="visible" :position="PopupPosition.BOTTOM" :target="btn2" :trigger="PopupTrigger.NULL">T {{ content }} </OPopup>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.btn {
  margin-left: 100px;
}
</style>
