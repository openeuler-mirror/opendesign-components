import type { InjectionKey, Ref, SetupContext } from 'vue';
import type { TourStepPropsT } from './types';

/**
 * @description OTour 与 OTourStep 之间的上下文注入键
 */
export interface TourContext {
  /** @description 当前步骤的 props */
  currentStep: Ref<TourStepPropsT | undefined>;
  /** @description 当前步骤索引 */
  current: Ref<number>;
  /** @description 步骤总数 */
  total: Ref<number>;
  /** @description 是否显示关闭按钮 */
  showClose: Ref<boolean>;
  /** @description 插槽 */
  slots: SetupContext['slots'];
  /** @description 更新 visible */
  updateVisible(value: boolean): void;
  /** @description 关闭回调 */
  onClose(): void;
  /** @description 完成回调 */
  onFinish(): void;
}

export const tourKey: InjectionKey<TourContext> = Symbol('OTour');
