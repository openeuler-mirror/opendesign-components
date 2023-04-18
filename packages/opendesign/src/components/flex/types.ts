import { ExtractPropTypes, PropType } from 'vue';
export interface FlexMediaT {
  gap?: string;
  gapY?: string;
  gapX?: string;
}
export interface FlexItemMediaT {
  flex: string;
}

export const flexProps = {
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
   * @media (max-width: 576px)
   */
  xs: {
    type: Object as PropType<FlexMediaT>,
  },
  /**
   * @media (max-width: 720px)
   */
  sm: {
    type: Object as PropType<FlexMediaT>,
  },
  /**
   * @media (max-width: 1200px)
   */
  md: {
    type: Object as PropType<FlexMediaT>,
  },
  /**
   * @media (max-width: 1440px)
   */
  lg: {
    type: Object as PropType<FlexMediaT>,
  },
  /**
   * @media (max-width: 1680px)
   */
  xl: {
    type: Object as PropType<FlexMediaT>,
  },
};

export const flexItemProps = {
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
   * @media (max-width: 576px)
   */
  xs: {
    type: Object as PropType<FlexItemMediaT>,
  },
  /**
   * @media (max-width: 721px)
   */
  sm: {
    type: Object as PropType<FlexItemMediaT>,
  },
  /**
   * @media (max-width: 1201px)
   */
  md: {
    type: Object as PropType<FlexItemMediaT>,
  },
  /**
   * @media (max-width: 1441px)
   */
  lg: {
    type: Object as PropType<FlexItemMediaT>,
  },
  /**
   * @media (max-width: 1681px)
   */
  xl: {
    type: Object as PropType<FlexItemMediaT>,
  },
};

export type FlexPropsT = ExtractPropTypes<typeof flexProps>;
export type FlexItemPropsT = ExtractPropTypes<typeof flexItemProps>;
