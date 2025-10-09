import { ExtractPropTypes, PropType } from 'vue';
export interface RowMediaT {
  gap?: string;
  gapY?: string;
  gapX?: string;
}
export interface ColMediaT {
  flex: string;
}

export const rowProps = {
  /**
   * @zh-CN display是否为inline-flex
   * @en-US display is inline-flex
   */
  inline: {
    type: Boolean,
  },
  /**
   * @zh-CN 同 align-items
   * @en-US Same as align-items
   */
  align: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'inherit' | 'initial'>,
  },
  /**
   * @zh-CN 同 justify-content
   * @en-US Same as justify-content
   */
  justify: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'inherit' | 'initial'>,
  },
  /**
   * @zh-CN 同 flex-wrap
   * @en-US Same as flex-wrap
   * @default 'wrap'
   */
  wrap: {
    type: String as PropType<'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit'>,
    default: 'wrap',
  },
  /**
   * @zh-CN 同 flex-direction
   * @en-US Same as flex-direction
   */
  direction: {
    type: String as PropType<'row' | 'row-reverse' | 'column' | 'column-reverse'>,
  },
  /**
   * @zh-CN 同 gap
   * @en-US Same as gap
   */
  gap: {
    type: String,
  },
  /**
   * @zh-CN 同 column-gap
   * @en-US Same as column-gap
   */
  gapX: {
    type: String,
  },
  /**
   * @zh-CN 同 row-gap
   * @en-US Same as row-gap
   */
  gapY: {
    type: String,
  },
  /**
   * @zh-CN 该断点下的gap值
   * @en-US The gap value at this breakpoint
   * @media (max-width: 1680px)
   */
  pcS: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @zh-CN 该断点下的gap值
   * @en-US The gap value at this breakpoint
   * @media (max-width: 1440px)
   */
  laptop: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @zh-CN 该断点下的gap值
   * @en-US The gap value at this breakpoint
   * @media (max-width: 1200px)
   */
  pad: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @zh-CN 该断点下的gap值
   * @en-US The gap value at this breakpoint
   * @media (max-width: 840px)
   */
  padV: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @zh-CN 该断点下的gap值
   * @en-US The gap value at this breakpoint
   * @media (max-width: 600px)
   */
  phone: {
    type: Object as PropType<RowMediaT>,
  },
};

export const colProps = {
  /**
   * @zh-CN 同 flex
   * @en-US Same as flex
   * @default '1 0 auto'
   */
  flex: {
    type: String,
    default: '1 0 auto',
  },
  /**
   * @zh-CN 同 align-self
   * @en-US Same as align-self
   */
  align: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'inherit' | 'initial'>,
  },
  /**
   * @zh-CN 该断点下的flex值
   * @en-US The flex value at this breakpoint
   * @media (max-width: 1680px)
   */
  pcS: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @zh-CN 该断点下的flex值
   * @en-US The flex value at this breakpoint
   * @media (max-width: 1440px)
   */
  laptop: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @zh-CN 该断点下的flex值
   * @en-US The flex value at this breakpoint
   * @media (max-width: 1200px)
   */
  pad: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @zh-CN 该断点下的flex值
   * @en-US The flex value at this breakpoint
   * @media (max-width: 840px)
   */
  padV: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @zh-CN 该断点下的flex值
   * @en-US The flex value at this breakpoint
   * @media (max-width: 600px)
   */
  phone: {
    type: Object as PropType<ColMediaT>,
  },
};

export type RowPropsT = ExtractPropTypes<typeof rowProps>;
export type ColPropsT = ExtractPropTypes<typeof colProps>;
