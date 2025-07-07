<script setup lang="ts">
import { OCard, OButton, OIconSkill } from '@opendesign-src/index';

const cardInfo = {
  href: 'https://www.hikunpeng.com/',
  cover: 'https://www.hikunpeng.com/p/resource/202306/6e26c5f1192f4d2f8f2873735d57c154.png',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
};
</script>
<template>
  <h3>图标卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（不带操作按钮）</h4>
      <OCard
        hoverable
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        :icon="OIconSkill"
        cursor="pointer"
        :href="cardInfo.href"
        target="_blank"
        class="c-card-kunpeng"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（居中）</h4>
      <OCard
        hoverable
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        :icon="OIconSkill"
        cursor="pointer"
        :href="cardInfo.href"
        target="_blank"
        class="c-card-kunpeng"
        :style="{ '--card-icon-text-align': 'center', '--card-title-text-align': 'center', '--card-detail-text-align': 'center' }"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作按钮）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" class="c-card-kunpeng">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" class="c-card-kunpeng">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮1</OButton>
          <OButton round="pill" color="primary" variant="outline">操作按钮2</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>单体卡片（不带操作按钮、横向布局、Icon传图片）</h4>
      <OCard
        hoverable
        :title="cardInfo.title"
        :detail="cardInfo.detail"
        icon="https://www.hikunpeng.com/_static3/dev-plat.bc24a9e5.png"
        layout="h"
        cursor="pointer"
        :href="cardInfo.href"
        target="_blank"
        class="c-card-kunpeng"
      />
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作按钮、横向布局）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" layout="h" class="c-card-kunpeng">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片（横向布局）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" layout="hr" class="c-card-kunpeng">
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
  align-items: flex-start;
}

.display-item {
  width: 30%;
}

.o-btn + .o-btn {
  margin-left: 16px;
}
</style>
