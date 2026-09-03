/**
 * OScrollbar / OScroller SSR 兼容性测试。
 *
 * 抓的问题：
 *   - 模块顶层或 setup 同步段访问 window/document/ResizeObserver 等浏览器 API（会让 renderToString 报错）
 *   - props 默认值依赖运行时环境
 *   - hydration mismatch（console.warn 为主检测，textContent / Element 引用为诊断字段）
 *
 * console.warn 覆盖的 mismatch 类型：
 *   - 文本值不同（随机值/时间戳）、节点类型不同、子节点数量不同
 *   - class/style/属性 mismatch（check-only，Vue 只 warn 不 patch DOM）
 *   - 非法 HTML 嵌套被浏览器修正、Teleport 移出 root
 *
 * 唯一盲区：v-html 内容不同但文本相同。
 *
 * 抓不到的：像素级渲染差异、:hover/:active 视觉切换、真实 SSR（Node.js）环境差异。
 */
import { test, expect, describe, afterEach, vi } from 'vitest';
import { h, defineComponent, withDirectives } from 'vue';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import OScrollbar from '../OScrollbar.vue';
import OScroller from '../OScroller.vue';
import { vScrollbar } from '../vScrollbar';
import { useScrollbar } from '../use-scrollbar';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约 - OScrollbar（字符串渲染）', () => {
  test('OScrollbar SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OScrollbar, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OScrollbar SSR showType=always - HTML 包含 always-show 类', async () => {
    const html = await renderSSR(OScrollbar, { showType: 'always' }, '');
    expect(html).toMatch(/o-scrollbar-always-show/);
    expect(html).toMatch(/o-scrollbar-visible/);
  });

  test('OScrollbar SSR showType=always + autoUpdateOnScrollSize - 不抛出错误', async () => {
    const html = await renderSSR(OScrollbar, { showType: 'always', autoUpdateOnScrollSize: true }, '');
    expect(html).toMatch(/o-scrollbar-always-show/);
  });

  test('OScrollbar SSR showType=hover - HTML 包含 hover-show 类', async () => {
    const html = await renderSSR(OScrollbar, { showType: 'hover' }, '');
    expect(html).toMatch(/o-scrollbar-hover-show/);
  });

  test('OScrollbar SSR showType=never - HTML 不包含 rail 元素', async () => {
    const html = await renderSSR(OScrollbar, { showType: 'never' }, '');
    expect(html).not.toMatch(/o-scrollbar-rail/);
  });

  test('OScrollbar SSR size=small - HTML 包含 small 类', async () => {
    const html = await renderSSR(OScrollbar, { size: 'small' }, '');
    expect(html).toMatch(/o-scrollbar-small/);
  });

  test('OScrollbar SSR disabledX + disabledY - 不抛出错误', async () => {
    await expect(renderSSR(OScrollbar, { disabledX: true, disabledY: true }, '')).resolves.toEqual(expect.any(String));
  });

  test('OScrollbar SSR barClass - HTML 包含自定义类', async () => {
    const html = await renderSSR(OScrollbar, { barClass: 'custom-bar' }, '');
    expect(html).toContain('custom-bar');
  });
});

describe('SSR 契约 - OScroller（字符串渲染）', () => {
  test('OScroller SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OScroller, {}, 'content')).resolves.toEqual(expect.any(String));
  });

  test('OScroller SSR with content - HTML 包含内容文本', async () => {
    const html = await renderSSR(OScroller, {}, 'Hello World');
    expect(html).toContain('Hello World');
  });

  test('OScroller SSR showType=always - HTML 包含 always-show 类', async () => {
    const html = await renderSSR(OScroller, { showType: 'always' }, 'content');
    expect(html).toMatch(/o-scrollbar-always-show/);
    expect(html).toMatch(/o-scrollbar-visible/);
  });

  test('OScroller SSR showType=always + autoUpdateOnScrollSize - 不抛出错误', async () => {
    const html = await renderSSR(OScroller, { showType: 'always', autoUpdateOnScrollSize: true }, 'content');
    expect(html).toMatch(/o-scrollbar-always-show/);
  });

  test('OScroller SSR size=small - HTML 包含 small 类', async () => {
    const html = await renderSSR(OScroller, { size: 'small' }, 'content');
    expect(html).toMatch(/o-scrollbar-small/);
  });

  test('OScroller SSR disabledX - HTML 包含 is-x-disabled 类', async () => {
    const html = await renderSSR(OScroller, { disabledX: true }, 'content');
    expect(html).toMatch(/is-x-disabled/);
  });

  test('OScroller SSR disabledY - HTML 包含 is-y-disabled 类', async () => {
    const html = await renderSSR(OScroller, { disabledY: true }, 'content');
    expect(html).toMatch(/is-y-disabled/);
  });

  test('OScroller SSR wrapClass - HTML 包含自定义容器类', async () => {
    const html = await renderSSR(OScroller, { wrapClass: 'custom-wrap' }, 'content');
    expect(html).toContain('custom-wrap');
  });
});

describe('SSR 契约 - OScrollbar（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OScrollbar hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, {}, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration showType=always - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { showType: 'always' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration showType=always + autoUpdateOnScrollSize - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { showType: 'always', autoUpdateOnScrollSize: true }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration showType=hover - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { showType: 'hover' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration showType=never - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { showType: 'never' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration size=small - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { size: 'small' }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScrollbar hydration disabledX + disabledY - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { disabledX: true, disabledY: true }, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

describe('SSR 契约 - OScroller（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OScroller hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, {}, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration with content - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, {}, 'Scrollable Content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration showType=always - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { showType: 'always' }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration showType=always + autoUpdateOnScrollSize - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { showType: 'always', autoUpdateOnScrollSize: true }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration size=small - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { size: 'small' }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration disabledX - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { disabledX: true }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration disabledY - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { disabledY: true }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration showType=hover - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { showType: 'hover' }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OScroller hydration showType=never - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScroller, { showType: 'never' }, 'content');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

describe('SSR 契约 - console 错误拦截', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OScroller SSR showType=always + autoUpdateOnScrollSize - 无 console error', async () => {
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : '')).join(' '));
    };
    try {
      await renderSSR(OScroller, { showType: 'always', autoUpdateOnScrollSize: true }, 'content');
    } finally {
      console.error = originalError;
    }
    expect(errors).toHaveLength(0);
  });

  test('OScrollbar SSR showType=always + autoUpdateOnScrollSize - 无 console error', async () => {
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : '')).join(' '));
    };
    try {
      await renderSSR(OScrollbar, { showType: 'always', autoUpdateOnScrollSize: true }, '');
    } finally {
      console.error = originalError;
    }
    expect(errors).toHaveLength(0);
  });

  test('OScroller hydration showType=always + autoUpdateOnScrollSize - 无 console error', async () => {
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : '')).join(' '));
    };
    try {
      const result = await ssrHydrateAndCompare(OScroller, { showType: 'always', autoUpdateOnScrollSize: true }, 'content');
      mountedRoot = result.root;
    } finally {
      console.error = originalError;
    }
    expect(errors).toHaveLength(0);
  });
});

describe('SSR 契约 - vScrollbar 指令', () => {
  test('vScrollbar SSR - renderToString 不抛出错误（指令 mounted 不在 SSR 执行）', async () => {
    const TestComp = defineComponent({
      setup() {
        return () => withDirectives(h('div', { style: 'width:200px;height:100px;overflow:auto' }, 'content'), [[vScrollbar, false]]);
      },
    });
    const app = createSSRApp({
      render: () => h(TestComp),
    });
    const html = await renderToString(app);
    expect(html).toContain('content');
  });

  test('vScrollbar hydration - 无水合 mismatch', async () => {
    const TestComp = defineComponent({
      setup() {
        return () => withDirectives(h('div', { style: 'width:200px;height:100px;overflow:auto' }, 'content'), [[vScrollbar, false]]);
      },
    });
    const result = await ssrHydrateAndCompare(TestComp, {}, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});

describe('SSR 契约 - useScrollbar composable', () => {
  test('useScrollbar 在浏览器环境中调用不抛出错误', async () => {
    const targetEl = document.createElement('div');
    targetEl.style.cssText = 'width:200px;height:100px;overflow:auto';
    targetEl.innerHTML = '<div style="width:400px;height:200px">content</div>';
    document.body.appendChild(targetEl);

    try {
      const { unmount } = useScrollbar({ target: targetEl, showType: 'always' });
      unmount();
    } finally {
      targetEl.remove();
    }
  });
});

// ============================================================================
// 插槽 SSR 契约：验证 #thumb / #track scoped slot 在 SSR 渲染和水合时不报错。
// SSR 期间 onMounted 未执行，ScrollbarRail 不渲染（hasX/hasY 为 false），
// 插槽内容不输出到 SSR HTML，但插槽定义和透传机制不应导致 SSR 错误或水合 mismatch。
// ============================================================================

describe('SSR 契约 - OScroller 插槽（#thumb / #track scoped slot props）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  /** 包装组件：OScroller + #thumb/#track scoped slot，用于 SSR 测试 */
  const SlotComp = defineComponent({
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
          track: (props: { direction: string; dragging: boolean }) =>
            h('div', {
              class: 'custom-track',
              'data-direction': props.direction,
              'data-dragging': String(props.dragging),
            }),
        },
      ),
  });

  test('OScroller SSR with #thumb/#track slots - renderToString 不抛出错误', async () => {
    await expect(renderSSR(SlotComp, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('OScroller hydration with #thumb/#track slots - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(SlotComp, {}, '');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

/**
 * SSR 修复验证：OScrollbar 使用字符串 target 时 resolveHtmlElement 已移入 onMounted，
 * SSR 期间不再访问 document.querySelector，init() 不再在 SSR 期间执行。
 */
describe('SSR 契约 - OScrollbar target=body（字符串选择器）', () => {
  afterEach(() => {
    document.documentElement.classList.remove('o-scrollbar-container');
  });

  test('OScrollbar SSR target=body - SSR 期间不访问 document.querySelector', async () => {
    const querySelectorSpy = vi.spyOn(document, 'querySelector');
    await renderSSR(OScrollbar, { target: 'body' }, '');
    expect(querySelectorSpy).not.toHaveBeenCalled();
    querySelectorSpy.mockRestore();
  });

  test('OScrollbar SSR target=body - init() 不在 SSR 期间执行，documentElement 无 o-scrollbar-container 类', async () => {
    expect(document.documentElement.classList.contains('o-scrollbar-container')).toBe(false);
    await renderSSR(OScrollbar, { target: 'body' }, '');
    expect(document.documentElement.classList.contains('o-scrollbar-container')).toBe(false);
  });

  test('OScrollbar SSR target=body - HTML 不包含 o-scrollbar-to-body（isBody 未在 SSR 期间修改）', async () => {
    const html = await renderSSR(OScrollbar, { target: 'body' }, '');
    expect(html).not.toMatch(/o-scrollbar-to-body/);
  });

  test('OScrollbar hydration target=body - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OScrollbar, { target: 'body' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
