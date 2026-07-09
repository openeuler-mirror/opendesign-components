/**
 * _utils/dom.ts DOM 操作工具函数测试。
 *
 * 覆盖 isDocument / isHtmlElement / getScroll / getScrollParents /
 * findClosestElementWithClass / getRelativeBounding / getElementSize /
 * getElementBorder / getCssVariable / isOverflown / isInViewport /
 * isNonVisibleTag / isElementHidden / checkElementOverflow。
 */
import { test, expect, describe } from 'vitest';
import {
  isDocument,
  isHtmlElement,
  getScroll,
  getScrollParents,
  findClosestElementWithClass,
  getRelativeBounding,
  getElementSize,
  getElementBorder,
  getCssVariable,
  isOverflown,
  isNonVisibleTag,
  isElementHidden,
  checkElementOverflow,
  checkElementOverflowHorizontal,
  checkElementOverflowVertical,
} from './dom';

describe('isDocument', () => {
  test('isDocument - document 返回 true', () => {
    expect(isDocument(document)).toBe(true);
  });
  test('isDocument - 非文档返回 false', () => {
    expect(isDocument(document.createElement('div'))).toBe(false);
    expect(isDocument(null)).toBe(false);
  });
});

describe('isHtmlElement', () => {
  test('isHtmlElement - HTMLElement 返回 true', () => {
    const el = document.createElement('div');
    expect(isHtmlElement(el)).toBe(true);
  });
  test('isHtmlElement - 非元素返回 false', () => {
    expect(isHtmlElement(null)).toBe(false);
    expect(isHtmlElement('text')).toBe(false);
  });
});

describe('getScroll', () => {
  test('getScroll - null 返回 {0, 0}', () => {
    const result = getScroll(null as any);
    expect(result).toEqual({ scrollLeft: 0, scrollTop: 0 });
  });
  test('getScroll - HTMLElement 返回元素 scroll 值', () => {
    const el = document.createElement('div');
    el.style.width = '200px';
    el.style.height = '200px';
    el.style.overflow = 'scroll';
    const inner = document.createElement('div');
    inner.style.width = '400px';
    inner.style.height = '400px';
    el.appendChild(inner);
    document.body.appendChild(el);
    el.scrollLeft = 50;
    el.scrollTop = 100;
    expect(getScroll(el)).toEqual({ scrollLeft: 50, scrollTop: 100 });
    el.remove();
  });
});

describe('getScrollParents', () => {
  test('getScrollParents - 无可滚动父元素时返回空数组', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);
    expect(getScrollParents(child)).toEqual([]);
    parent.remove();
  });
});

describe('findClosestElementWithClass', () => {
  test('findClosestElementWithClass - 找到带目标类名的祖先元素', () => {
    const parent = document.createElement('div');
    parent.className = 'target-item';
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);
    expect(findClosestElementWithClass(child, 'target-item', document.body)).toBe(parent);
    parent.remove();
  });

  test('findClosestElementWithClass - 未找到返回 null', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);
    expect(findClosestElementWithClass(child, 'nonexistent', document.body)).toBeNull();
    parent.remove();
  });
});

describe('getRelativeBounding', () => {
  test('getRelativeBounding - 正确计算相对偏移', () => {
    const e = { top: 100, bottom: 150, left: 200, right: 300, width: 100, height: 50 } as DOMRect;
    const c = { top: 50, bottom: 100, left: 100, right: 200, width: 100, height: 50 } as DOMRect;
    const result = getRelativeBounding(e, c);
    expect(result.offsetTop).toBe(50);
    expect(result.offsetLeft).toBe(100);
    expect(result.offsetRight).toBe(200);
    expect(result.offsetBottom).toBe(100);
  });
});

describe('getElementBorder', () => {
  test('getElementBorder - 默认返回四方向边框宽度', () => {
    const el = document.createElement('div');
    el.style.border = '2px solid red';
    document.body.appendChild(el);
    const borders = getElementBorder(el);
    expect(borders).toHaveProperty('left');
    expect(borders).toHaveProperty('right');
    expect(borders).toHaveProperty('top');
    expect(borders).toHaveProperty('bottom');
    el.remove();
  });

  test('getElementBorder - 指定方向返回对应边框宽度', () => {
    const el = document.createElement('div');
    el.style.borderLeft = '5px solid blue';
    document.body.appendChild(el);
    const borders = getElementBorder(el, 'left');
    expect(borders.left).toBe(5);
    el.remove();
  });

  test('getElementBorder - 数组方向返回多个边框宽度', () => {
    const el = document.createElement('div');
    el.style.borderTop = '3px solid green';
    el.style.borderLeft = '7px solid red';
    document.body.appendChild(el);
    const borders = getElementBorder(el, ['top', 'left']);
    expect(borders.top).toBe(3);
    expect(borders.left).toBe(7);
    el.remove();
  });
});

describe('getCssVariable', () => {
  test('getCssVariable - 获取根元素 CSS 变量', () => {
    document.documentElement.style.setProperty('--test-var', '42px');
    expect(getCssVariable('--test-var')).toBe('42px');
    document.documentElement.style.removeProperty('--test-var');
  });

  test('getCssVariable - 获取指定元素 CSS 变量', () => {
    const el = document.createElement('div');
    el.style.setProperty('--el-var', 'red');
    document.body.appendChild(el);
    expect(getCssVariable('--el-var', el)).toBe('red');
    el.remove();
  });
});

describe('isOverflown', () => {
  test('isOverflown - 无元素时返回 false', () => {
    expect(isOverflown(undefined)).toBe(false);
  });

  test('isOverflown - 内容不超出时返回 false', () => {
    const el = document.createElement('div');
    el.style.width = '200px';
    el.style.height = '100px';
    el.style.overflow = 'hidden';
    document.body.appendChild(el);
    expect(isOverflown(el)).toBe(false);
    el.remove();
  });
});

describe('isNonVisibleTag', () => {
  test('isNonVisibleTag - SCRIPT / STYLE / LINK 等返回 true', () => {
    expect(isNonVisibleTag(document.createElement('script'))).toBe(true);
    expect(isNonVisibleTag(document.createElement('style'))).toBe(true);
    expect(isNonVisibleTag(document.createElement('link'))).toBe(true);
    expect(isNonVisibleTag(document.createElement('meta'))).toBe(true);
    expect(isNonVisibleTag(document.createElement('head'))).toBe(true);
  });

  test('isNonVisibleTag - 可见标签返回 false', () => {
    expect(isNonVisibleTag(document.createElement('div'))).toBe(false);
    expect(isNonVisibleTag(document.createElement('span'))).toBe(false);
  });
});

describe('isElementHidden', () => {
  test('isElementHidden - display:none 时返回 true', () => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    expect(isElementHidden(el)).toBe(true);
    el.remove();
  });

  test('isElementHidden - visibility:hidden 时返回 true', () => {
    const el = document.createElement('div');
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    expect(isElementHidden(el)).toBe(true);
    el.remove();
  });

  test('isElementHidden - 可见元素返回 false', () => {
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '50px';
    document.body.appendChild(el);
    expect(isElementHidden(el)).toBe(false);
    el.remove();
  });
});

describe('checkElementOverflow', () => {
  test('checkElementOverflow - 非元素抛错', () => {
    expect(() => checkElementOverflow({ element: 'not-element' as any })).toThrow();
  });

  test('checkElementOverflow - 无滚动父元素时返回全 false', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = checkElementOverflow({ element: el });
    expect(result.isOverflowLeft).toBe(false);
    expect(result.isOverflowRight).toBe(false);
    expect(result.isOverflowTop).toBe(false);
    expect(result.isOverflowBottom).toBe(false);
    el.remove();
  });

  test('checkElementOverflowHorizontal - 无父元素返回全 false', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = checkElementOverflowHorizontal({ element: el });
    expect(result.isOverflowLeft).toBe(false);
    expect(result.isOverflowRight).toBe(false);
    el.remove();
  });

  test('checkElementOverflowVertical - 无父元素返回全 false', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = checkElementOverflowVertical({ element: el });
    expect(result.isOverflowTop).toBe(false);
    expect(result.isOverflowBottom).toBe(false);
    el.remove();
  });
});
