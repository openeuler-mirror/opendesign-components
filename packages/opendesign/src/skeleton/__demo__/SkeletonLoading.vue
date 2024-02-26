<script setup lang="ts">
import { ref } from 'vue';
import { OSkeleton } from '../index';

import '../../switch/style';
import { OSwitch } from '../../switch';

const loading = ref(true);
</script>

<template>
  <h4>Loading</h4>
  <section>
    <OSwitch v-model="loading" />

    <OSkeleton animation :loading="loading">
      <div class="content">
        <p>截止2023年12月31日，openEuler社区用户累计超过213万</p>
        <p>超过17,000名开发者在社区持续贡献。社区累计产生 149.4K个PRs、75.2K条Issues</p>
        <p>截至目前，加入 openEuler 社区的单位成员超过1400家，12月新增141家。</p>
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
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
  color: var(--o-color-info1);

  p {
    margin: 0;
  }
}
</style>
