<script setup lang="ts">
import { OFigure } from '../index';
import { OIconSearch } from '../../icon-components';
import { ref } from 'vue';
const img1 = 'https://picsum.photos/400/600';
const img2 = 'https://picsum.photos/1920/1080';

const figureRef = ref<typeof OFigure | null>(null);
const preivewImg = () => {
  if (figureRef.value) {
    figureRef.value.preview();
  }
};

const onpreview = (visible: boolean) => {
  console.log('preview:', visible);
};

const figureRef2 = ref<typeof OFigure | null>(null);
const closePreviewManully = () => {
  if (figureRef2.value) {
    figureRef2.value.preview(false);
  }
};
</script>
<template>
  <h4>Preview</h4>
  <section>
    <div>
      <span>preview-close=""</span>
      <OFigure class="img" :src="img1" preview @preview="onpreview" />
    </div>
    <div>
      <span>preview-close="mask"</span>
      <OFigure class="img" :src="img1" preview @preview="onpreview" preview-close="mask" />
    </div>
    <div>
      <span>preview-close="button"</span>
      <OFigure class="img" :src="img1" preview @preview="onpreview" preview-close="button" />
    </div>
    <div>
      <span>preview-close="button"</span>
      <OFigure class="img" :src="img2" preview @preview="onpreview" preview-close="button" />
    </div>
    <div>
      <span>preview-close="image"</span>
      <OFigure class="img" :src="img2" preview @preview="onpreview" preview-close="image">
        <template #preview-extra>
          <div class="foot">123</div>
        </template>
      </OFigure>
    </div>
    <div>
      <span>preview-close="['mask', 'button']"</span>
      <OFigure class="img" :src="img1" preview @preview="onpreview" :preview-close="['mask', 'button']" />
    </div>
    <div>
      <span>preview-close="['mask', 'button', 'image']"</span>
      <OFigure class="img" :src="img1" preview @preview="onpreview" :preview-close="['mask', 'button', 'image']">
        <template #preview-extra>123</template>
      </OFigure>
    </div>
    <div>
      <span>preview-close="none"</span>
      <OFigure class="img" ref="figureRef2" :src="img2" preview @preview="onpreview" preview-close="none">
        <template #preview-extra><button @click="closePreviewManully">关闭</button></template>
      </OFigure>
    </div>
    <div>
      <span>使用api调用preivew</span>
      <OFigure ref="figureRef" class="img" :src="img2" lazy-preiew>
        <OIconSearch class="zoomIn" @click="preivewImg" />
      </OFigure>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.img {
  width: 25%;
  border: 1px solid #ddd;
  position: relative;
}
.zoomIn {
  position: absolute;
  right: 0;
  bottom: 0;
  color: red;
  font-size: 32px;
  cursor: pointer;
}
.foot {
  padding: 12px;
  background: #fff;
  display: flex;
}
</style>
