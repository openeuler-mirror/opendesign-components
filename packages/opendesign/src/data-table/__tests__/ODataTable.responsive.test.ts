/**
 * ODataTable 响应式契约测试。
 *
 * ODataTable 自己的 style/media.scss 是空的，但**布局令牌全部继承自 table 包**
 * （`packages/opendesign/src/table/style/{var,media}.scss`，data-table 共用 `--table-*` 变量族）。
 *
 * --------------------------------------------------------------------------
 * 按 size 各自的 media 声明组织矩阵（关键设计原则）
 * --------------------------------------------------------------------------
 *
 * 不要不分 size 统统跑 5 视口。每个 size 在 media.scss 中实际声明了哪些 respond 块，
 * 就只对应那些视口跃迁；未声明的断点段由级联自动继承上游，单独写一条「级联一致性」
 * 用例锁定即可。
 *
 *   .o-table-medium    media.scss 声明 3 个 respond：@<=laptop / @<=pad / @<=pad_v
 *     → 4 个值区间：desktop → laptop → pad_h → pad_v
 *     → phone 区间无专属覆盖，级联到 pad_v
 *
 *   .o-table-small     media.scss 声明 2 个 respond：@<=laptop / @<=pad（无 @<=pad_v）
 *     → 3 个值区间：desktop → laptop → pad_h
 *     → pad_v / phone 区间无专属覆盖，级联到 pad_h
 *
 * --------------------------------------------------------------------------
 * 两类断言策略
 * --------------------------------------------------------------------------
 *
 *   ① 字面 px 变量（var.scss / media.scss 直接写 8px / 12px / 16px ...）：
 *      矩阵精确比对。覆盖：cellPadY/X、headCellPadY/X、edgePadding、expandCellPadding。
 *
 *   ② token 链变量（值是 var(--o-*) 指向 token，最终 px 由主题决定）：
 *      不硬比对绝对 px（会与 token 升级耦合），只断言「跃迁端点之间值发生变化」。
 *      覆盖：textSize、textHeight、rowIconSize。
 *
 *      不可断言的例外：--table-radius 在 <=pad 段切到 radius_control-s。当前 e.light 主题下
 *      radius_control-m 与 radius_control-s 别名同为 4px，运行时拿不到差异（CSSOM 已替换 var()，
 *      probe 解析也都是 4px）。当主题侧区分开后再补该跃迁断言。
 *
 * 不归属本文件的维度：
 *   - 行为 / class 注入 / emit → ODataTable.index.test.ts
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import ODataTable from '../ODataTable.vue';
import type { DataTableColumnT } from '../types';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';
import { resolveTokenPx } from '../../../__tests__/_helpers/dom';

const columns: DataTableColumnT[] = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Email', key: 'email' },
];

const data = [
  { id: 'r1', name: 'Alice', age: 20, email: 'a@x.com' },
  { id: 'r2', name: 'Bob', age: 22, email: 'b@x.com' },
];

type Metrics = {
  cellPadY: number;
  cellPadX: number;
  headCellPadY: number;
  headCellPadX: number;
  edgePadding: number;
  expandCellPadding: number;
};

function readPx(el: HTMLElement, name: string): number {
  return parseFloat(getComputedStyle(el).getPropertyValue(name));
}

async function renderAt(bp: keyof typeof BREAKPOINTS, size: 'medium' | 'small') {
  await setViewport(bp);
  const screen = render(ODataTable, { props: { data, columns, size } });
  return screen.container.querySelector('.o-data-table') as HTMLElement;
}

function assertMetrics(root: HTMLElement, exp: Metrics) {
  expect(readPx(root, '--table-cell-padding-y')).toBeCloseTo(exp.cellPadY, 0);
  expect(readPx(root, '--table-cell-padding-x')).toBeCloseTo(exp.cellPadX, 0);
  expect(readPx(root, '--table-head-cell-padding-y')).toBeCloseTo(exp.headCellPadY, 0);
  expect(readPx(root, '--table-head-cell-padding-x')).toBeCloseTo(exp.headCellPadX, 0);
  expect(readPx(root, '--table-edge-padding')).toBeCloseTo(exp.edgePadding, 0);
  expect(readPx(root, '--table-expand-cell-padding')).toBeCloseTo(exp.expandCellPadding, 0);
}

// ============================================================================
// size=medium：3 个 respond 块 → 4 个值区间
// ============================================================================
const MEDIUM_STOPS: Record<'desktop' | 'laptop' | 'pad_h' | 'pad_v', Metrics> = {
  // base from var.scss .o-table
  desktop: { cellPadY: 12, cellPadX: 16, headCellPadY: 12, headCellPadX: 16, edgePadding: 32, expandCellPadding: 32 },
  // base + @<=laptop block
  laptop: { cellPadY: 8, cellPadX: 16, headCellPadY: 8, headCellPadX: 16, edgePadding: 24, expandCellPadding: 24 },
  // base + @<=laptop + @<=pad
  pad_h: { cellPadY: 8, cellPadX: 12, headCellPadY: 8, headCellPadX: 12, edgePadding: 20, expandCellPadding: 16 },
  // base + @<=laptop + @<=pad + @<=pad_v
  pad_v: { cellPadY: 8, cellPadX: 8, headCellPadY: 8, headCellPadX: 8, edgePadding: 8, expandCellPadding: 12 },
};

describe('响应式契约（size=medium @断点矩阵）', () => {
  for (const bp of Object.keys(MEDIUM_STOPS) as (keyof typeof MEDIUM_STOPS)[]) {
    const exp = MEDIUM_STOPS[bp];
    test(`ODataTable medium @${bp} - cellPad(${exp.cellPadY}×${exp.cellPadX}) headCellPad(${exp.headCellPadY}×${exp.headCellPadX}) edge=${exp.edgePadding} expandCell=${exp.expandCellPadding}`, async () => {
      const root = await renderAt(bp, 'medium');
      assertMetrics(root, exp);
    });
  }

  // 级联一致性：phone 段 OTable 未声明专属覆盖，应级联自 pad_v
  test('ODataTable medium @phone - 无专属覆盖，所有变量值级联自 pad_v', async () => {
    const root = await renderAt('phone', 'medium');
    assertMetrics(root, MEDIUM_STOPS.pad_v);
  });
});

// ============================================================================
// size=small：2 个 respond 块 → 3 个值区间
// ============================================================================
const SMALL_STOPS: Record<'desktop' | 'laptop' | 'pad_h', Metrics> = {
  // base from var.scss .o-table-small
  desktop: { cellPadY: 8, cellPadX: 16, headCellPadY: 8, headCellPadX: 16, edgePadding: 16, expandCellPadding: 24 },
  // base + @<=laptop block（only expandCellPadding override）
  laptop: { cellPadY: 8, cellPadX: 16, headCellPadY: 8, headCellPadX: 16, edgePadding: 16, expandCellPadding: 16 },
  // base + @<=laptop + @<=pad
  pad_h: { cellPadY: 8, cellPadX: 8, headCellPadY: 8, headCellPadX: 8, edgePadding: 8, expandCellPadding: 12 },
};

describe('响应式契约（size=small @断点矩阵）', () => {
  for (const bp of Object.keys(SMALL_STOPS) as (keyof typeof SMALL_STOPS)[]) {
    const exp = SMALL_STOPS[bp];
    test(`ODataTable small @${bp} - cellPad(${exp.cellPadY}×${exp.cellPadX}) headCellPad(${exp.headCellPadY}×${exp.headCellPadX}) edge=${exp.edgePadding} expandCell=${exp.expandCellPadding}`, async () => {
      const root = await renderAt(bp, 'small');
      assertMetrics(root, exp);
    });
  }

  // 级联一致性：pad_v / phone 段 small 未声明专属覆盖，应级联自 pad_h
  test('ODataTable small @pad_v - 无专属覆盖，所有变量值级联自 pad_h', async () => {
    const root = await renderAt('pad_v', 'small');
    assertMetrics(root, SMALL_STOPS.pad_h);
  });

  test('ODataTable small @phone - 无专属覆盖，所有变量值级联自 pad_h', async () => {
    const root = await renderAt('phone', 'small');
    assertMetrics(root, SMALL_STOPS.pad_h);
  });
});

// ============================================================================
// token 链变量跨断点变化
//
// 不硬比对绝对 px。仅在该 size 实际声明覆盖的 respond 块端点验证「跃迁前后值变了」。
//
//   medium 关心的 token 链跃迁：
//     --table-text-size / --table-text-height：base text1 → <=laptop tip1 → <=pad_v tip2
//     --table-row-icon-size：base icon_size-m → <=laptop icon_size-s → <=pad_v icon_size-m
//
//   small 关心的 token 链跃迁：
//     --table-text-size：var.scss small base = tip1 → <=pad tip2（@<=laptop 无覆盖）
//
//   --table-radius：当前主题 radius_control-m 与 radius_control-s 别名为同 px → test.todo
// ============================================================================

describe('响应式契约（size=medium token 链跨断点）', () => {
  test('ODataTable medium - --table-text-size 在 desktop → laptop → pad_v 各跃迁端点值变化', async () => {
    const d = resolveTokenPx(await renderAt('desktop', 'medium'), '--table-text-size');
    const l = resolveTokenPx(await renderAt('laptop', 'medium'), '--table-text-size');
    const pv = resolveTokenPx(await renderAt('pad_v', 'medium'), '--table-text-size');
    expect(d).not.toBe(l); // text1 → tip1
    expect(l).not.toBe(pv); // tip1 → tip2
  });

  test('ODataTable medium - --table-text-height 在 desktop → laptop → pad_v 各跃迁端点值变化', async () => {
    const d = resolveTokenPx(await renderAt('desktop', 'medium'), '--table-text-height');
    const l = resolveTokenPx(await renderAt('laptop', 'medium'), '--table-text-height');
    const pv = resolveTokenPx(await renderAt('pad_v', 'medium'), '--table-text-height');
    expect(d).not.toBe(l);
    expect(l).not.toBe(pv);
  });

  test('ODataTable medium - --table-row-icon-size 在 desktop → laptop → pad_v 各跃迁端点值变化（且 desktop 与 pad_v 同为 icon_size-m）', async () => {
    const d = resolveTokenPx(await renderAt('desktop', 'medium'), '--table-row-icon-size');
    const l = resolveTokenPx(await renderAt('laptop', 'medium'), '--table-row-icon-size');
    const pv = resolveTokenPx(await renderAt('pad_v', 'medium'), '--table-row-icon-size');
    expect(d).not.toBe(l); // icon_size-m → icon_size-s
    expect(l).not.toBe(pv); // icon_size-s → icon_size-m
    expect(d).toBeCloseTo(pv, 0); // 两端都是 icon_size-m
  });
});

describe('响应式契约（size=small token 链跨断点）', () => {
  test('ODataTable small - --table-text-size 在 laptop → pad_h 跨过 <=pad 阈值时值变化', async () => {
    // small 只在 <=pad 段定义了 text-size 覆盖（var.scss .o-table-small 默认 tip1，<=pad 改成 tip2）
    // @<=laptop 块对 small 只覆盖 expand-cell-padding，不动 text-size，所以 laptop 仍是 tip1
    const l = resolveTokenPx(await renderAt('laptop', 'small'), '--table-text-size');
    const ph = resolveTokenPx(await renderAt('pad_h', 'small'), '--table-text-size');
    expect(l).not.toBe(ph); // tip1 → tip2
  });

  test('ODataTable small - --table-text-height 在 laptop → pad_h 跨过 <=pad 阈值时值变化', async () => {
    // 与 text-size 结构同：仅 <=pad 段覆盖 line_height-tip2
    const l = resolveTokenPx(await renderAt('laptop', 'small'), '--table-text-height');
    const ph = resolveTokenPx(await renderAt('pad_h', 'small'), '--table-text-height');
    expect(l).not.toBe(ph); // line_height-tip1 → line_height-tip2
  });
});
