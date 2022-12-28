<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { PopupPosition, OPopup, PopupTrigger } from '../index';

const content = 'this is popup content';
const btn1 = ref(null);
const btn2 = ref(null);
const btn3 = ref(null);
const btn4 = ref(null);
const btn5 = ref(null);
const btn6 = ref(null);
const btn7 = ref(null);
const btn8 = ref(null);
const btn9 = ref(null);
const visible = ref(true);
</script>
<template>
  <h4>popup container</h4>
  <div id="wrap">
    <div class="content">
      <OButton ref="btn1" class="btn1">TL btn1 </OButton>
      <OButton ref="btn2" class="btn2">TR btn2 </OButton>
      <OButton ref="btn3" class="btn3">TL btn3 </OButton>
      <OButton ref="btn4" class="btn4">LT btn4 </OButton>
      <OButton ref="btn5" class="btn5">TL btn5 </OButton>
      <OButton ref="btn6" class="btn6">TL btn6 </OButton>
      <OButton ref="btn7" class="btn7">LEFT btn7 </OButton>
      <OButton ref="btn8" class="btn8">BL btn8 </OButton>
      <OButton ref="btn9" class="btn9">TL btn9 </OButton>

      <OPopup :position="PopupPosition.TL" :target="btn1" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.TR" :target="btn2" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup v-model:visible="visible" :position="PopupPosition.TL" :target="btn3" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.LT" :target="btn4" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.TL" :target="btn5" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.TL" :target="btn6" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.LEFT" :target="btn7" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.BL" :target="btn8" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div class="tip">{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
      <OPopup :position="PopupPosition.TL" :target="btn9" wrapper="#wrap" :trigger="PopupTrigger.CLICK">
        <div>{{ content }}</div>
        <div>{{ content }}</div>
      </OPopup>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#wrap {
  height: 120vh;
  width: 50vw;
  overflow: auto;
  border: 10px solid #333;
  position: relative;
  z-index: 10;
  background-color: #eee;
  // overflow: visible;
}
.content {
  height: 140vh;
  width: 60vw;

  position: relative;
  :deep(.o-btn) {
    position: absolute;
  }
}
.tip {
  white-space: nowrap;
}
.btn1 {
  left: 0;
  top: 0;
}
.btn2 {
  left: 80px;
  top: 0;
}
.btn3 {
  right: 0;
  top: 0;
}
.btn4 {
  left: 0;
  top: 11vh;
}
.btn5 {
  left: 20vw;
  top: 15vh;
}
.btn6 {
  right: 0;
  top: 15vh;
}
.btn7 {
  left: 0;
  bottom: 0;
}
.btn8 {
  left: 45vw;
  // bottom: 0;
  top: 100vh;
}
.btn9 {
  right: 0;
  bottom: 0;
}
</style>
