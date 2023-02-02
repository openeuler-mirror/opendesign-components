/**
 * 触发元素事件
 */
export function trigger(el: HTMLElement, type: string) {
  const evt = new Event(type, {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
}