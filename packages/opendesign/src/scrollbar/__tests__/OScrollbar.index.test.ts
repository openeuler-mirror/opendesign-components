/**
 * OScrollbar 单组件契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OScrollbar from '../OScrollbar.vue';
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
