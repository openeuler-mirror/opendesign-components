import { ExtractPropTypes, PropType } from 'vue';
export interface RowMediaT {
  gapY: string;
  gapX: string;
}
export interface ColMediaT {
  width: string;
}

export const mediaSize = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

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
   * @media (min-width: 576px)
   */
  xs: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (min-width: 721px)
   */
  s: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (min-width: 1201px)
   */
  m: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (min-width: 1441px)
   */
  l: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (min-width: 1681px)
   */
  xl: {
    type: Object as PropType<RowMediaT>,
  },
  /**
   * @media (min-width: 1920px)
   */
  xxl: {
    type: Object as PropType<RowMediaT>,
  },
};

export const colProps = {
  /**
   * flex-grow
   */
  grow: {
    type: [Number, String],
  },
  /**
   * flex-shrink
   */
  shrink: {
    type: [Number, String],
  },
  /**
   * flex-basic
   */
  width: {
    type: String,
  },
  /**
   * flex
   */
  flex: {
    type: String,
  },
  /**
   * 同 align-self
   */
  align: {
    type: String as PropType<'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | 'inherit' | 'initial'>,
  },
  /**
   * @media (min-width: 576px)
   */
  xs: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (min-width: 721px)
   */
  s: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (min-width: 1201px)
   */
  m: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (min-width: 1441px)
   */
  l: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (min-width: 1681px)
   */
  xl: {
    type: Object as PropType<ColMediaT>,
  },
  /**
   * @media (min-width: 1920px)
   */
  xxl: {
    type: Object as PropType<ColMediaT>,
  },
};

export type RowPropsT = ExtractPropTypes<typeof rowProps>;
export type ColPropsT = ExtractPropTypes<typeof colProps>;
