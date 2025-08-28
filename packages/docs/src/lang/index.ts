import { useLocale, useI18n, addLocale } from '@opensig/opendesign';
import { computed } from 'vue';
// @opensig/opendesign 未暴露语言包，因此通过路径添加
import enUS from '@opensig/opendesign/locale/lang/en-us';
import enUSPortal from './en-US';
import zhCNPortal from './zh-CN';

addLocale(enUS, { overwrite: true });
addLocale(enUSPortal, { overwrite: true });
addLocale(zhCNPortal, { overwrite: true });



export type LocaleT = 'zh-CN' | 'en-US';
type LocaleItemT = { value: LocaleT; label: string };
export const locales: Array<LocaleItemT> = [
  {
    value: 'zh-CN',
    label: '中文',
  },
  {
    value: 'en-US',
    label: 'English',
  },
];
export const LOCALE_COOKIE_KEY = 'locale';

export const currentLocale = computed(() => {
  const { locale } = useI18n();
  const rlt = locales.find((item) => item.value === locale.value);
  return rlt || locales[0];
});
export const changeLocale = (l: LocaleT) => {
  useLocale(l);
  document.cookie = `${LOCALE_COOKIE_KEY}=${l}; path=/`;
};

