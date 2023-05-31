import { ExtractPropTypes, PropType } from 'vue';

export const layerProps = {
  /**
   * 控制对话框是否显示
   * v-model
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * 挂载容器，默认为body, null代表当前父元素
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
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
    type: [String, Array] as PropType<string | any[]>,
    default: '',
  },
  /**
   * main过渡名称
   */
  mainTransition: {
    type: String,
    default: 'o-zoom-fade2',
  },
  /**
   * mask过渡名称
   */
  maskTransition: {
    type: String,
    default: 'o-fade-in',
  },
  /**
   * mask过渡名称
   */
  transitionOrign: {
    type: String as PropType<'mouse' | 'css'>,
    default: 'mouse',
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
  /**
   * 显示前回调，根据返回值判断是否显示, false: 不显示； true|undefined: 显示
   */
  beforeShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * 隐藏前回调，根据返回值判断是否隐藏，false: 不隐藏； true|undefined: 隐藏
   */
  beforeHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export type LayerPropsT = ExtractPropTypes<typeof layerProps>;
