<script setup lang="ts">
import { OCard } from '../index';
import '../../button/style';
import { OButton } from '../../button';
import { OIconStar } from '../../icon-components';

const cardInfo = {
  cover: 'https://www.openeuler.org/img/banners/20230418-odd.png',
  title: '一文了解openEuler Developer Day2023亮点！',
  detail:
    'openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区发起的顶级开发者峰会。ODD 2023 将于4月20日-21日在上海浦东嘉里大酒店举办。整体大会以线下会议及线上直播方式进行。大会看点满满，赶紧来一睹为快',
};
</script>
<template>
  <h3>图标卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（带操作，非响应式）</h4>
      <OCard no-responsive hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconStar" />
    </div>
    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconStar">
        <template #footer>
          <OButton round="pill" color="primary">操作按钮1</OButton>
          <OButton round="pill" color="primary">操作按钮2</OButton>
        </template>
      </OCard>
    </div>
  </section>
</template>
<style lang="scss" scoped>
section {
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.o-btn + .o-btn {
  margin-left: 16px;
}
</style>
