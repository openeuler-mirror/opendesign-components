import { isArray } from './is';

export type DirectionT = 'left' | 'right' | 'top' | 'bottom';

export function isElement(el: any) {
  return typeof HTMLElement === 'object'
    ? el instanceof HTMLElement
    : !!(el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9) && typeof el.nodeName === 'string');
}

export function isDocumentElement(el: HTMLElement | Window) {
  return el === window || ['HTML'].includes((el as HTMLElement).tagName);
}
// 获取真实相对父元素  当body没有设置position时，返回html
export function getOffsetElement(el: HTMLElement) {
  let offsetEl = el.offsetParent;
  if (offsetEl && offsetEl.tagName === 'BODY') {
    const stylePosition = window.getComputedStyle(document.body).getPropertyValue('position');
    if (stylePosition === 'static') {
      return document.documentElement;
    }
  }
  return offsetEl;
}
// 获取元素scroll值
export function getScroll(el: HTMLElement | Window = window) {
  if (!el) {
    return {
      scrollLeft: 0,
      scrollTop: 0,
    };
  }
  const isroot = isDocumentElement(el);
  return {
    scrollLeft: isroot ? window.scrollX : (el as HTMLElement).scrollLeft,
    scrollTop: isroot ? window.scrollY : (el as HTMLElement).scrollTop,
  };
}
// 获取元素的可滚动的父元素
export function getScrollParents(el: HTMLElement) {
  const parents: Array<HTMLElement> = [];
  let ele: HTMLElement | null = el;
  while (ele && ele !== document.documentElement) {
    const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = ele;
    if (offsetHeight < scrollHeight || offsetWidth < scrollWidth) {
      parents.push(ele);
    }
    ele = ele.parentElement;
  }
  return parents;
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

export function getElementBorder(el: HTMLElement, dir?: DirectionT | DirectionT[]) {
  const style = window.getComputedStyle(el);
  let d: DirectionT[] = [];

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
  return ele.style.getPropertyValue(key);
}

export function supportTouch() {
  return 'ontouchstart' in window;
}
