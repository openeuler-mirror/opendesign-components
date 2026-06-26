import { easeInOutCubic } from './easing';
import { throttleRAF } from './helper';
import { isArray, isFunction, isWindow } from './is';
import { PositionT } from './types';

export type ScrollTarget = HTMLElement | Window | Document;

export function isDocument(val: unknown): val is Document {
  return val instanceof Document || val?.constructor.name === 'HTMLDocument';
}

export function isHtmlElement(el: unknown): el is HTMLElement {
  if (typeof HTMLElement === 'object') {
    return el instanceof HTMLElement;
  } else if (el && typeof el === 'object') {
    const ele = el as HTMLElement;
    return (ele.nodeType === 1 || ele.nodeType === 9) && typeof ele.nodeName === 'string';
  }
  return false;
}

// 获取真实相对父元素  当body没有设置position时，返回html
export function getOffsetElement(el: HTMLElement) {
  const offsetEl = el.offsetParent;
  if (offsetEl && offsetEl.tagName === 'BODY') {
    const stylePosition = window.getComputedStyle(document.body).getPropertyValue('position');
    if (stylePosition === 'static') {
      return document.documentElement;
    }
  }
  return offsetEl;
}

// 获取元素scroll值
export function getScroll(el: ScrollTarget) {
  const rlt = {
    scrollLeft: 0,
    scrollTop: 0,
  };

  if (!el) {
    return rlt;
  }

  if (isWindow(el)) {
    rlt.scrollLeft = window.scrollX;
    rlt.scrollTop = window.scrollY;
  } else if (isDocument(el)) {
    rlt.scrollLeft = el.documentElement.scrollLeft;
    rlt.scrollTop = el.documentElement.scrollTop;
  } else {
    rlt.scrollLeft = el.scrollLeft;
    rlt.scrollTop = el.scrollTop;
  }

  return rlt;
}

/**
 * 获取元素的所有可滚动的父元素
 * @param el - 起始 HTML 元素
 * @returns 从当前元素向上遍历找到的所有可滚动父元素数组（不包含 document.documentElement）
 */
export function getScrollParents(el: HTMLElement) {
  const parents: Array<HTMLElement> = [];
  let ele: HTMLElement | null = el?.parentElement;
  while (ele && ele !== document.documentElement) {
    const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = ele;
    if (offsetHeight < scrollHeight || offsetWidth < scrollWidth) {
      parents.push(ele);
    }
    ele = ele.parentElement;
  }
  return parents;
}

/**
 * 从触发事件的目标元素向上遍历 DOM 树，查找第一个包含指定类名的元素
 * @param target - 事件触发的原始 DOM 元素（e.target）
 * @param className - 要查找的目标类名（纯类名字符串，无需带 .）
 * @param rootContainer - 遍历的根边界容器（遍历到该容器则停止，不再向上查找）
 * @returns 找到的带指定类名的元素 | 未找到则返回 null
 * @example
 * // 假设父容器是 #parent-container，点击了目标元素的子span
 * const parent = document.getElementById('parent-container');
 * const target = findClosestElementWithClass(e.target, 'target-item', parent);
 * if (target) { console.log('找到目标元素：', target); }
 */
export function findClosestElementWithClass(target: EventTarget | null, className: string, rootContainer: HTMLElement): HTMLElement | null {
  // 类型守卫：确保 target 是 HTMLElement 类型（排除文本节点、注释节点等）
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  let currentElement: HTMLElement | null = target;

  // 向上遍历直到找到目标类名元素，或遍历到根容器为止
  while (currentElement && currentElement !== rootContainer) {
    // 检查当前元素是否包含目标类名（兼容 classList 存在的情况）
    if (currentElement.classList && currentElement.classList.contains(className)) {
      return currentElement;
    }
    // 向上查找父元素（仅取 HTMLElement 类型的父元素）
    currentElement = currentElement.parentElement;
  }

  // 未找到符合条件的元素
  return null;
}

export function getRelativeBounding(e: DOMRect, c: DOMRect) {
  return {
    top: e.top,
    bottom: e.bottom,
    left: e.left,
    right: e.right,
    width: e.width,
    height: e.height,
    offsetLeft: e.left - c.left,
    offsetTop: e.top - c.top,
    offsetRight: e.right - c.left,
    offsetBottom: e.bottom - c.top,
  };
}

export type RelativeRect = ReturnType<typeof getRelativeBounding>;

export function getElementSize(el: HTMLElement | Window) {
  return {
    width: (el as Window).innerWidth || (el as HTMLElement).clientWidth,
    height: (el as Window).innerHeight || (el as HTMLElement).clientHeight,
    offsetWidth: (el as Window).innerWidth || (el as HTMLElement).offsetWidth,
    offsetHeight: (el as Window).innerHeight || (el as HTMLElement).offsetHeight,
  };
}

/**
 * 用requestAnimationFrame确保布局完成后获取元素尺寸
 * IOS下table内的元素不会马上渲染给出高度
 */
export function getElementRectByRAF(el: HTMLElement) {
  return new Promise<DOMRect>((resolve) => {
    const checkLayout = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) {
        resolve(rect);
      } else {
        requestAnimationFrame(checkLayout);
      }
    };
    requestAnimationFrame(checkLayout);
  });
}

export function getElementBorder(el: HTMLElement, dir?: PositionT | PositionT[]) {
  const style = window.getComputedStyle(el);
  let d: PositionT[] = [];

  if (typeof dir === 'string') {
    d = [dir];
  } else {
    d = isArray(dir) ? dir : ['left', 'right', 'bottom', 'top'];
  }
  const rlt: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  } = {};
  d.forEach((k) => {
    rlt[k] = parseFloat(style.getPropertyValue(`border-${k}-width`));
  });
  return rlt;
}

export function getCssVariable(key: string, el?: HTMLElement) {
  const ele = el ? el : document.documentElement;
  return window.getComputedStyle(ele).getPropertyValue(key);
}

export function supportTouch() {
  return 'ontouchstart' in window;
}

interface ScrollTopOptions {
  container?: ScrollTarget;
  duration?: number;
}

// 取消上一次未完全执行的滚动事件
let cancelScrollRAF: Function | null = null;

export function scrollTo(y: number, opts: ScrollTopOptions) {
  const { container = window, duration = 450 } = opts;
  const { scrollTop } = getScroll(container);
  const startTime = Date.now();

  if (isFunction(cancelScrollRAF)) {
    cancelScrollRAF();
    cancelScrollRAF = null;
  }

  return new Promise((resolve) => {
    const frameFn = () => {
      const timeStamp = Date.now();
      const time = timeStamp - startTime;
      const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);

      if (isWindow(container)) {
        window.scrollTo({
          left: window.scrollX,
          top: nextScrollTop,
          behavior: 'instant',
        });
      } else if (isDocument(container)) {
        container.documentElement.scrollTop = nextScrollTop;
      } else {
        container.scrollTop = nextScrollTop;
      }

      if (time < duration) {
        const fn = throttleRAF(frameFn);
        cancelScrollRAF = fn.cancel;
        fn();
      } else {
        // 滚动事件可能未执行完成，故下一帧执行resolve
        throttleRAF(resolve)();
      }
    };

    throttleRAF(frameFn)();
  });
}

/* 判断元素自身内容是否超出其盒子边界（scrollWidth/scrollHeight > clientWidth/clientHeight），即文字等内容被 overflow:hidden 截断的场景。与 checkElementOverflow 不同，后者检测的是元素位置相对于滚动父容器可视区域的越界 */
export function isOverflown(element?: HTMLElement) {
  if (!element) {
    return false;
  }
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

/**
 * 判断元素是否在视口内
 */
export function isInViewport(element?: Element) {
  if (!element) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  );
}

/**
 * 判断是否为不可见标签
 */
export function isNonVisibleTag(element: Element) {
  const nonVisibleTags = ['SCRIPT', 'STYLE', 'LINK', 'META', 'HEAD'];
  return nonVisibleTags.includes(element.tagName);
}

/**
 * 判断元素是否在视觉上隐藏
 */
export function isElementHidden(element: HTMLElement) {
  // 直接检查内联样式
  if (element.style.display === 'none' || element.style.visibility === 'hidden') {
    return true;
  }

  // 通过getComputedStyle检查计算样式
  const computedStyle = window.getComputedStyle(element);
  if (
    computedStyle.display === 'none' ||
    computedStyle.visibility === 'hidden' ||
    computedStyle.opacity === '0' ||
    computedStyle.width === '0px' ||
    computedStyle.height === '0px'
  ) {
    return true;
  }

  // 检查元素是否在视口外或尺寸为0
  const rect = element.getBoundingClientRect();
  return rect.width === 0 || rect.height === 0;
}

/**
 * 判断元素左右边界是否超出滚动父元素的可视区域，并计算超出的像素值
 * @param {HTMLElement} options.element - 目标元素
 * @param {HTMLElement} options.parentElement - 目标父元素， 可选
 * @param {number} options.threshold - 阈值，可选，如果溢出值大于阈值才算溢出
 * @returns 包含是否超出、超出左侧/右侧像素值的结果
 */
export function checkElementOverflowHorizontal(options: { element: HTMLElement; parentElement?: HTMLElement; threshold?: number }) {
  const { element, parentElement, threshold = 0 } = options;

  if (!(element instanceof HTMLElement)) {
    throw new Error('参数必须是有效的HTMLElement');
  }

  const scrollParent = parentElement ? parentElement : getScrollParents(element)[0];
  if (!scrollParent) {
    return {
      isOverflowLeft: false,
      isOverflowRight: false,
      overflowLeft: 0,
      overflowRight: 0,
    };
  }

  const elementRect = element.getBoundingClientRect();
  const parentRect = scrollParent.getBoundingClientRect();

  // 元素相对父元素左偏移 = 元素视口左坐标 - 父元素视口左坐标 + 父元素滚动距离
  const elementLeftRelativeToParent = elementRect.left - parentRect.left + scrollParent.scrollLeft;
  // 元素相对父元素右偏移 = 左偏移 + 元素宽度
  const elementRightRelativeToParent = elementLeftRelativeToParent + elementRect.width;

  const parentVisibleLeft = scrollParent.scrollLeft; // 可视区左边界
  const parentVisibleRight = scrollParent.scrollLeft + scrollParent.clientWidth; // 可视区右边界

  const overflowLeft = parentVisibleLeft - elementLeftRelativeToParent;
  const isOverflowLeft = overflowLeft > threshold;

  const overflowRight = elementRightRelativeToParent - parentVisibleRight;
  const isOverflowRight = overflowRight > threshold;

  return { isOverflowLeft, isOverflowRight, overflowLeft, overflowRight };
}

/**
 * 判断元素上下边界是否超出滚动父元素的可视区域，并计算超出的像素值
 * @param {HTMLElement} options.element - 目标元素
 * @param {HTMLElement} options.parentElement - 目标父元素， 可选
 * @param {number} options.threshold - 阈值，可选，如果溢出值大于阈值才算溢出
 * @returns 包含是否超出、超出上下像素值的结果
 */
export function checkElementOverflowVertical(options: { element: HTMLElement; parentElement?: HTMLElement; threshold?: number }) {
  const { element, parentElement, threshold = 0 } = options;

  if (!(element instanceof HTMLElement)) {
    throw new Error('参数必须是有效的HTMLElement');
  }

  const scrollParent = parentElement ? parentElement : getScrollParents(element)[0];
  if (!scrollParent) {
    return {
      isOverflowTop: false,
      isOverflowBottom: false,
      overflowTop: 0,
      overflowBottom: 0,
    };
  }

  const elementRect = element.getBoundingClientRect();
  const parentRect = scrollParent.getBoundingClientRect();

  // 元素相对父元素上偏移 = 元素视口上坐标 - 父元素视口上坐标 + 父元素垂直滚动距离
  const elementTopRelativeToParent = elementRect.top - parentRect.top + scrollParent.scrollTop;
  // 元素相对父元素下偏移 = 上偏移 + 元素高度
  const elementBottomRelativeToParent = elementTopRelativeToParent + elementRect.height;

  const parentVisibleTop = scrollParent.scrollTop; // 父元素可视区上边界
  const parentVisibleBottom = scrollParent.scrollTop + scrollParent.clientHeight; // 父元素可视区下边界

  const overflowTop = parentVisibleTop - elementTopRelativeToParent;
  const isOverflowTop = overflowTop > threshold;

  const overflowBottom = elementBottomRelativeToParent - parentVisibleBottom;
  const isOverflowBottom = overflowBottom > threshold;

  return {
    isOverflowTop,
    isOverflowBottom,
    overflowTop,
    overflowBottom,
  };
}

/**
 * 判断元素四个边界是否超出滚动父容器的可视区域，并计算各方向超出的像素值。与 isOverflown 不同，后者检测的是元素自身内容是否超出自身盒子边界
 * @param {HTMLElement} options.element - 目标元素
 * @param {HTMLElement} options.parentElement - 目标父元素，可选，不传则取最近的滚动父元素
 * @param {number} options.threshold - 阈值，可选，超出值大于阈值才算溢出（可用于规避浮点误差）
 * @returns 包含是否超出、各方向超出像素值的结果
 */
export function checkElementOverflow(options: { element: HTMLElement; parentElement?: HTMLElement; threshold?: number }) {
  return {
    ...checkElementOverflowHorizontal(options),
    ...checkElementOverflowVertical(options),
  };
}
