import { ExtractPropTypes, PropType } from 'vue';

export const layerProps = {
  /**
   * 控制对话框是否显示
   * v-model
   */
  visible: {
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
   * 是否在隐藏时unmout
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * body自定义class
   */
  mainClass: {
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
  /**
   * 点击mask关闭
   */
  maskClose: {
    type: Boolean,
    default: true,
  },
};

export type LayerPropsT = ExtractPropTypes<typeof layerProps>;
