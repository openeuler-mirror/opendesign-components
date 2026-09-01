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
 * 构造携带 pageX/pageY 的 MouseEvent。
 * @description MouseEventInit 类型未声明 pageX/pageY（DOM 类型限制），
 * 通过中间变量绕过对象字面量冗余属性检查；jsdom 运行时支持从构造参数读取。
 * @param type 事件类型（如 'mousedown'）
 * @param pageX 页面 X 坐标
 * @param pageY 页面 Y 坐标
 * @param init 其余 MouseEventInit 属性
 * @returns 携带坐标的 MouseEvent 实例
 */
export function createMouseEvent(type: string, pageX: number, pageY: number, init: MouseEventInit = {}): MouseEvent {
  const eventInit: MouseEventInit & { pageX?: number; pageY?: number } = { ...init, pageX, pageY };
  return new MouseEvent(type, eventInit);
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
