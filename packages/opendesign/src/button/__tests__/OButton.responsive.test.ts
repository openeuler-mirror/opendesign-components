/**
 * OButton 响应式契约测试。
 *
 * --------------------------------------------------------------------------
 * 按 size 各自的 media 声明组织矩阵（关键设计原则）
 * --------------------------------------------------------------------------
 *
 * 不要不分 size 统统跑 5 视口。每个 size 在 media.scss 中实际声明了哪些 respond 块，
 * 就只对应那些视口跃迁；未声明的断点段由级联自动继承上游，单独写一条「级联一致性」
 * 用例锁定即可。
 *
 *   .o-btn-large    media.scss 声明 2 个 respond：@<=laptop / @<=pad_v
 *     → 3 个值区间：desktop → laptop → pad_v
 *     → phone 区间无专属覆盖，级联到 pad_v
 *
 *   .o-btn-medium   media.scss 声明 1 个 respond：@<=laptop
 *     → 2 个值区间：desktop → laptop
 *     → pad_v / phone 区间无专属覆盖，级联到 laptop
 *
 *   .o-btn-small    media.scss 声明 1 个 respond：@<=pad_v
 *     → 2 个值区间：desktop → pad_v
 *     → laptop / pad_h 区间无专属覆盖，级联到 desktop
 *     → phone 区间无专属覆盖，级联到 pad_v
 *
 * --------------------------------------------------------------------------
 * 两类断言策略
 * --------------------------------------------------------------------------
 *
 *   ① 字面 px / 已知解析值变量（var.scss 直接写 px，或基值走 token 但
 *      e.light 主题下解析为已知 px）：
 *      矩阵精确比对。覆盖：height、padX、iconGap、fontSize、iconSize。
 *      注：部分基值来自 token（如 --btn-height: var(--o-control_size-l) 解析为 40px），
 *      精确比对在当前 e.light 主题下有效；token 升级时需同步更新 EXPECTED 表。
 *
 *   ② token 链变量（值是 var(--o-*) 指向 token，最终 px 由主题决定）：
 *      不硬比对绝对 px（会与 token 升级耦合），只断言「跃迁端点之间值发生变化」。
 *      覆盖：--btn-icon-size（large 跨 3 断点）、fontSize（large 跨 desktop→laptop）。
 *
 * 不归属本文件的维度：
 *   - 行为 / class 注入 / emit / token wiring → OButton.index.test.ts
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { markRaw } from 'vue';
import OButton from '../OButton.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';
import { resolveTokenPx } from '../../../__tests__/_helpers/dom';

const OIconAdd = markRaw(OIconAddRaw);

type Metrics = { fontSize: number; iconSize: number; iconGap: number; padX: number; height: number };
type SizeKey = 'large' | 'medium' | 'small';

function measure(btn: HTMLElement): Metrics {
  const cs = getComputedStyle(btn);
  const prefix = btn.querySelector('.o-btn-prefix') as HTMLElement;
  const ps = getComputedStyle(prefix);
  return {
    fontSize: parseFloat(cs.fontSize),
    iconSize: parseFloat(ps.fontSize),
    iconGap: parseFloat(ps.marginRight),
    padX: parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth),
    height: btn.getBoundingClientRect().height,
  };
}

function assertMetrics(btn: HTMLElement, exp: Metrics) {
  const m = measure(btn);
  expect(m.fontSize).toBeCloseTo(exp.fontSize, 0);
  expect(m.iconSize).toBeCloseTo(exp.iconSize, 0);
  expect(m.iconGap).toBeCloseTo(exp.iconGap, 0);
  expect(m.padX).toBeCloseTo(exp.padX, 0);
  expect(m.height).toBeCloseTo(exp.height, 0);
}

async function renderAt(bp: keyof typeof BREAKPOINTS, size: SizeKey) {
  await setViewport(bp);
  const screen = render(OButton, { props: { size, icon: OIconAdd }, slots: { default: size } });
  return screen.container.querySelector('.o-btn') as HTMLElement;
}

// ============================================================================
// size=large：2 个 respond 块 → 3 个值区间
// ============================================================================
const LARGE_STOPS: Record<'desktop' | 'laptop' | 'pad_v', Metrics> = {
  desktop: { fontSize: 16, iconSize: 24, iconGap: 8, padX: 24, height: 40 },
  laptop: { fontSize: 14, iconSize: 20, iconGap: 8, padX: 16, height: 36 },
  pad_v: { fontSize: 14, iconSize: 16, iconGap: 8, padX: 16, height: 32 },
};

describe('响应式契约（size=large @断点矩阵）', () => {
  for (const bp of Object.keys(LARGE_STOPS) as (keyof typeof LARGE_STOPS)[]) {
    const exp = LARGE_STOPS[bp];
    test(`OButton large @${bp} - 字号${exp.fontSize}/icon${exp.iconSize}/gap${exp.iconGap}/padX${exp.padX}/高${exp.height}`, async () => {
      const btn = await renderAt(bp, 'large');
      assertMetrics(btn, exp);
    });
  }

  test('OButton large @pad_h - 无专属覆盖，所有变量值级联自 laptop', async () => {
    const btn = await renderAt('pad_h', 'large');
    assertMetrics(btn, LARGE_STOPS.laptop);
  });

  test('OButton large @phone - 无专属覆盖，所有变量值级联自 pad_v', async () => {
    const btn = await renderAt('phone', 'large');
    assertMetrics(btn, LARGE_STOPS.pad_v);
  });
});

// ============================================================================
// size=medium：1 个 respond 块 → 2 个值区间
// ============================================================================
const MEDIUM_STOPS: Record<'desktop' | 'laptop', Metrics> = {
  desktop: { fontSize: 14, iconSize: 16, iconGap: 8, padX: 16, height: 32 },
  laptop: { fontSize: 14, iconSize: 16, iconGap: 4, padX: 16, height: 28 },
};

describe('响应式契约（size=medium @断点矩阵）', () => {
  for (const bp of Object.keys(MEDIUM_STOPS) as (keyof typeof MEDIUM_STOPS)[]) {
    const exp = MEDIUM_STOPS[bp];
    test(`OButton medium @${bp} - 字号${exp.fontSize}/icon${exp.iconSize}/gap${exp.iconGap}/padX${exp.padX}/高${exp.height}`, async () => {
      const btn = await renderAt(bp, 'medium');
      assertMetrics(btn, exp);
    });
  }

  test('OButton medium @pad_h - 无专属覆盖，所有变量值级联自 laptop', async () => {
    const btn = await renderAt('pad_h', 'medium');
    assertMetrics(btn, MEDIUM_STOPS.laptop);
  });

  test('OButton medium @pad_v - 无专属覆盖，所有变量值级联自 laptop', async () => {
    const btn = await renderAt('pad_v', 'medium');
    assertMetrics(btn, MEDIUM_STOPS.laptop);
  });

  test('OButton medium @phone - 无专属覆盖，所有变量值级联自 laptop', async () => {
    const btn = await renderAt('phone', 'medium');
    assertMetrics(btn, MEDIUM_STOPS.laptop);
  });
});

// ============================================================================
// size=small：1 个 respond 块 → 2 个值区间
// ============================================================================
const SMALL_STOPS: Record<'desktop' | 'pad_v', Metrics> = {
  desktop: { fontSize: 14, iconSize: 16, iconGap: 4, padX: 16, height: 28 },
  pad_v: { fontSize: 14, iconSize: 16, iconGap: 4, padX: 12, height: 24 },
};

describe('响应式契约（size=small @断点矩阵）', () => {
  for (const bp of Object.keys(SMALL_STOPS) as (keyof typeof SMALL_STOPS)[]) {
    const exp = SMALL_STOPS[bp];
    test(`OButton small @${bp} - 字号${exp.fontSize}/icon${exp.iconSize}/gap${exp.iconGap}/padX${exp.padX}/高${exp.height}`, async () => {
      const btn = await renderAt(bp, 'small');
      assertMetrics(btn, exp);
    });
  }

  test('OButton small @laptop - 无专属覆盖，所有变量值级联自 desktop', async () => {
    const btn = await renderAt('laptop', 'small');
    assertMetrics(btn, SMALL_STOPS.desktop);
  });

  test('OButton small @pad_h - 无专属覆盖，所有变量值级联自 desktop', async () => {
    const btn = await renderAt('pad_h', 'small');
    assertMetrics(btn, SMALL_STOPS.desktop);
  });

  test('OButton small @phone - 无专属覆盖，所有变量值级联自 pad_v', async () => {
    const btn = await renderAt('phone', 'small');
    assertMetrics(btn, SMALL_STOPS.pad_v);
  });
});

// ============================================================================
// token 链变量跨断点变化
//
// 不硬比对绝对 px。仅在该 size 实际声明覆盖的 respond 块端点验证「跃迁前后值变了」。
//
//   large 关心的 token 链跃迁：
//     --btn-icon-size：base icon_size-m → <=laptop icon_size-s → <=pad_v icon_size-xs
//     fontSize（非 CSS 自定义属性，直接读 computed）：base text1 → <=laptop tip1
//
//   medium / small 的 iconSize 与 fontSize 在 media.scss 中无 token 链跃迁覆盖，
//   不补 token 链断言。
// ============================================================================
describe('响应式契约（size=large token 链跨断点）', () => {
  test('OButton large - --btn-icon-size 在 desktop → laptop → pad_v 各跃迁端点值变化', async () => {
    const d = resolveTokenPx(await renderAt('desktop', 'large'), '--btn-icon-size');
    const l = resolveTokenPx(await renderAt('laptop', 'large'), '--btn-icon-size');
    const pv = resolveTokenPx(await renderAt('pad_v', 'large'), '--btn-icon-size');
    expect(d).not.toBe(l); // icon_size-m → icon_size-s
    expect(l).not.toBe(pv); // icon_size-s → icon_size-xs
  });

  test('OButton large - fontSize 在 desktop → laptop 跨过 <=laptop 阈值时值变化', async () => {
    const d = parseFloat(getComputedStyle(await renderAt('desktop', 'large')).fontSize);
    const l = parseFloat(getComputedStyle(await renderAt('laptop', 'large')).fontSize);
    expect(d).not.toBe(l); // font_size-text1 → font_size-tip1
  });

  test('OButton large - fontSize 在 laptop → pad_v 无变化（pad_v 无专属覆盖，级联自 laptop）', async () => {
    const l = parseFloat(getComputedStyle(await renderAt('laptop', 'large')).fontSize);
    const pv = parseFloat(getComputedStyle(await renderAt('pad_v', 'large')).fontSize);
    expect(l).toBeCloseTo(pv, 0);
  });
});
