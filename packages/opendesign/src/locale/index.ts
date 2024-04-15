import { logger } from '../_utils/log';
import { getValueByPath } from '../_utils/helper';
import { isString } from '../_utils/is';
import { configProviderInjectKey } from '../config-provider';
import { computed, inject, ref } from 'vue';
import zhCN from './lang/zh-cn';
import { LanguageT, i18nLanguages } from './types';

const currentLocal = ref('zh-CN');
const i18nLanguage = ref<Record<string, LanguageT>>({
  'zh-CN': zhCN,
});

/**
 * 添加语言包
 * @param locale 语言包
 * @param opts 配置
 */
export function addLocale(
  locale: i18nLanguages,
  opts?: {
    overwrite?: boolean;
  }
) {
  Object.keys(locale).forEach((key) => {
    if (!i18nLanguage.value[key] || opts?.overwrite) {
      i18nLanguage.value[key] = locale[key];
    }
  });
}

/**
 * 使用语言包
 * @param localeKey
 * @returns
 */
export function useLocale(localeKey: string) {
  if (!i18nLanguage.value[localeKey]) {
    logger.warn(`no ${localeKey} languages found`);
    return;
  }
  currentLocal.value = localeKey;
}

export function useI18n() {
  const configProvider = inject(configProviderInjectKey, {});
  const languages = computed(() => {
    return configProvider?.locale ?? i18nLanguage.value[currentLocal.value];
  });
  const locale = computed(() => languages.value.locale);

  const transform = (key: string, ...args: any[]): string => {
    if (!languages.value) {
      logger.warn('no languages configed');
      return '';
    }
    const value = getValueByPath(languages.value, key);

    // 处理变量替换
    if (args.length > 0 && isString(value)) {
      return value.replace(/{(\d+)}/g, (match, index) => {
        return args[index] ?? match;
      });
    }

    return value;
  };

  return {
    locale,
    t: transform,
  };
}
