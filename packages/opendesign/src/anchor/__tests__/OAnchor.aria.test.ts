/**
 * OAnchor 导航地标 ARIA 契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OAnchor from '../OAnchor.vue';
import OAnchorItem from '../OAnchorItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OAnchor', () => {
  test('根节点设 role="navigation" 地标语义', async () => {
    const screen = render(OAnchor, {});
    await flush();
    const el = screen.container.querySelector('.o-anchor') as HTMLElement;
    expect(el.getAttribute('role')).toBe('navigation');
  });

  /**
   * 渲染「锚点 + 可滚动内容」并驱动激活态：OAnchor 的激活项由容器 scroll 事件
   * （rAF 节流）+ 逐项 getBoundingClientRect 比较驱动，这里走真实滚动路径验证镜像翻转。
   */
  const renderAnchorWithScroll = () => {
    return render({
      setup() {
        return () =>
          h('div', { style: 'display:flex; gap:16px; align-items:flex-start;' }, [
            h('div', { id: 'anc-scroll', style: 'height:200px; overflow:auto; flex:1;' }, [
              h('div', { id: 'anc-b1', style: 'height:300px;' }, 'b1'),
              h('div', { id: 'anc-b2', style: 'height:300px;' }, 'b2'),
            ]),
            h(OAnchor, { container: '#anc-scroll', targetOffset: 0, bounds: 5 }, () => [
              h(OAnchorItem, { href: '#anc-b1', title: 'b1' }),
              h(OAnchorItem, { href: '#anc-b2', title: 'b2' }),
            ]),
          ]);
      },
    });
  };

  test('激活项镜像 aria-current="location"，滚动切换后镜像随激活项翻转', async () => {
    const screen = renderAnchorWithScroll();
    await flush();
    const links = [...screen.container.querySelectorAll('.o-anchor-item-link')] as HTMLElement[];
    // 初始顶部：首个锚点激活，镜像当前区段位置（WAI-ARIA：文档内区段导航用 location）
    expect(links[0].getAttribute('aria-current')).toBe('location');
    expect(links[1].getAttribute('aria-current')).toBeNull();

    // 用户滚动到第二区段（真实路径），scroll 事件 → 重算激活项 → 镜像翻转
    const scroller = screen.container.querySelector('#anc-scroll') as HTMLElement;
    scroller.scrollTop = 310;
    scroller.dispatchEvent(new Event('scroll'));
    await flush();
    expect(links[0].getAttribute('aria-current')).toBeNull();
    expect(links[1].getAttribute('aria-current')).toBe('location');
  });

  test('disabled 项镜像 aria-disabled 并移出 Tab 序（tabindex="-1"）', async () => {
    const screen = render({
      setup() {
        return () => h(OAnchor, {}, () => [h(OAnchorItem, { href: '#b1', title: 'b1' }), h(OAnchorItem, { href: '#b2', title: 'b2', disabled: true })]);
      },
    });
    await flush();
    const links = [...screen.container.querySelectorAll('.o-anchor-item-link')] as HTMLElement[];
    expect(links[0].getAttribute('aria-disabled')).toBeNull();
    expect(links[0].getAttribute('tabindex')).toBeNull();
    expect(links[1].getAttribute('aria-disabled')).toBe('true');
    // disabled 锚点仍在 DOM 与 a11y 树中可读，但不参与 Tab 导航（OLink 先例口径）
    expect(links[1].getAttribute('tabindex')).toBe('-1');
  });

  test('disabled 项点击不跳转（aria-disabled 只是语义，拦截靠 preventDefault）', async () => {
    const screen = render({
      setup() {
        return () => h(OAnchor, {}, () => [h(OAnchorItem, { href: '#anc-target', title: 'b1', disabled: true })]);
      },
    });
    await flush();
    const link = screen.container.querySelector('.o-anchor-item-link') as HTMLElement;
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(ev);
    await flush();
    // 默认导航被拦截
    expect(ev.defaultPrevented).toBe(true);
    expect(location.hash).not.toBe('#anc-target');
  });

  test('未传 ariaLabel 时回退 i18n 默认词条，显式传入时覆盖', async () => {
    const bare = render(OAnchor, {});
    await flush();
    expect((bare.container.querySelector('.o-anchor') as HTMLElement).getAttribute('aria-label')).toBeTruthy();
    const explicit = render(OAnchor, { props: { ariaLabel: '本页目录' } });
    await flush();
    expect((explicit.container.querySelector('.o-anchor') as HTMLElement).getAttribute('aria-label')).toBe('本页目录');
  });
});
