export type Direction = 'left' | 'right' | 'top' | 'bottom';

export function isElement(el: any) {
  return (typeof HTMLElement === 'object')
    ? (el instanceof HTMLElement)
    : !!(el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9) && typeof el.nodeName === 'string');
}

export function isDocumentElement(el: HTMLElement | Window) {
  return el === window || ['HTML'].includes((el as HTMLElement).tagName);
}

export function getScroll(el: HTMLElement | Window = window) {
  if (!el) {
    return {
      scrollLeft: 0,
      scrollTop: 0
    };
  }
  const isroot = isDocumentElement(el);
  return {
    scrollLeft: isroot ? window.scrollX : (el as HTMLElement).scrollLeft,
    scrollTop: isroot ? window.scrollY : (el as HTMLElement).scrollTop,
  };
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
export type RelativeRect = ReturnType<typeof getRelativeBounding>

export function getElementSize(el: HTMLElement | Window) {
  return {
    width: (el as Window).innerWidth || (el as HTMLElement).clientWidth,
    height: (el as Window).innerHeight || (el as HTMLElement).clientHeight,
    offsetWidth: (el as Window).innerWidth || (el as HTMLElement).offsetWidth,
    offsetHeight: (el as Window).innerHeight || (el as HTMLElement).offsetHeight,
  };
}

export function getElementBorder(el: HTMLElement, dir?: Direction | Direction[]) {
  const style = window.getComputedStyle(el);
  let d: Direction[] = [];

  if (typeof dir === 'string') {
    d = [dir];
  } else {
    d = Array.isArray(dir) ? dir : ['left', 'right', 'bottom', 'top'];
  }
  const rlt: {
    left?: number,
    right?: number,
    top?: number,
    bottom?: number,
  } = {};
  d.forEach(k => {
    rlt[k] = parseFloat(style.getPropertyValue(`border-${k}-width`));
  });
  return rlt;
}