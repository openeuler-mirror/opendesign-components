/**
 * OAvatar 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：click / error / load 事件
 *   3. 视觉契约：双主题
 *   4. 插槽契约：name / trigger-icon
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OAvatar from '../OAvatar.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OAvatar 根元素 class 包含 o-avatar + o-avatar-circle', async () => {
    const screen = render(OAvatar, {});
    await flush();
    const el = screen.container.querySelector('.o-avatar') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('o-avatar-circle')).toBe(true);
  });

  test('OAvatar url - 渲染 img 元素', async () => {
    const screen = render(OAvatar, { props: { url: 'https://example.com/avatar.png' } });
    await flush();
    const img = screen.container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('https://example.com/avatar.png');
  });

  test('OAvatar name - 无 url 时显示首字符', async () => {
    const screen = render(OAvatar, { props: { name: 'John' } });
    await flush();
    const el = screen.container.querySelector('.o-avatar') as HTMLElement;
    expect(el.classList.contains('o-avatar-text')).toBe(true);
    expect(el.textContent).toContain('J');
  });

  test('OAvatar - 无 url 无 name 时显示默认图标', async () => {
    const screen = render(OAvatar, {});
    await flush();
    const el = screen.container.querySelector('.o-avatar') as HTMLElement;
    expect(el.classList.contains('o-avatar-default')).toBe(true);
  });

  test('OAvatar clickable - 注入 o-avatar-clickable 类', async () => {
    const screen = render(OAvatar, { props: { clickable: true } });
    await flush();
    expect((screen.container.querySelector('.o-avatar') as HTMLElement).classList.contains('o-avatar-clickable')).toBe(true);
  });

  test('OAvatar clickable - 渲染 trigger-icon 容器', async () => {
    const screen = render(OAvatar, { props: { clickable: true } });
    await flush();
    expect(screen.container.querySelector('.o-avatar-trigger-icon')).not.toBeNull();
  });

  test('OAvatar objectFit - 透传到 img style', async () => {
    const screen = render(OAvatar, { props: { url: 'https://example.com/a.png', objectFit: 'cover' } });
    await flush();
    const img = screen.container.querySelector('img') as HTMLImageElement;
    expect(img.style.objectFit).toBe('cover');
  });

  test('OAvatar size - 数字写入 --avatar-size CSS 变量', async () => {
    const screen = render(OAvatar, { props: { size: 48 } });
    await flush();
    const el = screen.container.querySelector('.o-avatar') as HTMLElement;
    expect(el.style.getPropertyValue('--avatar-size')).toBe('48px');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OAvatar click - clickable=true 时 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OAvatar, { clickable: true, onClick }) });
    await flush();
    await screen.container.querySelector('.o-avatar')!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('OAvatar click - clickable=false 时不 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OAvatar, { onClick }) });
    await flush();
    await screen.container.querySelector('.o-avatar')!.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OAvatar name @${theme} - 文字模式有背景色`, async () => {
      const screen = render(OAvatar, { props: { name: 'Test' } });
      await flush();
      const el = screen.container.querySelector('.o-avatar') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const bg = el.style.getPropertyValue('--avatar-bg');
      expect(bg).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OAvatar slot=name - 替换首字符渲染', async () => {
    const screen = render(OAvatar, {
      props: { name: 'John' },
      slots: { name: () => h('span', { class: 'custom-name' }, 'Custom') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-name')).not.toBeNull();
  });

  test('OAvatar slot=trigger-icon - 替换编辑图标', async () => {
    const screen = render(OAvatar, {
      props: { clickable: true },
      slots: { 'trigger-icon': () => h('span', { class: 'custom-trigger' }, 'T') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-trigger')).not.toBeNull();
  });
});
