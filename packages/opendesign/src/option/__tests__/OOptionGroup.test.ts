/**
 * OOptionGroup 组件测试。
 *
 * OOptionGroup 是简单的选项分组容器，提供：
 *   - `.o-option-group` 根元素
 *   - `name` prop → `.o-option-group-name` 标题
 *   - `name` 具名插槽 → 自定义标题渲染
 *   - 默认插槽 → 分组内选项内容
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OOptionGroup from '../OOptionGroup.vue';
import OOption from '../OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约', () => {
  test('根元素 class 包含 o-option-group', async () => {
    const screen = render(OOptionGroup);
    await flush();
    expect(screen.container.querySelector('.o-option-group')).not.toBeNull();
  });

  test('name prop — 渲染到 .o-option-group-name', async () => {
    const screen = render(OOptionGroup, { props: { name: 'Group A' } });
    await flush();
    const nameEl = screen.container.querySelector('.o-option-group-name');
    expect(nameEl?.textContent).toBe('Group A');
  });

  test('name 未传时 .o-option-group-name 为空', async () => {
    const screen = render(OOptionGroup);
    await flush();
    const nameEl = screen.container.querySelector('.o-option-group-name');
    expect(nameEl).not.toBeNull();
    expect(nameEl?.textContent).toBe('');
  });

  test('name 具名插槽 — 覆盖 name prop 渲染', async () => {
    const screen = render(OOptionGroup, {
      props: { name: 'Prop Title' },
      slots: { name: () => h('span', { class: 'custom-name' }, 'Slot Title') },
    });
    await flush();
    // 具名插槽替换了整个 .o-option-group-name 元素
    const custom = screen.container.querySelector('.custom-name');
    expect(custom).not.toBeNull();
    expect(custom?.textContent).toContain('Slot Title');
    // prop name 不应渲染到 DOM
    expect(screen.container.textContent).not.toContain('Prop Title');
  });

  test('默认插槽 — 渲染子内容', async () => {
    const screen = render(OOptionGroup, {
      slots: { default: () => h('div', { class: 'child' }, 'Content') },
    });
    await flush();
    expect(screen.container.querySelector('.child')).not.toBeNull();
    expect(screen.container.querySelector('.child')?.textContent).toContain('Content');
  });

  test('默认插槽 — 嵌套 OOption 正常渲染', async () => {
    const screen = render(OOptionGroup, {
      slots: {
        default: () => [
          h(OOption, { value: 'a', label: 'A' }),
          h(OOption, { value: 'b', label: 'B' }),
        ],
      },
    });
    await flush();
    const options = screen.container.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
    const labels = Array.from(options).map((o) => o.textContent);
    expect(labels).toContain('A');
    expect(labels).toContain('B');
  });
});

describe('SSR 契约', () => {
  test('renderToString 不抛出错误', async () => {
    await expect(renderSSR(OOptionGroup, { name: 'Group' }, '')).resolves.toEqual(expect.any(String));
  });

  test('SSR 输出包含 name 文本', async () => {
    const html = await renderSSR(OOptionGroup, { name: 'SSR Group' }, '');
    expect(html).toContain('SSR Group');
  });

  test('hydration — 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OOptionGroup, { name: 'Group' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
