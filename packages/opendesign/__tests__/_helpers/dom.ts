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
