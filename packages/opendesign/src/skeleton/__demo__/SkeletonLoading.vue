<script setup lang="ts">
import { ref } from 'vue';
import { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure } from '../index';

import '../../switch/style';
import { OSwitch } from '../../switch';

import '../../figure/style';
import { OFigure } from '../../figure';

const loading = ref(true);

const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';
</script>

<template>
  <h4>Loading</h4>
  <section>
    <OSwitch v-model="loading" />

    <OSkeleton animation :loading="loading">
      <template #template>
        <OSkeletonFigure />
        <OSkeletonAvatar />
        <OSkeletonText />
      </template>
      <div class="content">
        <OFigure class="img" :src="img" />
        <OFigure class="avatar" :src="img" />
        <div class="text" :style="{ 'margin-top': '24px' }">
          <p>截止2023年12月31日，openEuler社区用户累计超过213万</p>
          <p>超过17,000名开发者在社区持续贡献。社区累计产生 149.4K个PRs、75.2K条Issues</p>
          <p>截至目前，加入 openEuler 社区的单位成员超过1400家，12月新增141家。</p>
        </div>
      </div>
    </OSkeleton>
  </section>
</template>

<style lang="scss" scoped>
section {
  display: block;
  background-color: var(--o-color-fill2);
}
.content {
  display: flex;
  flex-direction: column;
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
  color: var(--o-color-info1);

  p {
    margin: 0;
  }

  .img {
    width: 320px;
    height: 180px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
}
</style>
