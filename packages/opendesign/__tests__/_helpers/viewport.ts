import { page } from 'vitest/browser';

/**
 * 按"适配规则一致"的三大类组织视口（与根 CLAUDE.md 响应式断点对齐）。
 *
 *   类 1 — desktop (>1680)：不命中任何 media
 *   类 2 — laptop (1201-1680) + pad_h (841-1200)：命中 @respond('<=laptop')
 *   类 3 — pad_v (601-840) + phone (360-600)：命中 @respond('<=pad_v')，phone 再叠 @respond('phone')
 *
 * 类内 subrange 各跑一个代表视口，确保覆盖到 SCSS 端点而不仅是区间中点。
 */
// width 决定命中哪条 media query；height 只为让浏览器视口贴近真实设备纵向像素，不影响断点
export const BREAKPOINTS = {
  // 类 1：DeskTop  (>1680)
  desktop: { width: 1920, height: 1080 },
  // 类 2：Laptop/大尺寸psd + pad横屏  (841-1680)
  laptop: { width: 1440, height: 900 }, // 1201-1680  Laptop/大尺寸psd
  pad_h: { width: 1100, height: 800 }, //  841-1200  pad横屏
  // 类 3：折叠屏/手机横屏/pad竖屏  (360-840)
  pad_v: { width: 768, height: 1024 }, //  601-840   折叠屏/手机横屏/pad竖屏
  phone: { width: 375, height: 812 }, //  360-600   phone
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

export async function setViewport(name: BreakpointName) {
  const { width, height } = BREAKPOINTS[name];
  await page.viewport(width, height);
}
