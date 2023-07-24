<script setup lang="ts">
import { OCard, OButton } from '@components/index';

const cardInfo = {
  href: 'https://www.hiascend.com/',
  cover: 'https://www.hiascend.com/_static3/img_learning_ai.eddae00e.jpg',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
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
