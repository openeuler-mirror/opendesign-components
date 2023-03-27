import { ExtractPropTypes, PropType } from 'vue';

export const dialogProps = {
  /**
   * 控制对话框是否显示
   */
  modelValue: {
    type: Boolean,
  },
  /**
   * 挂载容器，默认为body
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: 'body',
  },
  /**
   * 是否隐藏可以关闭
   */
  hideClose: {
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
   * 挂载容器，默认为body
   */
  wrapClass: {
    type: String,
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
};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
