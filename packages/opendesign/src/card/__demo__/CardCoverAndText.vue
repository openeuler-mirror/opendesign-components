<script setup lang="ts">
import { OCard } from '../index';
import '../../button/style';
import { OButton } from '../../button';

const cardInfo = {
  cover: 'https://www.openeuler.org/img/banners/20230418-odd.png',
  title: '一文了解openEuler Developer Day2023亮点！',
  href: 'https://www.openeuler.org/',
  detail:
    'openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区发起的顶级开发者峰会。ODD 2023 将于4月20日-21日在上海浦东嘉里大酒店举办。整体大会以线下会议及线上直播方式进行。大会看点满满，赶紧来一睹为快',
};
</script>

<template>
  <h3>图文卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（不带操作按钮）</h4>
      <OCard
        hoverable
        cursor="pointer"
        :cover="cardInfo.cover"
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        :cover-ratio="16 / 9"
        :href="cardInfo.href"
        target="_blank"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（不带操作按钮）</h4>
      <OCard
        hoverable
        cursor="pointer"
        :cover="cardInfo.cover"
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        :cover-ratio="16 / 9"
        layout="h"
        :detai-max-row="2"
        :href="cardInfo.href"
        target="_blank"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（不带操作按钮）</h4>
      <OCard
        hoverable
        cursor="pointer"
        :cover="cardInfo.cover"
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        layout="hr"
        cover-fit="fill"
        :detai-max-row="2"
        :href="cardInfo.href"
        target="_blank"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作按钮）</h4>
      <OCard hoverable :cover="cardInfo.cover" :title="cardInfo.title" :detail="cardInfo.detail" :cover-ratio="16 / 9">
        <template #footer>
          <OButton color="primary" round="pill">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :cover="cardInfo.cover" :title="cardInfo.title" :detail="cardInfo.detail" :cover-ratio="16 / 9">
        <template #footer>
          <OButton color="primary" round="pill">操作按钮1</OButton>
          <OButton color="primary" round="pill">操作按钮2</OButton>
        </template>
      </OCard>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  flex-direction: row;
  align-items: flex-start;
}

.display-item {
  width: 30%;
}

.o-btn + .o-btn {
  margin-left: 16px;
}
</style>
