<script setup lang="ts">
import { OCard } from '../index';
import { IconStar } from '../../icons';

const card = {
  cover: 'https://www.hiascend.com/p/resource/202303/0a66367d573f4369a6d160909c33fa6e.png',
  title: '荆棘鸟携手昇腾AI，打造总控室“大屏”变“小屏”的秘密武器',
  content:
    '传统的工厂安全总控室里，都是一整面墙花花绿绿的屏幕，安全员要在屏幕前目不转睛的24小时监督，不但费神费力，还难免疏漏。但现在，这一方小屏就能实现整个工厂的安全监察。',
};
</script>
<template>
  <h4>基本</h4>
  <section>
    <div class="row">
      <OCard class="card col3" asdf :cover="card.cover" :cover-ratio="16 / 9" :title="card.title" :content="card.content" />
      <OCard class="card col3" :cover="card.cover" :cover-ratio="16 / 9" :title="card.title" :content="card.content" hoverable />
    </div>

    <div class="flex">
      <OCard
        class="card col2 card2"
        :cover="card.cover"
        :cover-ratio="16 / 9"
        :title="card.title"
        :content="card.content"
        layout="h"
        cover-class="card-cover"
        :title-max-row="1"
        :detail-max-row="2"
      >
        <template #actions>
          <div class="actions">
            <div class="date">2023/02/09</div>
            <div class="btns">
              <div class="btn"><IconStar /> 文本</div>
            </div>
          </div>
        </template>
      </OCard>
    </div>
    <div>
      <OCard
        class="card card2"
        :cover="card.cover"
        :cover-ratio="16 / 9"
        size="large"
        :title="card.title"
        :content="card.content"
        layout="h"
        cover-class="card-cover"
      >
        <template #actions>
          <div class="actions">
            <div class="date">2023/02/09</div>
            <div class="btns">
              <div class="btn"><IconStar /> 文本</div>
            </div>
          </div>
        </template>
      </OCard>
    </div>

    <div class="flex">
      <OCard class="card col3" :title="card.title" :content="card.content" />
      <OCard class="card col3" :title="card.title" :content="card.content" hoverable>
        <template #actions>
          <div class="actions">
            <div class="date">2023/02/09</div>
            <div class="btns">
              <div class="btn"><IconStar /> 文本</div>
            </div>
          </div>
        </template>
      </OCard>
    </div>
    <div class="flex">
      <OCard class="card col3" hoverable>
        <div class="card-icon">
          <div class="icon"><IconStar /></div>
          <div>
            <div class="title">{{ card.title }}</div>
            <div class="btns">{{ card.content }}</div>
          </div>
        </div>
      </OCard>
    </div>
  </section>
</template>
<style lang="scss">
.flex {
  display: flex;
  gap: 8px;
}
.row {
  gap: 8px;
}
.col2 {
  width: calc(50% - 4px);
}
.col3 {
  width: calc(33.333% - 5px);
}
.col4 {
  width: calc(25% - 6px);
}
.actions {
  // margin-top: ;
  display: flex;
  justify-content: space-between;
}
.card2 {
  // height: 260px;
}
.card-icon {
  display: flex;
  align-items: flex-start;
  .icon {
    font-size: 60px;
    margin-right: 12px;
  }
  .title {
    font-size: 20px;
    margin-bottom: 12px;
  }
}
</style>
