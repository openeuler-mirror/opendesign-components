/**
 * OPopup SSR 契约测试。
 *
 * 验证 SSR 字符串渲染 + 水合无 mismatch：
 *   - 触发元素（#target 插槽 + OChildOnly）在服务端正常输出；
 *   - 弹层内容由 ClientOnly 包裹，服务端不渲染、水合后客户端挂载，两端结构一致。
 */
import { test, expect, describe } from 'vitest';
import { defineComponent, h } from 'vue';
import OPopup from '../OPopup.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

/**
 * SSR 渲染宿主：#target 插槽在服务端可见（button），
 * default 插槽内容因 ClientOnly 包裹仅在客户端渲染。
 */
const PopupSsrHost = defineComponent({
  props: {
    visible: { type: Boolean },
    disabled: { type: Boolean },
    position: { type: String },
  },
  setup(props) {
    return () =>
      h(OPopup as any, props, {
        target: () => h('button', { class: 'ssr-target' }, 'SSR 触发元素'),
        default: () => h('div', { class: 'ssr-content' }, 'SSR 弹层内容'),
      });
  },
});

describe('SSR 契约（字符串渲染）', () => {
  test('OPopup SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(PopupSsrHost)).resolves.toEqual(expect.any(String));
  });

  test('OPopup SSR target - 触发元素在服务端 HTML 中输出', async () => {
    const html = await renderSSR(PopupSsrHost);
    expect(html).toContain('SSR 触发元素');
  });

  test('OPopup SSR 弹层内容 - 由 ClientOnly 包裹，服务端 HTML 不输出', async () => {
    const html = await renderSSR(PopupSsrHost);
    expect(html).not.toContain('SSR 弹层内容');
    expect(html).not.toContain('o-popup-wrap');
  });

  test('OPopup SSR disabled=true - 不影响 renderToString，触发元素仍输出', async () => {
    const html = await renderSSR(PopupSsrHost, { disabled: true });
    expect(html).toContain('SSR 触发元素');
  });

  test('OPopup SSR visible=true - 弹层内容仍不在服务端 HTML 中（避免水合 mismatch）', async () => {
    const html = await renderSSR(PopupSsrHost, { visible: true });
    expect(html).not.toContain('SSR 弹层内容');
  });
});

describe('水合契约（SSR → 客户端 hydrate）', () => {
  test('OPopup hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(PopupSsrHost);
    expect(result.hasMismatch).toBe(false);
  });

  test('OPopup hydration disabled=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(PopupSsrHost, { disabled: true });
    expect(result.hasMismatch).toBe(false);
  });
});
