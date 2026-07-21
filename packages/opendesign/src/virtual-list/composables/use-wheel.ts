import { onBeforeUnmount, onMounted, type Ref } from 'vue';
import { until } from '@vueuse/core';

import type { AxisSelector } from '../utils/alignment';

/**
 * @description wheel 边界处理配置
 */
export interface UseWheelOpts {
  /** 滚动容器引用 */
  wrapperRef: Ref<HTMLElement | undefined>;
  /** 是否水平布局 */
  isHorizontal: Ref<boolean>;
  /** 轴选择器 */
  axis: AxisSelector;
}

/**
 * @description wheel 边界处理——列表到顶/底时阻止滚轮冒泡到父级
 *
 * 当列表已到达边界且滚轮方向一致时 preventDefault，否则放行。
 * 水平布局用 deltaX，shift+wheel 转换 deltaY→deltaX。
 * @param opts 配置项
 */
export function useWheel(opts: UseWheelOpts) {
  const { wrapperRef, isHorizontal, axis } = opts;

  /**
   * @description wheel 事件处理器
   */
  const onWheel = (e: WheelEvent) => {
    const el = wrapperRef.value;
    if (!el) {
      return;
    }
    const scrollPos = axis.getScroll(el);
    const maxScroll = axis.getScrollSize(el) - axis.getClientSize(el);
    const atStartEdge = scrollPos <= 0;
    const atEndEdge = scrollPos >= maxScroll;
    const delta = isHorizontal.value ? e.deltaX || (e.shiftKey ? e.deltaY : 0) : e.deltaY;

    if ((atStartEdge && delta < 0) || (atEndEdge && delta > 0)) {
      e.preventDefault();
    }
  };

  onMounted(() => {
    until(wrapperRef)
      .toBeTruthy()
      .then(() => {
        wrapperRef.value?.addEventListener('wheel', onWheel, { passive: false });
      });
  });

  onBeforeUnmount(() => {
    wrapperRef.value?.removeEventListener('wheel', onWheel);
  });
}
