import { ExtractPropTypes, PropType } from 'vue';

export const layerProps = {
  /**
   * @zh-CN 控制浮层是否显示，双向绑定属性
   * @en-US Controls whether the layer is displayed, two-way binding property
   */
  visible: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 浮层挂载的节点，值为 null 时挂载到父容器
   * @en-US The mount node for the overlay component. When set to null, it mounts to the parent container.
   * @default 'body'
   */
  wrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 是否在隐藏是卸载组件
   * @en-US Whether to unmounted the component when hidden
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 默认插槽父容器的自定义类名
   * @en-US Custom class name for default slot's parent container
   */
  mainClass: {
    type: [String, Array] as PropType<string | any[]>,
    default: '',
  },
  /**
   * @zh-CN 自定义内容盒子的过度动画
   * @en-US Custom transition for content box
   * @default 'o-zoom-fade2'
   */
  mainTransition: {
    type: String,
    default: 'o-zoom-fade2',
  },
  /**
   * @zh-CN 自定义遮罩层的过度动画
   * @en-US Custom transition for mask
   * @default 'o-fade-in'
   */
  maskTransition: {
    type: String,
    default: 'o-fade-in',
  },
  /**
   * @zh-CN 内容盒子缩放动画的 transform-origin 的值，'mouse' 表示鼠标点击的位置，'css' 表示使用 --layer-origin 变量（默认值 center）
   * @en-US Set the value of transform-origin to main box scaling animation; 'mouse' indicates the mouse click position, 'css' indicates using the --layer-origin variable (default: center)
   * @default 'mouse'
   */
  transitionOrign: {
    type: String as PropType<'mouse' | 'css'>,
    default: 'mouse',
  },
  /**
   * @zh-CN 是否渲染遮罩层
   * @en-US Whether to render the mask
   * @default true
   */
  mask: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 点击遮罩层时是否关闭浮层
   * @en-US Whether to close the layer when clicking the mask
   * @default true
   */
  maskClose: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否渲染浮层的关闭按钮
   * @en-US Whether to render the close button of the layer
   * @default false
   */
  buttonClose: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 浮层打开前的回调，返回 false 表示取消打开浮层，否则打开浮层
   * @en-US Callback before the layer is opened, returning false means canceling the opening of the layer, otherwise opening the layer
   */
  beforeShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 浮层关闭前的回调，返回 false 表示取消关闭浮层，否则关闭浮层
   * @en-US Callback before the layer is closed, returning false means canceling the closing of the layer, otherwise close the layer
   */
  beforeHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export type LayerPropsT = ExtractPropTypes<typeof layerProps>;
