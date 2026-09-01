/**
 * OLink 路由契约测试。
 *
 * 验证 to / replace 属性与 RouterLink 的联动行为，
 * 以及无 vue-router 环境下的警告提示。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, defineComponent } from 'vue';
import { flush } from '../../../__tests__/_helpers/dom';
import OLink from '../OLink.vue';

/**
 * 模拟 RouterLink 组件，记录 to / replace 透传值。
 * 渲染为 <a> 标签并携带 data-to / data-replace 属性，便于断言。
 */
const MockRouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    to: { default: null },
    replace: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'a',
        {
          class: 'mock-router-link',
          'data-to': String(props.to),
          'data-replace': String(props.replace),
        },
        slots.default?.(),
      );
  },
});

describe('路由契约（to prop + RouterLink）', () => {
  test('OLink to - 注册了 RouterLink 时渲染为 RouterLink 并透传 to', async () => {
    const screen = render(OLink, {
      props: { to: '/home' },
      slots: { default: () => 'Home' },
      global: {
        components: { RouterLink: MockRouterLink },
      },
    });
    await flush();
    const el = screen.container.querySelector('.mock-router-link');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-to')).toBe('/home');
  });

  test('OLink replace - 透传 replace=true 给 RouterLink', async () => {
    const screen = render(OLink, {
      props: { to: '/home', replace: true },
      slots: { default: () => 'Home' },
      global: {
        components: { RouterLink: MockRouterLink },
      },
    });
    await flush();
    const el = screen.container.querySelector('.mock-router-link');
    expect(el?.getAttribute('data-replace')).toBe('true');
  });

  test('OLink replace - 默认 false 透传给 RouterLink', async () => {
    const screen = render(OLink, {
      props: { to: '/home' },
      slots: { default: () => 'Home' },
      global: {
        components: { RouterLink: MockRouterLink },
      },
    });
    await flush();
    const el = screen.container.querySelector('.mock-router-link');
    expect(el?.getAttribute('data-replace')).toBe('false');
  });

  test('OLink to - RouterLink 内部渲染 prefix/main/suffix 子结构', async () => {
    const screen = render(OLink, {
      props: { to: '/home', suffix: true },
      slots: { default: () => 'Home' },
      global: {
        components: { RouterLink: MockRouterLink },
      },
    });
    await flush();
    const routerLink = screen.container.querySelector('.mock-router-link');
    expect(routerLink?.querySelector('.o-link-main')).not.toBeNull();
    expect(routerLink?.querySelector('.o-link-suffix')).not.toBeNull();
  });
});

describe('路由警告契约（无 RouterLink 环境）', () => {
  test('OLink to - 无 vue-router 环境下 warn 提示用户并降级渲染', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const screen = render(OLink, {
      props: { to: '/home' },
      slots: { default: () => 'Home' },
    });
    await flush();
    const el = screen.container.querySelector('.o-link') as HTMLElement;
    // 验证降级渲染为普通 <a> 标签（而非 <routerlink> 自定义元素）
    expect(el?.tagName).toBe('A');
    // 验证 logger.warn 被调用，首参为 [OLink] 前缀，消息包含 RouterLink 关键字
    expect(warnSpy).toHaveBeenCalledWith('[OLink]', expect.stringContaining('RouterLink'));
    warnSpy.mockRestore();
  });
});
