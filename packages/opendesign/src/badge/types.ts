import type { ExtractPropTypes, PropType } from 'vue';

export const BadgeColorTypes = ['primary', 'success', 'warning', 'danger'] as const;
export type BadgeColorT = (typeof BadgeColorTypes)[number];

export const badgeProps = {
  /**
   * @zh-CN 徽标内容
   * @en-US Content of the badge
   */
  value: {
    type: [String, Number],
    default: '',
  },
  /**
   * @zh-CN 最大值，超过最大值显示${max}+(仅当 value 类型为 number 时生效)
   * @en-US Max value, display ${max}+ if exceeded (only effective when value type is number)
   * @default 99
   */
  max: {
    type: Number,
    default: 99,
  },
  /**
   * @zh-CN 徽标颜色
   * @en-US Color of the badge
   * @default 'primary'
   */
  color: {
    type: String as PropType<BadgeColorT>,
    default: 'primary',
  },
  /**
   * @zh-CN 是否显示为小红点
   * @en-US Whether to display as a small red dot
   * @default false
   */
  dot: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 徽标位置偏移量
   * @en-US Badge position offset
   */
  offset: {
    type: Array as PropType<Array<number | string>>,
    default: () => [],
  },
  /**
   * @zh-CN 无障碍标签，透传到徽标元素；dot 模式缺省回退 "new"。计数模式下设置后将覆盖默认播报名，
   * 慎与 role=status 播报语义组合
   * @en-US Accessibility label forwarded to the badge element; falls back to "new" in dot
   * mode. In count mode, setting this overrides the default announced name—use with care
   * alongside role=status announcements
   * @since NEXT
   */
  ariaLabel: {
    type: String,
  },
};

export type BadgePropsT = ExtractPropTypes<typeof badgeProps>;
