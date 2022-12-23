export function isElement(el: any) {
  return (typeof HTMLElement === 'object')
    ? (el instanceof HTMLElement)
    : !!(el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9) && typeof el.nodeName === 'string');
}

export function isRootEl(el: HTMLElement | Window) {
  return el === window || ['BODY', 'HTML'].includes((el as HTMLElement).tagName);
}

export function getScroll(el: HTMLElement | Window = window) {
  if (!el) {
    return {
      left: 0,
      top: 0
    };
  }
  const isroot = isRootEl(el);
  return {
    left: isroot ? window.scrollX : (el as HTMLElement).scrollLeft,
    top: isroot ? window.scrollY : (el as HTMLElement).scrollTop,
  };
}
export function getRelativeBounding(el: HTMLElement, c: DOMRect) {
  const e = el.getBoundingClientRect();
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