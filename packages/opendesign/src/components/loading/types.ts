import { ExtractPropTypes, PropType } from 'vue';

export const loadingProps = {
  /**
   * 是否显示
   */
  show: {
    type: Boolean,
  },
  /**
   * 是否在隐藏时unmout
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * 过渡名称
   */
  transition: {
    type: String,
    default: 'o-zoom-fade',
  },
  /**
   * 是否需要mask
   */
  mask: {
    type: Boolean,
    default: true,
  },
  /**
   * 点击mask是否可关闭
   */
  maskClose: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined,
  },
};

export type LoadingPropsT = ExtractPropTypes<typeof loadingProps>;
