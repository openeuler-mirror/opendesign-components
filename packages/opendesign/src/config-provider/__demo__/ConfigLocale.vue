<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OConfigProvider } from '../index';
import TheChild from './TheChild.vue';
import '../../link/style';
import { useI18n, useLocale } from '../../locale';

const langes = [{
  locale: 'ja-JP',
  'pagination.goto': '移動',
  'pagination.page': 'ページ',
  'pagination.countPerPage': '件/ページ',
  'pagination.total': '総計 {0} 件',
},
{
  locale: 'en-US',
  'pagination.goto': 'go to',
  'pagination.page': 'Page',
  'pagination.countPerPage': ' / Page',
  'pagination.total': 'Total: {0} {2} {1}',
  'select.cancel': 'cacsssss'
},
{
  locale: 'zh-CN',
  'select.cancel': 'cacsssss'
}
];

const locale = ref();

const select = (lang: string) => {
  locale.value = langes.find(item => item.locale === lang);
  useLocale(lang);
};

const { locale: currentLocale } = useI18n();
select(currentLocale.value);


</script>
<template>
  <h4>&lt;OConfigProvider /&gt;配置词条</h4>
  <section>
    <OButton @click="select('zh-CN')">zh-CN</OButton>
    <OButton @click="select('en-US')">en-US</OButton>
    <OButton @click="select('ja-JP')">ja-JP</OButton>
  </section>
  <section style="align-items: flex-start">
    <OConfigProvider :locale="locale">
      <TheChild />
    </OConfigProvider>
  </section>
  <p>未设置ConfigProvider</p>
  <section style="align-items: flex-start">
    <TheChild />
  </section>
</template>
<style lang="scss"></style>
