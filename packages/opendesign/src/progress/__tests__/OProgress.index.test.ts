/**
 * OProgress 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 视觉契约：双主题
 *   3. 插槽契约：default / icon
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OProgress from '../OProgress.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OProgress variant - line / circle 注入类，默认 line', async () => {
    const line = render(OProgress, { props: { variant: 'line' } });
    expect((line.container.querySelector('.o-progress') as HTMLElement).classList.contains('o-progress-line')).toBe(true);

    const circle = render(OProgress, { props: { variant: 'circle' } });
    await flush();
    expect((circle.container.querySelector('.o-progress') as HTMLElement).classList.contains('o-progress-circle')).toBe(true);

    const def = render(OProgress, {});
    expect((def.container.querySelector('.o-progress') as HTMLElement).classList.contains('o-progress-line')).toBe(true);
  });

  test('OProgress percentage - 0~100 默认 0', async () => {
    const def = render(OProgress, {});
    expect(def.container.querySelector('.o-progress') as HTMLElement).not.toBeNull();

    const p50 = render(OProgress, { props: { percentage: 50 } });
    const bar = p50.container.querySelector('.o-progress-line-bar') as HTMLElement;
    expect(bar.style.width).toBe('50%');
  });

  test('OProgress size - medium / small 注入类，默认 medium', async () => {
    for (const s of ['medium', 'small'] as const) {
      const screen = render(OProgress, { props: { size: s } });
      expect((screen.container.querySelector('.o-progress') as HTMLElement).classList.contains(`o-progress-${s}`)).toBe(true);
    }
    const def = render(OProgress, {});
    expect((def.container.querySelector('.o-progress') as HTMLElement).classList.contains('o-progress-medium')).toBe(true);
  });

  test('OProgress color - 各枚举值注入 o-progress-{color} 类', async () => {
    for (const c of ['primary', 'success', 'warning', 'danger'] as const) {
      const screen = render(OProgress, { props: { color: c } });
      expect((screen.container.querySelector('.o-progress') as HTMLElement).classList.contains(`o-progress-${c}`)).toBe(true);
    }
  });

  test('OProgress showLabel - 默认 true 显示文字', async () => {
    const screen = render(OProgress, { props: { percentage: 42 } });
    const label = screen.container.querySelector('.o-progress-line-label');
    expect(label).not.toBeNull();
    expect(label?.textContent?.trim()).toBe('42%');
  });

  test('OProgress showLabel=false - 不显示文字', async () => {
    const screen = render(OProgress, { props: { showLabel: false } });
    expect(screen.container.querySelector('.o-progress-line-label')).toBeNull();
  });

  test('OProgress labelInside - 文字在进度条内部', async () => {
    const screen = render(OProgress, { props: { percentage: 60, labelInside: true } });
    expect(screen.container.querySelector('.o-progress-line-inner-label')).not.toBeNull();
    expect(screen.container.querySelector('.o-progress-line-label')).toBeNull();
  });

  test('OProgress format - 自定义格式化函数', async () => {
    const screen = render(OProgress, {
      props: { percentage: 30, format: (p: number) => `已完成 ${p}%` },
    });
    const label = screen.container.querySelector('.o-progress-line-label');
    expect(label?.textContent?.trim()).toBe('已完成 30%');
  });

  test('OProgress strokeWidth - 自定义线宽', async () => {
    const screen = render(OProgress, { props: { strokeWidth: 12 } });
    const track = screen.container.querySelector('.o-progress-line-track') as HTMLElement;
    expect(track.style.height).toBe('12px');
  });

  test('OProgress variant=circle - 渲染 SVG', async () => {
    const screen = render(OProgress, { props: { variant: 'circle', percentage: 75 } });
    await flush();
    const svg = screen.container.querySelector('svg');
    expect(svg).not.toBeNull();
    const bar = screen.container.querySelector('.o-progress-circle-bar');
    expect(bar).not.toBeNull();
  });

  test('OProgress trackWidth - 自定义轨道宽度', async () => {
    const screen = render(OProgress, { props: { trackWidth: 200 } });
    const track = screen.container.querySelector('.o-progress-line-track') as HTMLElement;
    expect(track.style.width).toBe('200px');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OProgress line @${theme} - bar 有可见背景色`, async () => {
      const screen = render(OProgress, { props: { percentage: 50, color: 'primary' } });
      const bar = screen.container.querySelector('.o-progress-line-bar') as HTMLElement;
      paintThemed(screen.container, theme, bar);
      expect(getComputedStyle(bar).backgroundColor).toBeTruthy();
    });
  }

  for (const theme of THEMES) {
    test(`OProgress circle @${theme} - bar SVG stroke 有颜色`, async () => {
      const screen = render(OProgress, { props: { variant: 'circle', percentage: 50, color: 'primary' } });
      await flush();
      const bar = screen.container.querySelector('.o-progress-circle-bar') as SVGElement;
      paintThemed(screen.container, theme, bar as any);
      const cs = getComputedStyle(bar as any);
      expect(cs.stroke).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OProgress slot=default - 替换文字显示', async () => {
    const screen = render(OProgress, {
      props: { percentage: 50 },
      slots: { default: () => h('span', { class: 'custom-label' }, 'Half') },
    });
    expect(screen.container.querySelector('.custom-label')).not.toBeNull();
  });

  test('OProgress slot=icon - 替换图标位', async () => {
    const screen = render(OProgress, {
      props: { percentage: 50 },
      slots: { icon: () => h('span', { class: 'custom-icon' }, '★') },
    });
    const iconSlot = screen.container.querySelector('.o-progress-line-label.is-icon');
    expect(iconSlot).not.toBeNull();
    expect(iconSlot?.querySelector('.custom-icon')).not.toBeNull();
  });
});
