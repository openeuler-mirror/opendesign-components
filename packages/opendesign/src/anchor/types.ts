import type { ExtractPropTypes, PropType } from 'vue';

export const anchorProps = {
  container: {
    type: [String, Object] as PropType<string | HTMLElement | Window>,
  },
  bounds: {
    type: Number,
    default: 5,
  },
  targetOffset: {
    type: Number,
    default: 0,
  },
  changeHash: {
    type: Boolean,
    default: true,
  },
};

export const anchorItemProps = {
  title: {
    type: String,
    default: '',
  },
  href: {
    type: String,
    default: '',
    required: true,
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
    default: '_self',
  },
};

export type AnchorContainerT = HTMLElement | Window;

export type AnchorPropsT = ExtractPropTypes<typeof anchorProps>;
export type AnchorItemPropsT = ExtractPropTypes<typeof anchorItemProps>;
