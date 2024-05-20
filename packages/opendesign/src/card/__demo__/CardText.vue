<script setup lang="ts">
import { OCard } from '../index';
import '../../rate/style';
import { ORate } from '../../rate';
import '../../button/style';
import { OButton } from '../../button';
import '../../tag/style';
import { OTag } from '../../tag';

const cardInfo = {
  cover: 'https://www.openeuler.org/img/banners/20230418-odd.png',
  title: '一文了解openEuler Developer Day2023亮点！',
  href: 'https://www.openeuler.org/',
  detail:
    'openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区发起的顶级开发者峰会。ODD 2023 将于4月20日-21日在上海浦东嘉里大酒店举办。整体大会以线下会议及线上直播方式进行。大会看点满满，赶紧来一睹为快',
};
</script>
<template>
  <h3>纯文本卡片</h3>
  <section>
    <div class="display-item">
      <h4>单体卡片（无操作按钮）</h4>
      <OCard hoverable cursor="pointer" :detail="cardInfo.detail" :href="cardInfo.href" target="_blank">
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
      <h4>复合卡片</h4>
      <OCard hoverable :title="cardInfo.title" :detail="cardInfo.detail">
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
