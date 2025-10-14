<docs lang="md">
  <!-- zh-CN -->

### 骨架屏显示与隐藏

  <!-- en-US -->

### Display and hide of the skeleton screen.
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const img = 'https://www.openeuler.org/img/banners/20230418-odd.png';

const loading = ref(true);
</script>
<template>
  <div class="demo-skeleton-loading-wrap">
    <OSwitch v-model="loading" class="operation" />
    <OSkeleton animation :loading="loading">
      <template #template>
        <OSkeletonFigure />
        <OSkeletonAvatar size="large" />
        <OSkeletonText :rows="3" />
      </template>
      <div class="content">
        <OFigure class="img" :src="img" />
        <OFigure class="avatar" :src="img" />
        <div class="text">
          <p>截止2023年12月31日，openEuler社区用户累计超过213万</p>
          <p>超过17,000名开发者在社区持续贡献。社区累计产生 149.4K个PRs、75.2K条Issues</p>
          <p>截至目前，加入 openEuler 社区的单位成员超过1400家，12月新增141家。</p>
        </div>
      </div>
    </OSkeleton>
  </div>
</template>
<style lang="scss">
.demo-skeleton-loading-wrap {
  .operation {
    margin-bottom: 24px;
  }

  .content {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    line-height: 24px;
    color: #000;

    p {
      margin: 0;
    }

    .text {
      margin-top: 24px;
    }

    .img {
      width: 320px;
      height: 180px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      margin-top: 24px;
      border-radius: 50%;
    }
  }
}
</style>
