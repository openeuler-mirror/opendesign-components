/**
 * OAnchor 单组件契约测试。
 *
 * 组织原则（五维度）：
 *   1. 静态契约：按 types.ts prop 顺序（OAnchor + OAnchorItem）
 *   2. 动态契约：滚动激活 / 点击跳转 / disabled 阻断 / change 事件
 *   3. 视觉契约：双主题下 link 颜色 token wiring、h 布局背景跨主题对比
 *   4. 插槽契约：OAnchorItem default（子锚点嵌套）、title（自定义标题）
 *
 * 测试在真浏览器（Playwright Chromium）下运行，可真实滚动可滚动容器并触发 scroll 事件。
 */
import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OAnchor from '../OAnchor.vue';
import OAnchorItem from '../OAnchorItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

/**
 * 渲染「锚点 + 可滚动内容」组合：内容容器在前、OAnchor 在后，
 * 保证 OAnchor.onMounted 执行 querySelector(container) 时目标容器已挂载。
 *
 * 默认构造 3 个高度较大的内容块（每个 300px，容器 200px，总高 900px），
 * 使中段滚动时「剩余可滚动距离 ≥ 一屏」，避免底部兜底逻辑干扰正常段断言。
 */
const renderAnchorWithContent = (props: Record<string, unknown> = {}) => {
  return render({
    setup() {
      return () =>
        h('div', { style: 'display:flex; gap:16px; align-items:flex-start;' }, [
          h('div', { id: 'anc-scroll', style: 'height:200px; overflow:auto; flex:1;' }, [
            h('div', { id: 'anc-b1', style: 'height:300px;' }, 'b1'),
            h('div', { id: 'anc-b2', style: 'height:300px;' }, 'b2'),
            h('div', { id: 'anc-b3', style: 'height:300px;' }, 'b3'),
          ]),
          h(OAnchor, { container: '#anc-scroll', targetOffset: 0, bounds: 5, ...props }, () => [
            h(OAnchorItem, { href: '#anc-b1', title: 'b1' }),
            h(OAnchorItem, { href: '#anc-b2', title: 'b2' }),
            h(OAnchorItem, { href: '#anc-b3', title: 'b3' }),
          ]),
        ]);
    },
  });
};

/**
 * 取当前激活锚点的 href（无激活时为 null）。
 */
const activeHref = (container: HTMLElement): string | null => {
  const el = container.querySelector('.o-anchor-item-link.is-active') as HTMLAnchorElement | null;
  return el?.getAttribute('href') ?? null;
};

/**
 * 渲染短页面场景：容器 300px、内容 350px（maxScroll=50 < clientHeight），
 * 验证线性插值下调量在顶部/中间/底部三阶段的锚点激活行为。
 */
const renderShortPage = (props: Record<string, unknown> = {}) => {
  return render({
    setup() {
      return () =>
        h('div', { style: 'display:flex; gap:16px; align-items:flex-start;' }, [
          h('div', { id: 'anc-short-scroll', style: 'height:300px; overflow:auto; flex:1;' }, [
            h('div', { id: 'anc-s1', style: 'height:150px;' }, 's1'),
            h('div', { id: 'anc-s2', style: 'height:100px;' }, 's2'),
            h('div', { id: 'anc-s3', style: 'height:100px;' }, 's3'),
          ]),
          h(OAnchor, { container: '#anc-short-scroll', targetOffset: 10, bounds: 5, ...props }, () => [
            h(OAnchorItem, { href: '#anc-s1', title: 's1' }),
            h(OAnchorItem, { href: '#anc-s2', title: 's2' }),
            h(OAnchorItem, { href: '#anc-s3', title: 's3' }),
          ]),
        ]);
    },
  });
};

/**
 * 设置可滚动容器 scrollTop 并同步派发 scroll 事件，触发 OAnchor 的 onScroll → activeNearest。
 */
const scrollToY = async (container: HTMLElement, y: number) => {
  container.scrollTop = y;
  container.dispatchEvent(new Event('scroll'));
  await flush();
};

describe('静态契约（按 types.ts 属性）', () => {
  beforeEach(() => {
    // 清空地址栏 hash，避免 OAnchor.onMounted 误触发 scrollIntoView
    history.replaceState(null, '', '?');
  });

  test('OAnchor 根元素 - class 包含 o-anchor，默认 o-anchor-v', async () => {
    const screen = render(OAnchor);
    const el = screen.container.querySelector('.o-anchor') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('o-anchor-v')).toBe(true);
  });

  test('OAnchor layout - 各枚举值注入 o-anchor-{layout} 类，默认 v', async () => {
    for (const l of ['h', 'v'] as const) {
      const screen = render(OAnchor, { props: { layout: l } });
      const el = screen.container.querySelector('.o-anchor') as HTMLElement;
      expect(el.classList.contains(`o-anchor-${l}`)).toBe(true);
    }
    const def = render(OAnchor);
    expect((def.container.querySelector('.o-anchor') as HTMLElement).classList.contains('o-anchor-v')).toBe(true);
  });

  test('OAnchor size - 各枚举值注入 o-anchor-{size} 类，默认 medium', async () => {
    for (const s of ['medium', 'small', 'menu'] as const) {
      const screen = render(OAnchor, { props: { size: s } });
      const el = screen.container.querySelector('.o-anchor') as HTMLElement;
      expect(el.classList.contains(`o-anchor-${s}`)).toBe(true);
    }
    const def = render(OAnchor);
    expect((def.container.querySelector('.o-anchor') as HTMLElement).classList.contains('o-anchor-medium')).toBe(true);
  });

  test('OAnchorItem title - 渲染至 .o-anchor-item-title 文本', async () => {
    const screen = render(OAnchor, {
      slots: { default: () => h(OAnchorItem, { href: '#x', title: '标题A' }) },
    });
    const title = screen.container.querySelector('.o-anchor-item-title') as HTMLElement;
    expect(title.textContent).toBe('标题A');
  });

  test('OAnchorItem href - 透传至 a 标签 href 属性', async () => {
    const screen = render(OAnchor, {
      slots: { default: () => h(OAnchorItem, { href: '#target-1', title: 'A' }) },
    });
    const link = screen.container.querySelector('.o-anchor-item-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#target-1');
  });

  test('OAnchorItem target - 各值透传至 a 标签 target 属性，默认 _self', async () => {
    for (const t of ['_blank', '_parent', '_top', '_self'] as const) {
      const screen = render(OAnchor, {
        slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A', target: t }) },
      });
      const link = screen.container.querySelector('.o-anchor-item-link') as HTMLAnchorElement;
      expect(link.getAttribute('target')).toBe(t);
    }
    const def = render(OAnchor, { slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) } });
    expect((def.container.querySelector('.o-anchor-item-link') as HTMLAnchorElement).getAttribute('target')).toBe('_self');
  });

  test('OAnchorItem disabled - 注入 disabled 类', async () => {
    const screen = render(OAnchor, {
      slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A', disabled: true }) },
    });
    const link = screen.container.querySelector('.o-anchor-item-link') as HTMLElement;
    expect(link.classList.contains('disabled')).toBe(true);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  beforeEach(() => {
    history.replaceState(null, '', '?');
  });

  test('OAnchor scroll - 初始 scrollTop=0 时激活第一个锚点', async () => {
    const screen = renderAnchorWithContent();
    await flush();
    expect(activeHref(screen.container)).toBe('#anc-b1');
  });

  test('OAnchor scroll - 滚动至 b2 区域时激活 b2（正常段，阈值不下移）', async () => {
    const screen = renderAnchorWithContent();
    await flush();
    // 滚过 b1（300px），b2 顶部接近容器顶；剩余可滚动距离充足，downwardAdjustment=0
    await scrollToY(screen.container.querySelector('#anc-scroll') as HTMLElement, 350);
    expect(activeHref(screen.container)).toBe('#anc-b2');
  });

  test('OAnchor scroll - 滚动到底部时激活最后一个锚点（底部兜底）', async () => {
    const screen = renderAnchorWithContent();
    await flush();
    // 总高 900、容器 200，最大 scrollTop=700；到底时剩余可滚动距离为 0，观察线下移，末项 b3 被激活
    await scrollToY(screen.container.querySelector('#anc-scroll') as HTMLElement, 700);
    expect(activeHref(screen.container)).toBe('#anc-b3');
  });

  test('OAnchor scroll - 短页面顶部（scrollTop=0）激活第一个锚点而非最后一个', async () => {
    const screen = renderShortPage();
    await flush();
    // maxScroll=50 < clientHeight=300，顶部时插值因子=0，下调量为 0，threshold=targetOffset+bounds=15
    // 仅 s1(top≈0) 满足 top < 15，s2(150) / s3(250) 不满足
    expect(activeHref(screen.container)).toBe('#anc-s1');
  });

  test('OAnchor scroll - 短页面中间（scrollTop=25）激活中间锚点', async () => {
    const screen = renderShortPage();
    await flush();
    // 插值因子=0.5，下调量=137.5，threshold=152.5；s1(-25) / s2(125) 通过，s3(225) 不通过
    await scrollToY(screen.container.querySelector('#anc-short-scroll') as HTMLElement, 25);
    expect(activeHref(screen.container)).toBe('#anc-s2');
  });

  test('OAnchor scroll - 短页面底部（scrollTop=50）激活最后一个锚点', async () => {
    const screen = renderShortPage();
    await flush();
    // 插值因子=1，下调量取满=300，threshold=315；s1(-50) / s2(100) / s3(200) 全部通过，选 max → s3
    await scrollToY(screen.container.querySelector('#anc-short-scroll') as HTMLElement, 50);
    expect(activeHref(screen.container)).toBe('#anc-s3');
  });

  test('OAnchor change - active 切换时 emit change(link)', async () => {
    const onChange = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h('div', [
            h('div', { id: 'anc-scroll', style: 'height:200px; overflow:auto;' }, [
              h('div', { id: 'anc-b1', style: 'height:300px;' }, 'b1'),
              h('div', { id: 'anc-b2', style: 'height:300px;' }, 'b2'),
            ]),
            h(OAnchor, { container: '#anc-scroll', onChange }, () => [
              h(OAnchorItem, { href: '#anc-b1', title: 'b1' }),
              h(OAnchorItem, { href: '#anc-b2', title: 'b2' }),
            ]),
          ]);
      },
    });
    await flush();
    onChange.mockClear();
    // 初始 active=b1，滚至 b2 触发 change('#anc-b2')
    await scrollToY(screen.container.querySelector('#anc-scroll') as HTMLElement, 350);
    expect(onChange).toHaveBeenCalledWith('#anc-b2');
  });

  test('OAnchorItem click - 点击锚点项时 emit item-click 事件', async () => {
    const onItemClick = vi.fn();
    const screen = render(OAnchor, {
      slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A', onItemClick }) },
    });
    await flush();
    const link = screen.container.querySelector('.o-anchor-item-link') as HTMLElement;
    await link.click();
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  test('OAnchorItem disabled - 禁用时点击阻断跳转（active 不变）', async () => {
    const screen = render({
      setup() {
        return () =>
          h('div', [
            h('div', { id: 'anc-scroll', style: 'height:200px; overflow:auto;' }, [
              h('div', { id: 'anc-b1', style: 'height:300px;' }, 'b1'),
              h('div', { id: 'anc-b2', style: 'height:300px;' }, 'b2'),
            ]),
            h(OAnchor, { container: '#anc-scroll' }, () => [
              h(OAnchorItem, { href: '#anc-b1', title: 'b1' }),
              // b2 禁用，点击不应触发跳转
              h(OAnchorItem, { href: '#anc-b2', title: 'b2', disabled: true }),
            ]),
          ]);
      },
    });
    await flush();
    const initial = activeHref(screen.container);
    const disabledLink = screen.container.querySelectorAll('.o-anchor-item-link')[1] as HTMLElement;
    await disabledLink.click();
    await flush();
    // active 仍为初始值（未跳到 b2）
    expect(activeHref(screen.container)).toBe(initial);
    expect(activeHref(screen.container)).not.toBe('#anc-b2');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OAnchor link 颜色 token wiring @${theme} - 5 态颜色 token 互不相同`, async () => {
      const screen = render(OAnchor, {
        slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) },
      });
      const link = screen.container.querySelector('.o-anchor-item-link') as HTMLElement;
      paintThemed(screen.container, theme, link);
      const cs = getComputedStyle(link);
      const tokens = new Set([
        cs.getPropertyValue('--anchor-item-link-color').trim(),
        cs.getPropertyValue('--anchor-item-link-color-active').trim(),
        cs.getPropertyValue('--anchor-item-link-color-hover').trim(),
        cs.getPropertyValue('--anchor-item-link-color-press').trim(),
        cs.getPropertyValue('--anchor-item-link-color-disabled').trim(),
      ]);
      expect(tokens.size).toBe(5);
    });

    test(`OAnchor h 布局背景 @${theme} - backgroundColor 解析为非透明色`, async () => {
      const screen = render(OAnchor, {
        props: { layout: 'h' },
        slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) },
      });
      const el = screen.container.querySelector('.o-anchor-h') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
    });
  }

  test('OAnchor h 布局背景 - light / dark 下 backgroundColor 解析值不同', async () => {
    const lightScreen = render(OAnchor, {
      props: { layout: 'h' },
      slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) },
    });
    const darkScreen = render(OAnchor, {
      props: { layout: 'h' },
      slots: { default: () => h(OAnchorItem, { href: '#x', title: 'A' }) },
    });
    const elL = lightScreen.container.querySelector('.o-anchor-h') as HTMLElement;
    const elD = darkScreen.container.querySelector('.o-anchor-h') as HTMLElement;
    paintThemed(lightScreen.container, 'e.light', elL);
    paintThemed(darkScreen.container, 'e.dark', elD);
    expect(getComputedStyle(elL).backgroundColor).not.toBe(getComputedStyle(elD).backgroundColor);
  });
});

describe('插槽契约（具名插槽）', () => {
  test('OAnchorItem slot=default - 子锚点嵌套渲染（depth +1，sub-link 类）', async () => {
    const screen = render(OAnchor, {
      slots: {
        default: () => h(OAnchorItem, { href: '#parent', title: '父' }, () => [h(OAnchorItem, { href: '#child', title: '子' })]),
      },
    });
    await flush();
    const child = screen.container.querySelector('[href="#child"]') as HTMLElement;
    expect(child).not.toBeNull();
    expect(child.classList.contains('o-anchor-item-sub-link')).toBe(true);
    expect(child.getAttribute('data-depth')).toBe('1');
  });

  test('OAnchorItem slot=title - 自定义标题内容替换默认文本', async () => {
    const screen = render(OAnchor, {
      slots: {
        default: () => h(OAnchorItem, { href: '#x' }, { title: () => h('span', { class: 'custom-title' }, '自定义') }),
      },
    });
    await flush();
    // title 具名插槽替换默认 .o-anchor-item-title div，直接渲染传入内容
    const custom = screen.container.querySelector('.custom-title') as HTMLElement | null;
    expect(custom).not.toBeNull();
    expect(custom?.textContent).toBe('自定义');
  });
});
