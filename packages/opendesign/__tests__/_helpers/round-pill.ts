import { expect } from 'vitest';
import type { BreakpointName } from './viewport';

/**
 * pill 圆角 / 单行高度共享期望矩阵。
 *
 * @description OInput / OTextarea / OSelect / OCascaderV2 四个 round 测试文件
 * 共用的期望值单一来源：
 *   - pill 多行圆角常数矩阵：值口径 = **同 size 单行 pill OInput 的圆角**，即同 size 单行
 *     OInput 含边框容器（`.o_box-main`，border-box）高度的一半（预定义常数，非实时计算），
 *     不随多行控件自身内容高度增长；
 *   - OInput 单行高度矩阵：`.o_box-main` 的 `--_box-height`（var.scss）经 media.scss
 *     断点覆写后的取值（e.light 主题下 --o-control_size-s/m/l = 24/32/40），
 *     是上述圆角常数的推导基准（圆角矩阵 = 高度矩阵 ÷ 2）。
 *
 * 断点语义以 V2 断点表（`$o-breakpoints`）为准：`<=laptop` = 1680、`<=pad_v` = 840，
 * max-width **含等号**（1680 仍命中 `<=laptop`，841 起脱离 `<=pad_v`）。矩阵键直接复用
 * `viewport.ts` 的 `BreakpointName` 档名，与视口 helper 单一来源联动——`BREAKPOINTS`
 * 新增档位时本矩阵因 Record 键缺失而编译报错，强制同步补值。
 *
 * 三类适配档（同类内值相同，分类依据见 viewport.ts 头部注释）：
 *   类 1（>1680）：desktop；
 *   类 2（841–1680，命中 `<=laptop` 降档）：laptop / laptop_max / pad_h / pad_v_min；
 *   类 3（≤840，命中 `<=pad_v`）：pad_v / pad_v_max / phone。
 */

/** pill 圆角 / 高度矩阵的 size 档位键（对应组件 `o_box-{size}` class 的三档） */
export type RoundSizeKey = 'small' | 'medium' | 'large';

/**
 * pill 圆角期望矩阵（size × 断点 → px）。
 *
 * @description 同 size 单行 OInput 含边框容器高度的一半：
 *   - small ：全断点 12px（单行高 24 恒定）；
 *   - medium：默认 16px，`<=laptop`（≤1680）降 14px，≤840 不恢复；
 *   - large ：默认 20px，`<=laptop` 降 18px，`<=pad_v`（≤840）恢复 20px。
 */
export const PILL_RADIUS_MATRIX: Record<RoundSizeKey, Record<BreakpointName, number>> = {
  small: {
    desktop: 12,
    laptop: 12,
    laptop_max: 12,
    pad_h: 12,
    pad_v_min: 12,
    pad_v: 12,
    pad_v_max: 12,
    phone: 12,
  },
  medium: {
    desktop: 16,
    laptop: 14,
    laptop_max: 14,
    pad_h: 14,
    pad_v_min: 14,
    pad_v: 14,
    pad_v_max: 14,
    phone: 14,
  },
  large: {
    desktop: 20,
    laptop: 18,
    laptop_max: 18,
    pad_h: 18,
    pad_v_min: 18,
    pad_v: 20,
    pad_v_max: 20,
    phone: 20,
  },
};

/**
 * OInput `.o_box-main` 高度期望矩阵（size × 断点 → px）。
 *
 * @description 单行 OInput 含边框容器（border-box）高度：
 *   - small ：全断点恒 24px；
 *   - medium：desktop 32px，`<=laptop`（≤1680）降 28px，≤840 不恢复；
 *   - large ：desktop 40px，`<=laptop` 降 36px，`<=pad_v`（≤840）恢复 40px。
 */
export const OINPUT_HEIGHT_MATRIX: Record<RoundSizeKey, Record<BreakpointName, number>> = {
  small: {
    desktop: 24,
    laptop: 24,
    laptop_max: 24,
    pad_h: 24,
    pad_v_min: 24,
    pad_v: 24,
    pad_v_max: 24,
    phone: 24,
  },
  medium: {
    desktop: 32,
    laptop: 28,
    laptop_max: 28,
    pad_h: 28,
    pad_v_min: 28,
    pad_v: 28,
    pad_v_max: 28,
    phone: 28,
  },
  large: {
    desktop: 40,
    laptop: 36,
    laptop_max: 36,
    pad_h: 36,
    pad_v_min: 36,
    pad_v: 40,
    pad_v_max: 40,
    phone: 40,
  },
};

/**
 * round 语义矩阵的遍历视口档（6 档，供测试用例 for-of / test.each 遍历）。
 *
 * @description desktop 基准（>1680）+ `<=laptop` 上界（1680，含等号）+ pad_h 区间代表
 * + 恰好脱离 `<=pad_v` 的边界档（841）+ `<=pad_v` 上界（840，含等号）+ phone 区间代表，
 * 覆盖全部三类适配档并锁定 max-width 端点含等号语义。
 */
export const ROUND_MATRIX_VIEWPORTS: readonly BreakpointName[] = ['desktop', 'laptop_max', 'pad_h', 'pad_v_min', 'pad_v_max', 'phone'];

/** 四角 computed border-radius 的读取顺序（与断言失败信息中的角名一一对应） */
const RADIUS_CORNERS = [
  ['左上', 'borderTopLeftRadius'],
  ['右上', 'borderTopRightRadius'],
  ['右下', 'borderBottomRightRadius'],
  ['左下', 'borderBottomLeftRadius'],
] as const;

/**
 * @description 断言元素四角 computed border-radius 均等于精确像素值。
 * round 语义测试的统一四角断言口径（真实 Chromium 下声明值即使用值口径的
 * 常数断言），失败信息携带角名与上下文。
 * @param el 待断言元素（如 .o_box-main / .o-select 根）
 * @param expectedPx 期望半径（像素数值）
 * @param context 失败信息中的用例上下文（size / 视口等）
 */
export function expectRadiusCornersPx(el: HTMLElement, expectedPx: number, context = '') {
  const cs = getComputedStyle(el);
  const expected = `${expectedPx}px`;
  for (const [cornerName, propName] of RADIUS_CORNERS) {
    expect(cs[propName], `${context} - ${cornerName}圆角应为 ${expected}`).toBe(expected);
  }
}
