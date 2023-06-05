<script setup lang="ts">
import { OCard, ORate, OButton, OIconTime } from '@components/index';

const cardInfo = {
  href: 'https://www.hikunpeng.com/',
  title: '这是卡片标题',
  detail: '内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本内容文本',
};
</script>
<template>
  <h3>纯文本卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（不带操作）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail" cursor="pointer">
        <template #footer>
          <div class="card-footer">
            <div class="card-rate">
              <ORate color="primary" :default-value="1" readonly :count="1" />
              <span class="card-label">4.0</span>
            </div>
            <div class="card-info">
              <div class="info-item">
                <OIconTime />
                <span class="card-label">文本1</span>
              </div>
              <div class="info-item">
                <OIconTime />
                <span class="card-label">文本2</span>
              </div>
              <div class="info-item">
                <OIconTime />
                <span class="card-label">文本3</span>
              </div>
            </div>
          </div>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>单体卡片（带操作）</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">按钮按钮</OButton>
        </template>
      </OCard>
    </div>

    <div class="display-item">
      <h4>复合卡片</h4>
      <OCard :title="cardInfo.title" :detail="cardInfo.detail">
        <template #footer>
          <OButton round="pill" color="primary" variant="outline">按钮按钮</OButton>
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
.card-label {
  margin-left: 8px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-info {
  display: flex;
}

.info-item + .info-item {
  margin-left: 16px;
}

.o-btn + .o-btn {
  margin-left: 8px;
}
</style>
