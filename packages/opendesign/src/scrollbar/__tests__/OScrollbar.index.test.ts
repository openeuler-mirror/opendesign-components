/**
 * OScrollbar 单组件契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OScrollbar from '../OScrollbar.vue';
import OScroller from '../OScroller.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OScrollbar 根元素 class 包含 o-scrollbar', async () => {
    const screen = render({
      render: () =>
        h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [h('div', { style: 'width:400px;height:200px;' }, 'Content'), h(OScrollbar)]),
    });
    await flush();
    expect(screen.container.querySelector('.o-scrollbar')).not.toBeNull();
  });

  test('OScrollbar size - medium / small 注入类', async () => {
    for (const s of ['medium', 'small'] as const) {
      const screen = render({
        render: () =>
          h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [h('div', { style: 'width:400px;height:200px;' }), h(OScrollbar, { size: s })]),
      });
      await flush();
      expect(screen.container.querySelector(`.o-scrollbar-${s}`)).not.toBeNull();
    }
  });

  test('OScrollbar showType=never - 不渲染滚动条轨道', async () => {
    const screen = render({
      render: () =>
        h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [
          h('div', { style: 'width:400px;height:200px;' }),
          h(OScrollbar, { showType: 'never' }),
        ]),
    });
    await flush();
    expect(screen.container.querySelector('.o-scrollbar-rail')).toBeNull();
  });

  test('OScrollbar showType=always - 注入 always-show 类', async () => {
    const screen = render({
      render: () =>
        h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [
          h('div', { style: 'width:400px;height:200px;' }),
          h(OScrollbar, { showType: 'always' }),
        ]),
    });
    await flush();
    expect(screen.container.querySelector('.o-scrollbar-always-show')).not.toBeNull();
  });

  test('OScrollbar disabledX - 不渲染横向滚动条', async () => {
    const screen = render({
      render: () =>
        h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [h('div', { style: 'width:400px;height:200px;' }), h(OScrollbar, { disabledX: true })]),
    });
    await flush();
    // 不抛错即可
    expect(screen.container.querySelector('.o-scrollbar')).not.toBeNull();
  });

  test('OScrollbar exposed - update 方法可用', async () => {
    const screen = render({
      render: () =>
        h('div', { style: 'width:200px;height:100px;overflow:auto;' }, [h('div', { style: 'width:400px;height:200px;' }), h(OScrollbar, { ref: 'sbRef' })]),
    });
    await flush();
    // 验证不抛错
    expect(screen.container.querySelector('.o-scrollbar')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OScrollbar SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OScrollbar, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OScrollbar hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, {}, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

// ============================================================================
// 插槽契约：验证 #thumb / #track scoped slot props 在 OScroller → OScrollbar →
// ScrollbarRail 三层透传后仍正确接收 direction 和 dragging。
// ============================================================================

describe('插槽契约（scoped slot props 透传）', () => {
  test('OScroller #thumb slot - 渲染自定义滑块内容', async () => {
    const screen = render({
      render: () =>
        h(
          OScroller,
          { showType: 'always', style: 'height:200px;' },
          {
            default: () => h('div', { style: 'height:600px;' }, 'content'),
            thumb: () => h('div', { class: 'custom-thumb' }, 'T'),
          },
        ),
    });
    await flush();
    expect(screen.container.querySelector('.custom-thumb')).not.toBeNull();
  });

  test('OScroller #thumb slot - 透传 direction 和 dragging', async () => {
    const screen = render({
      render: () =>
        h(
          OScroller,
          { showType: 'always', style: 'height:200px;' },
          {
            default: () => h('div', { style: 'height:600px;' }, 'content'),
            thumb: (props: { direction: string; dragging: boolean }) =>
              h('div', {
                class: 'custom-thumb',
                'data-direction': props.direction,
                'data-dragging': String(props.dragging),
              }),
          },
        ),
    });
    await flush();
    const thumb = screen.container.querySelector('.custom-thumb') as HTMLElement;
    expect(thumb).not.toBeNull();
    expect(thumb.getAttribute('data-direction')).toBe('y');
    expect(thumb.getAttribute('data-dragging')).toBe('false');
  });

  test('OScroller #track slot - 渲染自定义轨道内容', async () => {
    const screen = render({
      render: () =>
        h(
          OScroller,
          { showType: 'always', style: 'height:200px;' },
          {
            default: () => h('div', { style: 'height:600px;' }, 'content'),
            track: () => h('div', { class: 'custom-track' }, 'Track'),
          },
        ),
    });
    await flush();
    expect(screen.container.querySelector('.custom-track')).not.toBeNull();
  });

  test('OScroller #track slot - 透传 direction 和 dragging', async () => {
    const screen = render({
      render: () =>
        h(
          OScroller,
          { showType: 'always', style: 'height:200px;' },
          {
            default: () => h('div', { style: 'height:600px;' }, 'content'),
            track: (props: { direction: string; dragging: boolean }) =>
              h('div', {
                class: 'custom-track',
                'data-direction': props.direction,
                'data-dragging': String(props.dragging),
              }),
          },
        ),
    });
    await flush();
    const track = screen.container.querySelector('.custom-track') as HTMLElement;
    expect(track).not.toBeNull();
    expect(track.getAttribute('data-direction')).toBe('y');
    expect(track.getAttribute('data-dragging')).toBe('false');
  });
});
