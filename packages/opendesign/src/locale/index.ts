import { log } from '../_utils/log';
import { isArray, isString, isUndefined } from '../_utils/is';
import { configProviderInjectKey } from '../config-provider';
import { computed, inject, ref, getCurrentInstance } from 'vue';
import zhCN from './lang/zh-cn';
import { OpendesignLanguageT, i18nLanguagesT } from './types';

const currentLocal = ref('zh-CN');
const i18nLanguage = ref<Record<string, i18nLanguagesT>>({
  'zh-CN': zhCN,
});

/**
 * 添加语言包
 * @param locale 语言包
 * @param opts 配置
 */
export function addLocale(
  locale: i18nLanguagesT[],
  opts?: {
    overwrite?: boolean;
  }
) {
  const locales = isArray(locale) ? locale : [locale];

  locales.forEach(lc => {
    const currLocal = lc.locale;
    if (!currLocal) {
      return;
    }

    if (!i18nLanguage.value[currLocal]) {
      i18nLanguage.value[currLocal] = {
        locale: lc.locale
      };
    }

    Object.keys(lc).forEach((key) => {
      const k = key as keyof OpendesignLanguageT;
      if (!i18nLanguage.value[currLocal][k] || opts?.overwrite) {
        i18nLanguage.value[currLocal][k] = lc[key];
      }
    });
  });
}

/**
 * 使用语言包
 * @param localeKey
 * @returns
 */
export function useLocale(localeKey: string) {
  if (!i18nLanguage.value[localeKey]) {
    log.warn(`no '${localeKey}' languages configed`);
    return;
  }
  currentLocal.value = localeKey;
}

export function useI18n() {
  const instance = getCurrentInstance();
  // 判断当前是否在组件环境下，如果是，则优先取configProvider的值
  const configProvider = instance ? inject(configProviderInjectKey, {}) : null;
  const languages = computed(() => {
    return configProvider?.locale ?? i18nLanguage.value[currentLocal.value];
  });
  const locale = computed(() => languages.value.locale);

  const transform = (key: string, ...args: any[]): string => {
    if (!languages.value) {
      log.warn('no languages configed');
      return '';
    }
    const value = languages.value[key];

    // 处理变量替换
    if (args.length > 0 && isString(value)) {
      return value.replace(/{(\d+)}/g, (match, index) => {
        return args[index] ?? match;
      });
    }

    if (isUndefined(value)) {
      log.warn(`Cannot translate the value of keypath '${key}'`);
    }

    return value;
  };

  return {
    locale,
    t: transform,
  };
}

export * from './types';
