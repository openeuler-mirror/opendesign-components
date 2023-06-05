<script setup lang="ts">
import { OCard, OTag, ORate, OButton } from '@components/index';

const cardInfo = {
  href: 'https://www.hiascend.com/',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
};
</script>
<template>
  <h3>纯文本卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（无操作按钮）</h4>
      <OCard hoverable cursor="pointer" class="g-ascend-card-hover" :detail="cardInfo.detail" :href="cardInfo.href" target="_blank">
        <template #header>
          <span :style="{ fontWeight: 500 }">{{ cardInfo.title }}</span>
          <div class="card-tags">
            <OTag class="card-tag">标签1</OTag>
            <OTag class="card-tag">标签2</OTag>
            <OTag class="card-tag">标签3</OTag>
          </div>
        </template>
        <template #footer>
          <ORate color="primary" :default-value="1" readonly :count="1" />
          <span class="card-label">4.0</span>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>单体卡片（有操作按钮）</h4>
      <OCard hoverable class="g-ascend-card-hover" :detail="cardInfo.detail">
        <template #header>
          <span :style="{ fontWeight: 500 }">{{ cardInfo.title }}</span>
          <div class="card-tags">
            <OTag class="card-tag">标签1</OTag>
            <OTag class="card-tag">标签2</OTag>
            <OTag class="card-tag">标签3</OTag>
          </div>
        </template>
        <template #footer>
          <OButton color="primary">操作按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" class="g-ascend-card-hover">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">操作按钮1</OButton>
          <OButton round="pill" color="primary" variant="outline">操作按钮2</OButton>
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
.card-tags {
  margin-top: 8px;
}

.card-tag + .card-tag {
  margin-left: 8px;
}

.card-label {
  color: var(--o-color-info2);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
  margin-left: 8px;
}

.o-btn + .o-btn {
  margin-left: 8px;
}
</style>

<style lang="scss"></style>
