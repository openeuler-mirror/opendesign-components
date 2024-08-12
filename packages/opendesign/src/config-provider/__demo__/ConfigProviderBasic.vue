<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { LinkConfigT, OConfigProvider } from '../index';
import TheChild from './TheChild.vue';
import { useLocale, addLocale } from '../../locale';
import { OLink } from '../../link';
import '../../link/style';

const langes = {
  jp: {
    locale: 'ja-JP',
    pagination: {
      goto: '移動',
      page: 'ページ',
      countPerPage: '件/ページ',
      total: '総計 {0} 件',
    },
  },
  en: {
    locale: 'en-US',
    pagination: {
      goto: 'go to',
      page: 'Page',
      countPerPage: ' / Page',
      total: 'Total: {0} {2} {1}',
    },
  },
};

const locale = ref(langes.en);

const select = (lang: string) => {
  locale.value = langes[lang as keyof typeof langes];
};

addLocale(langes);

const setLocale = (lang: string) => {
  useLocale(lang);
};

const linkConfig: LinkConfigT = {
  click: (e, params, attrs) => {
    console.log(e, params, attrs);
  },
};
</script>
<template>
  <h4>&lt;OConfigProvider /&gt;全局配置</h4>
  <section>
    <OButton @click="select('zh')">zh-CN</OButton>
    <OButton @click="select('en')">en-US</OButton>
    <OButton @click="select('jp')">ja-JP</OButton>
  </section>
  <section style="align-items: flex-start">
    <OConfigProvider :locale="locale"> <TheChild /> </OConfigProvider>
  </section>
  <section style="align-items: flex-start">
    <OConfigProvider :link="linkConfig">
      <OLink status="primary" diy="123">OLink</OLink>
    </OConfigProvider>
  </section>

  <h4>JS动态配置</h4>
  <section>
    <OButton @click="setLocale('zh-CN')">zh-CN</OButton>
    <OButton @click="setLocale('en')">en-US</OButton>
    <OButton @click="setLocale('jp')">ja-JP</OButton>
  </section>
  <section style="align-items: flex-start">
    <TheChild />
  </section>
</template>
<style lang="scss"></style>
