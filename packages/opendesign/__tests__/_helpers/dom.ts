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
 * 构造携带 clientX/clientY 的模拟 Touch 事件。
 * @description Playwright Chromium 环境下 TouchEvent 构造函数可能不可用或
 * TouchList 无法直接构造，通过 Event + Object.defineProperty 模拟。
 * 组件代码仅访问 touches[0].clientX/clientY 和 touches.length，
 * 不依赖 TouchList 原型方法，因此该模拟可满足测试需求。
 * @param type 事件类型（'touchstart' | 'touchmove' | 'touchend'）
 * @param coords 触摸点坐标列表
 * @returns 模拟的 Touch 事件
 */
export function createTouchEvent(type: string, coords: Array<{ clientX: number; clientY: number }>): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touches = coords.map((c, i) => ({
    identifier: i,
    target: event.target ?? document.body,
    clientX: c.clientX,
    clientY: c.clientY,
    pageX: c.clientX,
    pageY: c.clientY,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 1,
  }));
  // touchend 时 touches 应为空，changedTouches 保留最后位置
  const touchList = type === 'touchend' ? [] : touches;
  const changedList = touches;
  Object.defineProperty(event, 'touches', { value: touchList, writable: false });
  Object.defineProperty(event, 'changedTouches', { value: changedList, writable: false });
  Object.defineProperty(event, 'targetTouches', { value: touchList, writable: false });
  return event;
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
