import { LanguageT } from '../locale/types';
import { ExtractPropTypes, PropType } from 'vue';

export const configProviderProps = {
  /**
   * 语言词条
   */
  locale: {
    type: Object as PropType<LanguageT>,
  },
};

export type ConfigProviderPropsT = ExtractPropTypes<typeof configProviderProps>;
