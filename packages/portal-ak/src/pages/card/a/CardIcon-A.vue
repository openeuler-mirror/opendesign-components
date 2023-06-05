<script setup lang="ts">
import { OCard, OIconStar, OButton } from '@components/index';

const cardInfo = {
  href: 'https://www.hiascend.com/',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
};
</script>
<template>
  <h3>图标卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（带操作）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconStar" class="card-title-color-unchanged">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">按钮按钮</OButton>
        </template>
      </OCard>
    </div>
    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconStar" class="card-title-color-unchanged">
        <template #footer>
          <OButton round="pill" color="primary" variant="solid">按钮按钮</OButton>
          <OButton round="pill" color="primary" variant="outline">按钮按钮</OButton>
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
