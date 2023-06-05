<script setup lang="ts">
import { OCard, OButton, OIconSkill } from '@components/index';

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
      <h4>单体卡片（不带操作）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" cursor="pointer" :href="cardInfo.href" target="_blank" />
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮1</OButton>
          <OButton round="pill" color="primary" variant="outline">操作按钮2</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>单体卡片（不带操作、横向布局）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" layout="h" cursor="pointer" :href="cardInfo.href" target="_blank" />
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作、横向布局）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" layout="h">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片（横向布局）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" :icon="OIconSkill" layout="hr">
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
