import { LinkPropsT } from 'src/link';
import { LanguageT } from '../locale/types';
import { ExtractPropTypes, PropType } from 'vue';

export type LanguageConfigT = LanguageT;
export interface LinkConfigT {
  click: (e: MouseEvent, params: LinkPropsT, attrs: Record<string, any>) => void;
}

export const configProviderProps = {
  /**
   * 语言词条
   */
  locale: {
    type: Object as PropType<LanguageConfigT>,
  },
  /**
   * Link组件全局配置
   */
  link: {
    type: Object as PropType<LinkConfigT>,
  },
};

export type ConfigProviderPropsT = ExtractPropTypes<typeof configProviderProps>;
