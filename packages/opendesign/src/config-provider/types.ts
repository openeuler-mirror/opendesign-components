import { LinkPropsT } from '../link';
import { i18nLanguagesT } from '../locale/types';
import { ExtractPropTypes, PropType } from 'vue';

export type LanguageConfigT = i18nLanguagesT;
export interface LinkConfigT {
  click: (e: MouseEvent, params: LinkPropsT, attrs: Record<string, any>) => void;
}

export const configProviderProps = {
  /**
   * @zh-CN 语言词条
   * @en-US Language locale
   */
  locale: {
    type: Object as PropType<LanguageConfigT>,
  },
  /**
   * @zh-CN Link 组件全局配置
   * @en-US Global configuration for the Link component
   */
  link: {
    type: Object as PropType<LinkConfigT>,
  },
};

export type ConfigProviderPropsT = ExtractPropTypes<typeof configProviderProps>;