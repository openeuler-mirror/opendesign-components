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
   * 是否为inline-flex
   */
  inline: {
    type: Boolean,
  },
  /**
   * 同 align-items
   */
  align: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'inherit' | 'initial'>,
  },
  /**
   * 同 justify-content
   */
  justify: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'inherit' | 'initial'>,
  },
  /**
   * flex-wrap
   */
  wrap: {
    type: String as PropType<'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit'>,
    default: 'wrap',
  },
  /**
   * flex-direction
   */
  direction: {
    type: String as PropType<'row' | 'row-reverse' | 'column' | 'column-reverse'>,
  },
  /**
   * gapX
   */
  gap: {
    type: String,
  },
  /**
   * gapX
   */
  gapX: {
    type: String,
  },
  /**
   * gapY
   */
  gapY: {
    type: String,
  },
  /**
   * @media (max-width: 600px)
   */
  phone: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (max-width: 840px)
   */
  padV: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (max-width: 1200px)
   */
  pad: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (max-width: 1440px)
   */
  laptop: {
    type: Object as PropType<RowMediaT>,
  },
};

export const colProps = {
  /**
   * flex-grow
   */
  flex: {
    type: String,
    default: '1 0 auto',
  },
  /**
   * 同 align-self
   */
  align: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'inherit' | 'initial'>,
  },
  /**
   * @media (max-width: 600px)
   */
  phone: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (max-width: 840px)
   */
  padV: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (max-width: 1200px)
   */
  pad: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (max-width: 1440px)
   */
  laptop: {
    type: Object as PropType<ColMediaT>,
  },
};

export type RowPropsT = ExtractPropTypes<typeof rowProps>;
export type ColPropsT = ExtractPropTypes<typeof colProps>;
