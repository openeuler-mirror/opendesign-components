import { getCurrentInstance, onUnmounted, ref } from 'vue';

/**
 * @description 滚动状态机配置
 */
export interface ScrollStateOpts {
  /** 滚动停止后的重置延迟（毫秒） */
  resetDelay?: number;
}

/**
 * @description 滚动状态机——管理 isScrolling 标志和 RAF 一致化
 *
 * 滚动中 isScrolling=true，停止后 resetDelay 毫秒重置为 false。
 * 用于 pointer-events 优化和 RAF 一致化。
 * @param opts 配置项
 * @returns isScrolling ref + markScrolling 方法 + cleanup
 */
export function useScrollState(opts: ScrollStateOpts = {}) {
  const { resetDelay = 150 } = opts;

  /** 滚动状态标志 */
  const isScrolling = ref(false);
  let endTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * @description 标记滚动开始——设 true 并安排停止后重置
   */
  const markScrolling = () => {
    isScrolling.value = true;
    if (endTimer) {
      clearTimeout(endTimer);
    }
    endTimer = setTimeout(() => {
      isScrolling.value = false;
      endTimer = undefined;
    }, resetDelay);
  };

  /** @description 清理定时器和 RAF */
  const cleanup = () => {
    if (endTimer) {
      clearTimeout(endTimer);
    }
  };

  // 仅在组件 setup 上下文中注册 onUnmounted，纯函数调用时跳过（测试环境兼容）
  if (getCurrentInstance()) {
    onUnmounted(cleanup);
  }

  return { isScrolling, markScrolling, cleanup };
}
