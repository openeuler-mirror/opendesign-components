/**
 * popup.ts 纯函数契约测试。
 *
 * 覆盖三个导出的运行时函数：
 *   - calcPopupStyle：位置计算（基准定位 / 自适应翻转 / 边缘钳制 / anchor 贴边 / wrapper 坐标转换）
 *   - bindTrigger：trigger 类型 → DOM 事件绑定契约
 *   - getTransformOrigin：position → 动画 transform-origin 映射
 *
 * 约定：DOM 几何用 fixed 定位构造，保证 getBoundingClientRect 与视口坐标一致、不受页面滚动影响。
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { calcPopupStyle, bindTrigger, getTransformOrigin } from './popup';
import { PopupPositionTypes } from './types';

/** 视口矩形描述（left/top 为视口坐标，width/height 为元素尺寸） */
interface ViewRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** 在视口指定位置创建一个固定尺寸的 fixed 元素（rect 即 getBoundingClientRect 结果） */
function placeFixedEl(cls: string, { left, top, width, height }: ViewRect) {
  const el = document.createElement('div');
  el.className = cls;
  el.style.cssText = `position:fixed;left:${left}px;top:${top}px;width:${width}px;height:${height}px;`;
  document.body.appendChild(el);
  return el;
}

/**
 * 创建 absolute 定位的弹层元素（模拟真实 .o-popup 的定位方式）。
 * fixed 元素的 offsetParent 为 null 会走无 wrapper 分支，无法覆盖自适应翻转等逻辑。
 */
function placeAbsoluteEl(cls: string, { width, height }: { width: number; height: number }) {
  const el = document.createElement('div');
  el.className = cls;
  el.style.cssText = `position:absolute;width:${width}px;height:${height}px;`;
  document.body.appendChild(el);
  return el;
}

/** calcPopupStyle 除 popupEl / targetEl 外的可选参数 */
type CalcOptions = Partial<Parameters<typeof calcPopupStyle>[0]>;

/** 本测试创建的临时元素统一挂此 class，便于 afterEach 清理 */
const SCRAP_CLASS = 'popup-test-scrap';

afterEach(() => {
  document.querySelectorAll(`.${SCRAP_CLASS}`).forEach((el) => el.remove());
});

/**
 * 构造 calcPopupStyle 场景：fixed 定位的 target + popup，返回计算结果。
 * @param targetRect target 视口矩形
 * @param popupSize popup 尺寸
 * @param options calcPopupStyle 其余参数（position 必传）
 */
function calcWithFixed(
  targetRect: ViewRect,
  popupSize: { width: number; height: number },
  options: CalcOptions & { position: NonNullable<CalcOptions['position']> },
) {
  const targetEl = placeFixedEl(SCRAP_CLASS, targetRect);
  const popupEl = placeAbsoluteEl(SCRAP_CLASS, popupSize);
  return calcPopupStyle({ popupEl, targetEl, ...options });
}

describe('calcPopupStyle', () => {
  test('calcPopupStyle position=top - 空间充足时弹层位于 target 上方且不翻转', () => {
    const { popupStyle, position } = calcWithFixed(
      { left: 100, top: 300, width: 100, height: 40 },
      { width: 200, height: 80 },
      { position: 'top', offset: 10, anchor: false },
    );
    // 水平居中对齐：100 + 100/2 - 200/2 = 50；垂直：300 - 10 - 80 = 210
    expect(position).toBe('top');
    expect(popupStyle.left).toBe(50);
    expect(popupStyle.top).toBe(210);
  });

  test('calcPopupStyle position=top - 上方空间不足时自适应翻转为 bottom', () => {
    const { popupStyle, position } = calcWithFixed(
      { left: 100, top: 50, width: 100, height: 40 },
      { width: 200, height: 80 },
      { position: 'top', offset: 0, anchor: false },
    );
    // 原始 top = 50 - 80 = -30 超出视口顶部 → 翻转为 bottom：50 + 40 = 90
    expect(position).toBe('bottom');
    expect(popupStyle.top).toBe(90);
  });

  test('calcPopupStyle adaptive=false - 空间不足时也不翻转', () => {
    const { popupStyle, position } = calcWithFixed(
      { left: 100, top: 50, width: 100, height: 40 },
      { width: 200, height: 80 },
      { position: 'top', offset: 0, adaptive: false, anchor: false },
    );
    expect(position).toBe('top');
    expect(popupStyle.top).toBe(-30);
  });

  test('calcPopupStyle edgeOffset - 弹层越过视口左边缘时钳制到 edgeOffset', () => {
    const { popupStyle } = calcWithFixed(
      { left: 10, top: 300, width: 100, height: 40 },
      { width: 200, height: 80 },
      { position: 'top', offset: 0, edgeOffset: 8, anchor: false },
    );
    // 原始 left = 10 + 50 - 100 = -40，钳制到 edgeOffset = 8
    expect(popupStyle.left).toBe(8);
  });

  test('calcPopupStyle anchor=true - top 方向 anchor 贴弹层底边、bottom 方向贴顶边', () => {
    const top = calcWithFixed({ left: 100, top: 300, width: 100, height: 40 }, { width: 200, height: 80 }, { position: 'top', offset: 0, anchor: true });
    // target 中心 x = 150，弹层 left = 50 → anchor left = 100；top 方向 anchor 贴底边
    expect(top.anchorStyle).toEqual({ left: '100px', bottom: '0px' });

    const bottom = calcWithFixed({ left: 100, top: 100, width: 100, height: 40 }, { width: 200, height: 80 }, { position: 'bottom', offset: 0, anchor: true });
    expect(bottom.anchorStyle).toEqual({ left: '100px', top: '0px' });
  });

  test('calcPopupStyle wrapper - 输出 wrapper 坐标系的 transform 偏移', () => {
    // wrapper 为 positioned + overflow:hidden 容器，位于视口 (10, 150)，popup 挂在其内部
    const wrapperEl = document.createElement('div');
    wrapperEl.className = SCRAP_CLASS;
    wrapperEl.style.cssText = 'position:fixed;left:10px;top:150px;width:380px;height:400px;overflow:hidden;';
    const popupEl = placeAbsoluteEl(SCRAP_CLASS, { width: 200, height: 80 });
    wrapperEl.appendChild(popupEl);
    document.body.appendChild(wrapperEl);
    const targetEl = placeFixedEl(SCRAP_CLASS, { left: 100, top: 300, width: 100, height: 40 });

    const { popupStyle } = calcPopupStyle({ popupEl, targetEl, position: 'bottom', offset: 10, anchor: false });
    // 视口坐标：left = 100 + 50 - 100 = 50，top = 300 + 40 + 10 = 350；转换到 wrapper 坐标系需减去 wrapper 原点 (10, 150)
    expect(popupStyle.left).toBe(40);
    expect(popupStyle.top).toBe(200);
  });
});

describe('bindTrigger', () => {
  const dispatch = (el: HTMLElement | Window, type: string) => {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
  };

  test('bindTrigger click - 点击切换显隐（updateFn 无参调用）', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['click'], updateFn });
    expect(listeners.length).toBeGreaterThan(0);

    dispatch(el, 'click');
    expect(updateFn).toHaveBeenCalledWith();

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger click-outclick - 点击显示、点击外部区域隐藏', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['click-outclick'], updateFn });

    dispatch(el, 'click');
    expect(updateFn).toHaveBeenLastCalledWith(true);

    // 在元素外部按下并释放鼠标（outclick 判定基于 window 上的 mousedown/mouseup，target 需为元素）
    const outside = placeFixedEl(SCRAP_CLASS, { left: 500, top: 500, width: 10, height: 10 });
    dispatch(outside, 'mousedown');
    dispatch(outside, 'mouseup');
    expect(updateFn).toHaveBeenLastCalledWith(false);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger hover - 移入显示、移出隐藏（携带 hoverDelay）', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['hover'], updateFn, hoverDelay: 50 });

    dispatch(el, 'mouseenter');
    expect(updateFn).toHaveBeenLastCalledWith(true, 50);

    dispatch(el, 'mouseleave');
    expect(updateFn).toHaveBeenLastCalledWith(false, 50);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger hover + autoHide=false - 不绑定移出隐藏', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['hover'], updateFn, autoHide: false });

    dispatch(el, 'mouseenter');
    dispatch(el, 'mouseleave');
    expect(updateFn).toHaveBeenCalledTimes(1);
    expect(updateFn).toHaveBeenCalledWith(true, 100);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger focus - 聚焦显示、失焦隐藏', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['focus'], updateFn });

    dispatch(el, 'focusin');
    expect(updateFn).toHaveBeenLastCalledWith(true);

    dispatch(el, 'focusout');
    expect(updateFn).toHaveBeenLastCalledWith(false);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger contextmenu - 右键显示并阻止默认菜单', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['contextmenu'], updateFn });

    const evt = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    el.dispatchEvent(evt);
    expect(evt.defaultPrevented).toBe(true);
    expect(updateFn).toHaveBeenCalledWith(true);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger 数组触发器 - 同时绑定多种触发方式', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    const listeners = bindTrigger({ el, popupRef: ref(null), triggers: ['click', 'hover'], updateFn });

    dispatch(el, 'click');
    dispatch(el, 'mouseenter');
    expect(updateFn).toHaveBeenCalledTimes(2);

    listeners.forEach((fn) => fn());
  });

  test('bindTrigger none / el=null - 不绑定任何事件', () => {
    const el = placeFixedEl(SCRAP_CLASS, { left: 0, top: 0, width: 10, height: 10 });
    const updateFn = vi.fn();
    expect(bindTrigger({ el, popupRef: ref(null), triggers: ['none'], updateFn })).toEqual([]);
    expect(bindTrigger({ el: null, popupRef: ref(null), triggers: ['click'], updateFn })).toEqual([]);
    expect(updateFn).not.toHaveBeenCalled();
  });
});

describe('getTransformOrigin', () => {
  test('getTransformOrigin - 12 个 position 均有映射且方向语义正确', () => {
    for (const p of PopupPositionTypes) {
      const origin = getTransformOrigin(p);
      expect(typeof origin.left).toBe('string');
      expect(typeof origin.top).toBe('string');
    }
    // 动画从触发点展开：top 方向 origin 在弹层底边，bottom 方向在顶边
    expect(getTransformOrigin('top')).toEqual({ left: '50%', top: '100%' });
    expect(getTransformOrigin('bottom')).toEqual({ left: '50%', top: '0px' });
    // left 方向 origin 在弹层右边，right 方向在左边
    expect(getTransformOrigin('left')).toEqual({ left: '100%', top: '50%' });
    expect(getTransformOrigin('right')).toEqual({ left: '0px', top: '50%' });
  });
});
