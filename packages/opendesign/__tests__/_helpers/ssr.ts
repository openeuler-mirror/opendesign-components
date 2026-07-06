import { createSSRApp, h, type Component } from 'vue';
import { renderToString } from '@vue/server-renderer';

/** SSR 渲染组件，返回 HTML 字符串。可在浏览器或 node 环境运行。 */
export async function renderSSR(component: Component, props?: Record<string, unknown>, slotText?: string) {
  const app = createSSRApp({
    render: () => h(component, props, slotText ? { default: () => slotText } : undefined),
  });
  return await renderToString(app);
}

/** SSR → 注入 DOM → 客户端 hydrate（用于检测 hydration mismatch）。仅浏览器环境可用。 */
export async function ssrThenHydrate(component: Component, props: Record<string, unknown> = {}, slotText: string = ''): Promise<HTMLElement> {
  const html = await renderSSR(component, props, slotText);

  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);

  const clientApp = createSSRApp({
    render: () => h(component, props, slotText ? { default: () => slotText } : undefined),
  });
  clientApp.mount(root, true);
  return root;
}

/** 监听 console.error，检查是否出现 Hydration mismatch 警告。 */
export function spyHydrationErrors() {
  const errors: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
  };
  return {
    errors,
    hasHydrationMismatch: () => errors.some((e) => /[Hh]ydrat/.test(e)),
    restore: () => {
      console.error = original;
    },
  };
}
