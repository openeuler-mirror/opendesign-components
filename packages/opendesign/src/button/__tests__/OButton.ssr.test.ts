import { test, expect, describe, afterEach } from 'vitest';
import { markRaw } from 'vue';
import OButton from '../OButton.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { renderSSR, ssrThenHydrate, spyHydrationErrors } from '../../../__tests__/_helpers/ssr';

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
 * 客户端水合（hydration）：renderSSR → 把 HTML 注入真实 DOM → createSSRApp(...).mount(root, true)，
 * 模拟「服务端发 HTML → 浏览器接管响应式」的完整链路，监听 console.error 抓 mismatch 警告。
 *
 * 抓的是「服务端首帧 HTML 和客户端 hydrate 时的虚拟 DOM 不一致」类问题：
 *   - 随机/时间戳：Math.random()、Date.now()、new Date() 在 setup/模板中直接使用
 *   - 条件渲染依赖客户端状态：v-if="isClient" 类（除非两端首帧值一致，如 ref(false) + onMounted 改）
 *   - 时区差异导致的日期格式化输出不同
 *   - Teleport / OPopup 未包 ClientOnly
 *   - 无效 HTML 嵌套被浏览器自动修正（<div> 嵌 <p>、<a> 嵌 <a>）
 *
 * mismatch 只比对「服务端 renderToString 输出」vs「客户端首次 hydrate 时的虚拟 DOM」。
 * 水合完成后的更新（如 onMounted 内改 ref 触发的重渲染）不算 mismatch。
 */
describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OButton hydration default - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, {}, 'Hi');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration disabled=true - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { disabled: true }, 'Hi');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration loading=true - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { loading: true }, 'Hi');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration href=URL - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { href: 'https://example.com' }, 'Link');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration size=large - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { size: 'large' }, 'X');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration round=12px - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { round: '12px' }, 'X');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration icon=OIconAdd - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { icon: OIconAdd }, 'X');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });

  test('OButton hydration tag=div - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OButton, { tag: 'div' }, 'X');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });
});
