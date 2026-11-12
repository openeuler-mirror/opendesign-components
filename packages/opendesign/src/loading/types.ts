import { ExtractPropTypes, PropType } from 'vue';
import { layerProps } from '../layer/types';

import { SizeT } from '../_utils/types';

const { maskClose, ...extractProps } = layerProps;

export const loadingProps = {
  ...extractProps,
  /**
   * @zh-CN loading文本
   * @en-US loading text
   */
  label: {
    type: String,
  },
  /**
   * @zh-CN 无障碍标签，为加载层提供可访问名称（未传时回退到 label 文本）
   * @en-US Accessibility label for the loading layer (falls back to the label text when not provided)
   * @since NEXT
   */
  ariaLabel: {
    type: String,
  },
  /**
   * @zh-CN 加载尺寸
   * @en-US loading size
   */
  size: {
    type: String as PropType<SizeT | 'mini'>,
    default: 'small',
  },
  /**
   * @zh-CN 自定义loading图标
   * @en-US Custom loading icon
   */
  icon: {
    type: Object,
  },
  /**
   * @zh-CN 自定义loading图标是否旋转
   * @en-US Whether the custom loading icon is rotating
   */
  iconRotating: {
    type: Boolean,
  },
};

export type LoadingPropsT = ExtractPropTypes<typeof loadingProps>;
