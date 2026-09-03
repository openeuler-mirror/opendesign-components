/**
 * OFigure 响应式契约测试。
 *
 * --------------------------------------------------------------------------
 * media.scss 结构
 * --------------------------------------------------------------------------
 *
 *   .o-figure         → laptop / pad / phone 各声明 --figure-play-icon-size
 *   .o-figure-title   → pad / phone 各声明 font-size + line-height
 *   .o-figure-content → pad / phone 各声明 padding
 *
 * 断点覆盖：
 *   desktop (1920) → 无 media 命中，取 var.scss 默认
 *   laptop  (1440) → respond('laptop')
 *   pad_h   (1100) → respond('pad')
 *   pad_v   (768)  → respond('pad')（与 pad_h 同区间，值一致）
 *   phone   (375)  → respond('phone')
 *
 * 两类断言策略：
 *   ① 字面 px 变量（--figure-play-icon-size / padding）：矩阵精确比对
 *   ② token 链变量（font-size）：只断言「跃迁前后值发生变化」
 *
 * 不归属本文件的维度：
 *   - 行为 / class 注入 / emit → OFigure.index.test.ts
 *   - SSR 字符串渲染 + hydration mismatch → OFigure.ssr.test.ts
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OFigure from '../OFigure.vue';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';
import { flush } from '../../../__tests__/_helpers/dom';

const SRC = '/test-image.jpg';

/**
 * 在指定视口渲染 OFigure 并返回根元素。
 * @param bp 断点名称
 * @param props 额外 props
 * @returns OFigure 根 HTMLElement
 */
async function renderAt(bp: keyof typeof BREAKPOINTS, props: Record<string, unknown> = {}) {
  await setViewport(bp);
  const screen = render(OFigure, { props: { src: SRC, ...props } });
  await flush();
  return screen.container.querySelector('.o-figure') as HTMLElement;
}

describe('响应式契约（--figure-play-icon-size 跨断点）', () => {
  const STOPS: Record<'desktop' | 'laptop' | 'pad_h' | 'pad_v' | 'phone', number> = {
    desktop: 64, // var.scss 默认
    laptop: 56, // respond('laptop')
    pad_h: 48, // respond('pad')
    pad_v: 48, // respond('pad') — 同区间
    phone: 40, // respond('phone')
  };

  for (const bp of Object.keys(STOPS) as (keyof typeof STOPS)[]) {
    const expected = STOPS[bp];
    test(`OFigure --figure-play-icon-size @${bp} - 解析为 ${expected}px`, async () => {
      const el = await renderAt(bp);
      const cs = getComputedStyle(el);
      expect(parseFloat(cs.getPropertyValue('--figure-play-icon-size'))).toBeCloseTo(expected, 0);
    });
  }
});

describe('响应式契约（.o-figure-title font-size 跨断点）', () => {
  /**
   * 在指定视口渲染带 title slot 的 OFigure，返回 .o-figure-title 元素。
   * @param bp 断点名称
   * @returns .o-figure-title HTMLElement
   */
  async function renderTitleAt(bp: keyof typeof BREAKPOINTS) {
    await setViewport(bp);
    const screen = render(OFigure, {
      props: { src: SRC },
      slots: { title: () => h('span', 'T') },
    });
    await flush();
    return screen.container.querySelector('.o-figure-title') as HTMLElement;
  }

  test('OFigure title font-size - desktop → pad_h 跨过 pad 阈值时值变化', async () => {
    const d = parseFloat(getComputedStyle(await renderTitleAt('desktop')).fontSize);
    const p = parseFloat(getComputedStyle(await renderTitleAt('pad_h')).fontSize);
    expect(d).not.toBe(p);
  });

  test('OFigure title font-size - pad_h → phone 跨过 phone 阈值时值变化', async () => {
    const p = parseFloat(getComputedStyle(await renderTitleAt('pad_h')).fontSize);
    const f = parseFloat(getComputedStyle(await renderTitleAt('phone')).fontSize);
    expect(p).not.toBe(f);
  });

  test('OFigure title font-size - pad_v 与 pad_h 同区间值一致', async () => {
    const ph = parseFloat(getComputedStyle(await renderTitleAt('pad_h')).fontSize);
    const pv = parseFloat(getComputedStyle(await renderTitleAt('pad_v')).fontSize);
    expect(ph).toBeCloseTo(pv, 0);
  });
});

describe('响应式契约（.o-figure-content padding 跨断点）', () => {
  /**
   * 在指定视口渲染带 content slot 的 OFigure，返回 .o-figure-content 元素。
   * @param bp 断点名称
   * @returns .o-figure-content HTMLElement
   */
  async function renderContentAt(bp: keyof typeof BREAKPOINTS) {
    await setViewport(bp);
    const screen = render(OFigure, {
      props: { src: SRC },
      slots: { content: () => h('div', 'C') },
    });
    await flush();
    return screen.container.querySelector('.o-figure-content') as HTMLElement;
  }

  const PADDING_STOPS: Record<'desktop' | 'pad_h' | 'phone', { top: number; right: number }> = {
    desktop: { top: 16, right: 24 }, // 默认 16px 24px
    pad_h: { top: 12, right: 16 }, // respond('pad') → 12px 16px
    phone: { top: 4, right: 8 }, // respond('phone') → 4px 8px
  };

  for (const bp of Object.keys(PADDING_STOPS) as (keyof typeof PADDING_STOPS)[]) {
    const exp = PADDING_STOPS[bp];
    test(`OFigure content padding @${bp} - ${exp.top}px ${exp.right}px`, async () => {
      const el = await renderContentAt(bp);
      const cs = getComputedStyle(el);
      expect(parseFloat(cs.paddingTop)).toBeCloseTo(exp.top, 0);
      expect(parseFloat(cs.paddingRight)).toBeCloseTo(exp.right, 0);
    });
  }

  // 级联一致性：pad_v 无专属覆盖，级联自 pad
  test('OFigure content padding @pad_v - 无专属覆盖，级联自 pad', async () => {
    const el = await renderContentAt('pad_v');
    const cs = getComputedStyle(el);
    expect(parseFloat(cs.paddingTop)).toBeCloseTo(PADDING_STOPS.pad_h.top, 0);
    expect(parseFloat(cs.paddingRight)).toBeCloseTo(PADDING_STOPS.pad_h.right, 0);
  });
});
