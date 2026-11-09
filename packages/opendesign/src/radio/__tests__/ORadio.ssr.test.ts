/**
 * ORadio / ORadioGroup SSR 契约测试。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { defineComponent, h } from 'vue';
import ORadio from '../ORadio.vue';
import ORadioGroup from '../../radio-group/ORadioGroup.vue';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

/**
 * @description 构造「ORadioGroup 包裹多个 ORadio」的测试装置组件
 *
 * ssrHydrateAndCompare 仅支持字符串插槽，无法直接传入 ORadio 子节点；
 * 包一层 render 函数组件，让水合对比覆盖 group 注入 name 的完整链路
 * （group provide → radio inject → input[name] 属性）。
 *
 * @param groupProps 透传给 ORadioGroup 的 props（如显式 name）
 * @returns 可直接交给 renderSSR / ssrHydrateAndCompare 的组件定义
 */
function createGroupFixture(groupProps: Record<string, unknown> = {}) {
  return defineComponent({
    render: () =>
      h(ORadioGroup, groupProps, {
        default: () => [h(ORadio, { value: 'a' }), h(ORadio, { value: 'b' })],
      }),
  });
}

describe('SSR 契约（字符串渲染）', () => {
  test('ORadio SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ORadio, { value: 'a' }, 'Option')).resolves.toEqual(expect.any(String));
  });

  test('ORadio SSR defaultChecked=true - HTML 包含 o-radio-checked 类', async () => {
    const html = await renderSSR(ORadio, { value: 'a', defaultChecked: true }, 'A');
    expect(html).toMatch(/o-radio-checked/);
  });
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('ORadio hydration default - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORadio, { value: 'a' }, 'A');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });

  test('ORadio hydration defaultChecked=true - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORadio, { value: 'a', defaultChecked: true }, 'C');
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
  });
});

describe('SSR 契约（客户端水合）— ORadioGroup name 组关联', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('ORadioGroup 缺省 name 水合 - input[name] 双端一致，无水合 mismatch', async () => {
    // 缺省 name 时组名由组件自动生成：若生成依赖随机源（如 Math.random），
    // 服务端渲染值 A 与客户端水合值 B 不一致 → input[name] 属性 hydration mismatch
    const result = await ssrHydrateAndCompare(createGroupFixture());
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
    // 水合后组内所有 radio 仍共享同一 name（组关联契约不被水合破坏）
    const names = Array.from(mountedRoot.querySelectorAll('input[type=radio]')).map((el) => el.getAttribute('name'));
    expect(names[0]).toBeTruthy();
    expect(names[0]).toBe(names[1]);
  });

  test('ORadioGroup 显式 name 水合 - input[name] 双端一致，无水合 mismatch', async () => {
    // 显式 name 是确定值，双端天然一致；回归保护「prop 优先于自动生成」的契约
    const result = await ssrHydrateAndCompare(createGroupFixture({ name: 'my-group' }));
    mountedRoot = result.root;
    expect(result.hasMismatch).toBe(false);
    const input = mountedRoot.querySelector('input[type=radio]') as HTMLInputElement;
    expect(input.getAttribute('name')).toBe('my-group');
  });
});
