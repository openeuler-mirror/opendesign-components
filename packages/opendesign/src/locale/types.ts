import zhCN from './lang/zh-cn.ts';
import enUS from './lang/en-us.ts';

export type OpendesignLanguageT = {
  [key in keyof typeof zhCN & keyof typeof enUS]: string;
};

export interface i18nLanguagesT {
  locale: string;
  [k: string]: string;
}
