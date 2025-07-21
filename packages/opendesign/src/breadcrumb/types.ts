import type { ExtractPropTypes, PropType } from 'vue';

export const breadcrumbProps = {
  /**
   * @zh-CN 分隔符字符
   * @en-US Separator character
   */
  separator: {
    type: [String, Number],
  },
};

export const breadcrumbItemProps = {
  /**
   * @zh-CN 链接跳转地址
   * @en-US Link jump address
   */
  href: {
    type: String,
  },
  /**
   * @zh-CN 链接跳转方式
   * @en-US Link jump method
   * @default '_self'
   */
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
    default: '_self',
  },
  /**
   * @zh-CN 路由跳转对象。当使用该参数时，OBreadcrumbItem 会渲染为 RouterLink 组件
   * @en-US Route jump object. When using this parameter, OBreadcrumbItem will render as a RouterLink component
   */
  to: {
    type: [String, Object] as PropType<string | Record<string, unknown>>,
  },
  /**
   * @zh-CN 路由跳转时，是否覆盖浏览器历史记录。该参数会作为 RouterLink 的 replace 属性
   * @en-US Whether to replace the browser history when routing. This parameter will be used as the replace attribute of RouterLink
   * @default false
   */
  replace: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 分隔符字符。会覆盖 OBreadcrumb 的 separator 属性
   * @en-US Separator character. This will override the separator property of OBreadcrumb
   */
  separator: {
    type: [String, Number],
  },
};

export type BreadcrumbPropsT = ExtractPropTypes<typeof breadcrumbProps>;

export type BreadcrumbItemPropsT = ExtractPropTypes<typeof breadcrumbProps>;
