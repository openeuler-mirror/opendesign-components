<script setup lang="ts">
import { OFigure, OIconArrowTraingleRight } from '@components/index';

const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';

const onVideoClick = () => {
  alert('开始播放视频');
};
</script>
<template>
  <h4>固定 宽高比/填充方式</h4>
  <OFigure style="width: 25%" :src="img" fit="contain" />
  <OFigure style="width: 25%" :src="img" :ratio="16 / 9" fit="contain" />
  <OFigure style="width: 25%" :src="img" :ratio="4 / 3" fit="cover" />
  <OFigure style="width: 25%" src="123" />
  <h4>可交互</h4>
  <OFigure style="width: 25%" hoverable :src="img" />
  <h4>图片链接</h4>
  <OFigure style="width: 25%" href="openEuler" target="__blank" :src="img" />
  <h4>图片可预览</h4>
  <OFigure style="width: 25%" :src="img" preview />
  <h4>视频</h4>
  <OFigure style="width: 25%" :src="img" hoverable class="figure-video" @click="onVideoClick">
    <div class="video-poster-mask">
      <div class="video-play-btn">
        <OIconArrowTraingleRight />
      </div>
    </div>
  </OFigure>
</template>
<style lang="scss">
.figure-video {
  position: relative;
  --figure-radius: 16px;
}

.video-poster-mask {
  background-color: rgba($color: #000000, $alpha: 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
}
.video-play-btn {
  box-sizing: border-box;
  --play-btn-size: 48px;
  font-size: var(--play-btn-size);
  width: var(--play-btn-size);
  height: var(--play-btn-size);
  border-radius: 50%;
  color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.2);
  border: 1px solid rgba($color: #fff, $alpha: 0.6);
  backdrop-filter: blur(1px);
}
</style>
