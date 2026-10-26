/**
 * OTour 响应式契约测试。
 *
 * 验证 media.scss 中两个断点对局部 CSS 变量的覆盖：
 *   - desktop（>1680）：命中 var.scss 基线
 *   - laptop（1201-1680）：@include respond('laptop') → --tour-padding 16px
 *   - pad_h（841-1200）：@include respond('pad_h') → --tour-padding 12px、--tour-width 切到 grid-4
 *
 * 断言策略：
 *   - 字面 px 变量（--tour-padding）：跨断点精确比对
 *   - token 链变量（--tour-width）：断言「跃迁前后值发生变化」
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import { OTour, OTourStep } from '../index';
import { flush, resolveTokenPx } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanup = () => {
  document.body.classList.remove('o-tour-open');
  document.body.querySelectorAll('.tour-test-wrapper, .tour-test-target, .o-tour').forEach((el) => el.remove());
};

const makeTarget = (id: string) => {
  const el = document.createElement('div');
  el.className = `tour-test-target ${id}`;
  el.style.cssText = 'position:fixed; left:300px; top:300px; width:120px; height:80px;';
  document.body.appendChild(el);
  return el;
};

/** 挂载一次 Tour，返回 wrapper 元素（视口切换由调用方控制） */
const mountOnce = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'tour-test-wrapper';
  document.body.appendChild(wrapper);
  const target = makeTarget('t1');
  render(OTour, {
    props: { visible: true, wrapper },
    slots: { default: () => h(OTourStep, { target, title: 'A' }) },
  });
  return wrapper;
};

describe('响应式契约（字面 px 变量 --tour-padding）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTour @desktop - --tour-padding 取基线 24px', async () => {
    const wrapper = mountOnce();
    await flush();
    const tour = wrapper.querySelector('.o-tour') as HTMLElement;
    expect(resolveTokenPx(tour, '--tour-padding')).toBeCloseTo(24, 0);
  });

  test('OTour @laptop - --tour-padding 跃迁为 16px', async () => {
    const wrapper = mountOnce();
    await flush();
    await setViewport('laptop');
    await flush();
    const tour = wrapper.querySelector('.o-tour') as HTMLElement;
    expect(resolveTokenPx(tour, '--tour-padding')).toBeCloseTo(16, 0);
  });

  test('OTour @pad_h - --tour-padding 跃迁为 12px', async () => {
    const wrapper = mountOnce();
    await flush();
    await setViewport('pad_h');
    await flush();
    const tour = wrapper.querySelector('.o-tour') as HTMLElement;
    expect(resolveTokenPx(tour, '--tour-padding')).toBeCloseTo(12, 0);
  });
});

describe('响应式契约（token 链变量 --tour-width）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTour --tour-width - desktop → pad_h 跃迁前后值变化', async () => {
    const wrapper = mountOnce();
    await flush();
    const tour = wrapper.querySelector('.o-tour') as HTMLElement;
    const desktopWidth = resolveTokenPx(tour, '--tour-width');

    await setViewport('pad_h');
    await flush();
    const padHWidth = resolveTokenPx(tour, '--tour-width');

    // desktop 取 grid-6，pad_h 取 grid-4，两者像素值应不同
    expect(desktopWidth).not.toBe(padHWidth);
  });
});

/**
 * 响应式契约（≤pad_v 断点不展示）：
 * 视口 ≤ 840（phone / pad_v）时不渲染 Tour，避免小屏遮挡内容；
 * 跨断点 resize 时由 showTour 驱动挂载/卸载与 body 滚动锁。
 */
describe('响应式契约（≤pad_v 断点不展示）', () => {
  afterEach(cleanup);

  test('OTour @desktop - 视口 > 840 时渲染 .o-tour', async () => {
    await setViewport('desktop');
    const wrapper = mountOnce();
    await flush();
    expect(wrapper.querySelector('.o-tour')).not.toBeNull();
  });

  test('OTour @pad_v - 视口 ≤ 840 时不渲染 .o-tour', async () => {
    await setViewport('pad_v');
    const wrapper = mountOnce();
    await flush();
    expect(wrapper.querySelector('.o-tour')).toBeNull();
  });

  test('OTour @phone - 视口 ≤ 840 时不渲染 .o-tour', async () => {
    await setViewport('phone');
    const wrapper = mountOnce();
    await flush();
    expect(wrapper.querySelector('.o-tour')).toBeNull();
  });

  test('OTour @pad_v - 不展示时 body 不加 o-tour-open 滚动锁', async () => {
    await setViewport('pad_v');
    mountOnce();
    await flush();
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });

  test('OTour 跨断点 - desktop 打开后 resize 到 pad_v 隐藏并移除 o-tour-open', async () => {
    await setViewport('desktop');
    const wrapper = document.createElement('div');
    wrapper.className = 'tour-test-wrapper';
    document.body.appendChild(wrapper);
    const target = makeTarget('t-cross');
    let visible = false;
    const screen = render(OTour, {
      props: {
        visible,
        wrapper,
        'onUpdate:visible': (v: boolean) => {
          visible = v;
          screen.rerender({ visible: v });
        },
      },
      slots: { default: () => h(OTourStep, { target, title: 'A' }) },
    });
    await flush();
    // 由 false 切到 true 触发 showTour watch，加 o-tour-open 滚动锁
    await screen.rerender({ visible: true });
    await flush();
    expect(wrapper.querySelector('.o-tour')).not.toBeNull();
    expect(document.body.classList.contains('o-tour-open')).toBe(true);

    // 跨断点缩到 pad_v：showTour 转 false，卸载并移除滚动锁
    await setViewport('pad_v');
    await flush();
    expect(wrapper.querySelector('.o-tour')).toBeNull();
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });
});
