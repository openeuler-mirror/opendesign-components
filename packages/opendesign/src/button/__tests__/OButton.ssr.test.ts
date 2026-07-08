import { test, expect, describe, afterEach } from 'vitest';
import { markRaw } from 'vue';
import OButton from '../OButton.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

// icon prop 透传组件时必须 markRaw，避免 Vue 把组件本身变成响应式对象
const OIconAdd = markRaw(OIconAddRaw);

/**
 * SSR 字符串渲染：调用 @vue/server-renderer 的 renderToString，
 * 在「无 window / 无 document」的服务端语义下把组件渲染成 HTML 字符串。
 *
 * 抓的是「服务端直接报错 / 输出 HTML 不符合预期」类问题：
 *   - 模块顶层访问 window/document/localStorage 等浏览器 API
 *   - props 默认值依赖运行时环境（如 () => window.innerWidth）
 *   - CSS 变量 / style 属性序列化错误
 *   - 动态组件 <component :is> 在服务端解析失败
 *
 * 抓不到「客户端首帧与服务端 HTML 不一致」类问题——那是下一个 describe 的事。
 */
describe('SSR 契约（字符串渲染）', () => {
  test('OButton SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OButton, {}, 'Click me')).resolves.toEqual(expect.any(String));
  });

  test('OButton SSR slot - HTML 输出包含 slot 文案', async () => {
    const html = await renderSSR(OButton, {}, 'Hello SSR');
    expect(html).toContain('Hello SSR');
  });

  test('OButton SSR disabled=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OButton, { disabled: true }, 'X')).resolves.toEqual(expect.any(String));
  });

  test('OButton SSR loading=true - 不影响 renderToString', async () => {
    await expect(renderSSR(OButton, { loading: true }, 'X')).resolves.toEqual(expect.any(String));
  });

  test('OButton SSR href=URL - HTML 输出 <a> 标签', async () => {
    const html = await renderSSR(OButton, { href: 'https://example.com' }, 'Link');
    expect(html).toMatch(/<a[^>]*href="https:\/\/example\.com"/);
  });

  // 验证 size prop 透传 defaultSize 全局 ref 在 SSR 下正常工作
  test('OButton SSR size=large - HTML 输出包含 o-btn-large 类', async () => {
    const html = await renderSSR(OButton, { size: 'large' }, 'X');
    expect(html).toMatch(/class="[^"]*o-btn-large/);
  });

  // 验证自定义 round 值序列化为 style 属性（CSS 变量在 SSR style 序列化的易错点）
  test('OButton SSR round=12px - HTML 输出包含 --btn-radius:12px 内联样式', async () => {
    const html = await renderSSR(OButton, { round: '12px' }, 'X');
    expect(html).toMatch(/--btn-radius:\s*12px/);
  });

  // 验证动态组件 <component :is="icon"> 在 SSR 路径下不抛错
  test('OButton SSR icon=OIconAdd - HTML 输出包含 svg 元素', async () => {
    const html = await renderSSR(OButton, { icon: OIconAdd }, 'X');
    expect(html).toContain('<svg');
  });

  // 验证 tag prop 切换根元素（通过内部 HtmlTag 组件路由）
  test('OButton SSR tag=div - HTML 根标签为 <div>', async () => {
    const html = await renderSSR(OButton, { tag: 'div' }, 'X');
    expect(html.trimStart()).toMatch(/^<div\b/);
  });
});

/**
 * 客户端水合（hydration）安全性检测：console.warn 为主。
 *
 * 通过 ssrHydrateAndCompare 拦截 Vue hydration 过程中的 console.warn 警告，
 * 检测是否存在水合 mismatch。textContent 对比和 Element 引用对比作为诊断字段保留。
 *
 * console.warn 覆盖的 mismatch 类型：
 *   - 文本值不同、节点类型不同、子节点数量不同
 *   - 非法 HTML 嵌套、Teleport 移出 root
 *   - class/style/属性 mismatch（check-only，Vue 只 warn 不 patch DOM）
 *
 * 不可突破的盲区：v-html 内容不同但文本相同（Vue 不 patch、不 warn、不替换 Element）。
 *
 * Browser Mode 环境共享限制：SSR 和客户端在同一浏览器上下文，
 * typeof window / window.innerWidth / navigator.userAgent 等两端一致，
 * 无法测试真实 Node.js SSR 与客户端环境差异。
 */
describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OButton hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, {}, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration disabled=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { disabled: true }, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration loading=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { loading: true }, 'Hi');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration href=URL - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { href: 'https://example.com' }, 'Link');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration size=large - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { size: 'large' }, 'X');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration round=12px - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { round: '12px' }, 'X');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration icon=OIconAdd - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { icon: OIconAdd }, 'X');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('OButton hydration tag=div - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OButton, { tag: 'div' }, 'X');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});
