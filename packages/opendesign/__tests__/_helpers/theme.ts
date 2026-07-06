/** 项目支持的测试主题列表。样式相关断言必须在双主题下都跑。 */
export const THEMES = ['e.light', 'e.dark'] as const;

export type ThemeName = (typeof THEMES)[number];

/**
 * 给 wrapper container 和目标元素同时挂主题 attribute + 主题背景色。
 *
 * - container 挂 data-o-theme + fill1 背景：UI 面板里 light=浅灰、dark=深黑，反差明显
 * - 元素自身再挂一次 data-o-theme：双保险，确保即使 container ~ 元素中间有 vitest wrapper 断链
 *   也能从元素自己 scope 内拿到正确 token 值
 */
export function paintThemed(container: Element, theme: ThemeName | string, target: HTMLElement) {
  const c = container as HTMLElement;
  c.setAttribute('data-o-theme', theme);
  c.style.cssText = 'background-color: var(--o-color-fill1); padding: 16px;';
  target.setAttribute('data-o-theme', theme);
}

/** 判断颜色值是否透明（rgba(0,0,0,0) 或 'transparent'）。用于 variant 语义断言。 */
export const isTransparent = (color: string) => color === 'rgba(0, 0, 0, 0)' || color === 'transparent';
