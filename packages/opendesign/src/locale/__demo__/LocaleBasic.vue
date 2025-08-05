<script setup lang="ts">
import { useI18n, useLocale, addLocale, i18nLanguagesT } from '../../index';
import { OButton } from '../../button';
import '../../button/style';

const { t, locale } = useI18n();

const langes: i18nLanguagesT[] = [{
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
},
{
  locale: 'zh-CN',
  'pagination.countPerPage': 'xxxx',
}
];

// JS动态全局配置
addLocale(langes, { overwrite: true });


const setLocale = (lang: string) => {
  useLocale(lang);
};
</script>
<template>
  <section>
    <OButton @click="setLocale('zh-CN')">zh-CN</OButton>
    <OButton @click="setLocale('en-US')">en-US</OButton>
  </section>
  <div>locale: {{ locale }}</div>
  <div>pagination.goto: {{ t('pagination.goto') }}</div>
  <div>pagination.page: {{ t('pagination.page') }}</div>
  <div>pagination.countPerPage: {{ t('pagination.countPerPage') }}</div>
  <div>pagination.total: {{ t('pagination.total', 100, 1, 2) }}</div>
  <div>无此条（common.missing）: {{ t('common.missing') }}</div>
</template>
<style lang="scss"></style>
