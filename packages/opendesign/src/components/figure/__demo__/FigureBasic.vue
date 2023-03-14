<script setup lang="ts">
import { OFigure } from '../index';
</script>
<template>
  <h4>基本</h4>
  <section>
    <OFigure class="img" src="https://foruda.gitee.com/avatar/1677182905922288888/9670565_devin-cwd_1644483194.png!avatar60" />
    <OFigure class="img" src="https://foruda.gitee.com/avatar/1677182905922288888/9670565_devin-cwd_1644483194.png!avatar60" :ratio="16 / 9" fit="contain" />
    <OFigure class="img" src="https://foruda.gitee.com/avatar/1677182905922288888/9670565_devin-cwd_16444831941.png!avatar601" :ratio="16 / 9" fit="cover" />
    <OFigure
      class="img"
      src="https://foruda.gitee.com/avatar/1677182905922288888/9670565_devin-cwd_1644483194.png!avatar60"
      :ratio="16 / 9"
      fit="cover"
      background
    />
  </section>
</template>
<style lang="scss">
.dlg-action {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}
.img {
  width: 100px;
}
</style>
