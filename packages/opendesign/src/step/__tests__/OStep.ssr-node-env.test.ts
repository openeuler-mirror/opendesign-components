/**
 * OStep Node.js 环境模拟 SSR 测试。
 *
 * 背景：OStep setup 顶层同步调用 useResizeObserver，在真实 Node.js SSR 环境
 * （如 Nuxt 预渲染）会因缺少 ResizeObserver 全局变量而抛错。Browser Mode 下
 * ResizeObserver 恒存在，需通过 runWithoutGlobals 移除后模拟服务端语义。
 *
 * ⚠️ 运行前提：use-resize-observer 内部存在模块级单例，一旦在浏览器环境中创建过，
 * 后续调用不再访问 ResizeObserver 全局变量。本文件必须独立运行（vitest 按文件
 * 隔离模块状态），不得与其他会 mount 组件的用例合并到同一文件。
 */
import { test, expect, describe } from 'vitest';
import OStep from '../OStep.vue';
import { renderSSR, runWithoutGlobals } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（Node.js 环境模拟：无 ResizeObserver）', () => {
  test('OStep 在无 ResizeObserver 的服务端环境 renderToString 不抛错', async () => {
    await expect(runWithoutGlobals(['ResizeObserver'], () => renderSSR(OStep))).resolves.toEqual(expect.any(String));
  });
});
