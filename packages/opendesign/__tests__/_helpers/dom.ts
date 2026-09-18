import { nextTick } from 'vue';

/**
 * 等待异步渲染稳定（OScroller / useElementBounding / ResizeObserver 等 RAF 触发）。
 * 调用 exposed 方法或涉及异步定位的组件渲染后必须 flush 再断言。
 */
export async function flush() {
  await nextTick();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
  await nextTick();
}

/**
 * 轮询等待条件满足，替代硬编码 setTimeout。
 * 每次 flush 后检查条件，满足则立即返回；超时则抛出错误。
 * 快机快速返回，慢机自动延长等待，消除 flaky。
 * @param check 条件检查函数，返回 true 时视为满足
 * @param timeout 超时毫秒数，默认 2000
 */
export async function waitFor(check: () => boolean, timeout = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    await flush();
    if (check()) return;
  }
  throw new Error(`waitFor: condition not met within ${timeout}ms`);
}

/**
 * 解析 CSS 自定义属性（token 链变量）的实际 px 值。
 * 用于响应式测试中 token 链变量跨断点变化断言，不硬比对绝对 px。
 */
export function resolveTokenPx(root: HTMLElement, cssVarName: string): number {
  const probe = document.createElement('div');
  probe.style.fontSize = `var(${cssVarName})`;
  root.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return px;
}
