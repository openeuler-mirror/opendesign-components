<script setup lang="ts">
import { OCard } from '../index';
import { IconStar } from '../../icon';

const card = {
  cover: 'https://www.openeuler.org/img/banners/20230418-odd.png',
  title: '一文了解openEuler Developer Day2023亮点！',
  content:
    'openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区发起的顶级开发者峰会。ODD 2023 将于4月20日-21日在上海浦东嘉里大酒店举办。整体大会以线下会议及线上直播方式进行。大会看点满满，赶紧来一睹为快',
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
      <OCard
        class="card col2 card2"
        :cover="card.cover"
        :cover-ratio="16 / 9"
        :title="card.title"
        :content="card.content"
        layout="hr"
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
      <OCard class="card col3" hoverable style="height: 350px">
        <template #main>
          <div class="card-icon">
            <div class="icon"><IconStar /></div>
            <div>
              <div class="title">{{ card.title }}</div>
              <div class="btns">{{ card.content }}</div>
            </div>
          </div>
          1123
        </template>
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
