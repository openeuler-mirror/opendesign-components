import type { ExtractPropTypes, PropType } from 'vue';

export const breadcrumbProps = {
  /**
   * 分隔符字符
   */
  separator: {
    type: [String, Number],
  },
};

export type TargetTypeT = '_blank' | '_self' | '_parent' | '_top';

export const breadcrumbItemProps = {
  /**
   * 链接跳转地址
   */
  href: {
    type: String,
  },
  /**
   * 链接跳转方式
   */
  target: {
    type: String as PropType<TargetTypeT>,
    default: '_self',
  },
  /**
   * 路由跳转对象
   */
  to: {
    type: [String, Object] as PropType<string | Record<string, unknown>>,
  },
  /**
   * 路由跳转时，是否覆盖浏览器历史记录
   */
  replace: {
    type: Boolean,
    default: false,
  },
  /**
   * 分隔符字符
   */
  separator: {
    type: [String, Number],
  },
};

export type BreadcrumbPropsT = ExtractPropTypes<typeof breadcrumbProps>;

export type BreadcrumbItemPropsT = ExtractPropTypes<typeof breadcrumbProps>;
