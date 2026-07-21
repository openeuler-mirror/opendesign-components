/**
 * 虚拟列表测试 DOM 元素查询辅助函数。
 *
 * 封装常用 class selector 查询，统一命名，避免各测试文件重复定义。
 */

/**
 * @description 从渲染结果中获取虚拟列表的根元素
 * @param container render 返回的 container
 * @returns 根元素 .o-virtual-list
 */
export function getRoot(container: Element): HTMLElement {
  return container.querySelector('.o-virtual-list') as HTMLElement;
}

/**
 * @description 从渲染结果中获取 wrapper 元素（滚动容器）
 * @param container render 返回的 container
 * @returns wrapper 元素 .o-virtual-list-wrapper
 */
export function getWrapper(container: Element): HTMLElement {
  return container.querySelector('.o-virtual-list-wrapper') as HTMLElement;
}

/**
 * @description 从渲染结果中获取 body 元素（内容高度容器）
 * @param container render 返回的 container
 * @returns body 元素 .o-virtual-body
 */
export function getBody(container: Element): HTMLElement {
  return container.querySelector('.o-virtual-body') as HTMLElement;
}

/**
 * @description 从渲染结果中获取渲染列表元素
 * @param container render 返回的 container
 * @returns render-list 元素 .o-virtual-render-list
 */
export function getRenderList(container: Element): HTMLElement {
  return container.querySelector('.o-virtual-render-list') as HTMLElement;
}

/**
 * @description 从渲染结果中获取所有渲染项元素
 * @param container render 返回的 container
 * @returns 渲染项元素数组
 */
export function getItems(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll('.o-virtual-render-item'));
}
