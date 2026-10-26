/**
 * OOptionList 组件测试。
 *
 * OOptionList 是选项列表的滚动容器包装器，提供：
 *   - `.o-option-list` 根元素
 *   - `.o-options-container` 内部滚动容器
 *   - `wrapClass` prop → 透传到内部容器
 *   - `scrollbar` prop → 控制滚动条配置（true 使用默认、对象自定义）
 *   - 默认插槽 → 选项内容
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OOptionList from '../OOptionList.vue';
import OOption from '../OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR } from '../../../__tests__/_helpers/ssr';

describe('静态契约', () => {
  test('根元素 class 包含 o-option-list', async () => {
    const screen = render(OOptionList);
    await flush();
    expect(screen.container.querySelector('.o-option-list')).not.toBeNull();
  });

  test('内部容器 class 包含 o-options-container', async () => {
    const screen = render(OOptionList);
    await flush();
    expect(screen.container.querySelector('.o-options-container')).not.toBeNull();
  });

  test('默认插槽 — 渲染子内容', async () => {
    const screen = render(OOptionList, {
      slots: { default: () => h('div', { class: 'child' }, 'Content') },
    });
    await flush();
    expect(screen.container.querySelector('.child')).not.toBeNull();
  });

  test('默认插槽 — 嵌套 OOption 正常渲染', async () => {
    const screen = render(OOptionList, {
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
  });
});

describe('wrapClass — 透传到内部容器', () => {
  test('字符串 wrapClass 附加到 .o-options-container', async () => {
    const screen = render(OOptionList, { props: { wrapClass: 'custom-wrap' } });
    await flush();
    const container = screen.container.querySelector('.o-options-container') as HTMLElement;
    expect(container.classList.contains('custom-wrap')).toBe(true);
  });

  test('对象 wrapClass — 条件类名', async () => {
    const screen = render(OOptionList, {
      props: { wrapClass: { 'cond-true': true, 'cond-false': false } },
    });
    await flush();
    const container = screen.container.querySelector('.o-options-container') as HTMLElement;
    expect(container.classList.contains('cond-true')).toBe(true);
    expect(container.classList.contains('cond-false')).toBe(false);
  });

  test('数组 wrapClass — 多个类名', async () => {
    const screen = render(OOptionList, {
      props: { wrapClass: ['wrap-a', 'wrap-b'] },
    });
    await flush();
    const container = screen.container.querySelector('.o-options-container') as HTMLElement;
    expect(container.classList.contains('wrap-a')).toBe(true);
    expect(container.classList.contains('wrap-b')).toBe(true);
  });

  test('不传 wrapClass — 内部容器只有默认类', async () => {
    const screen = render(OOptionList);
    await flush();
    const container = screen.container.querySelector('.o-options-container') as HTMLElement;
    expect(container.classList.contains('o-options-container')).toBe(true);
    // 无额外的自定义类
    expect(container.classList.contains('custom-wrap')).toBe(false);
  });
});

describe('scrollbar — 滚动条配置', () => {
  test('scrollbar=true — 使用默认滚动条配置', async () => {
    const screen = render(OOptionList, { props: { scrollbar: true } });
    await flush();
    // scrollbar 通过 v-scrollbar 指令渲染 .o-scrollbar 组件
    // 验证不抛错且容器存在
    const container = screen.container.querySelector('.o-options-container');
    expect(container).not.toBeNull();
  });

  test('scrollbar 自定义配置 — 传递 showType 和 size', async () => {
    const screen = render(OOptionList, {
      props: { scrollbar: { showType: 'always', size: 'normal' } },
    });
    await flush();
    const container = screen.container.querySelector('.o-options-container');
    expect(container).not.toBeNull();
  });

  test('不传 scrollbar — 默认无滚动条配置', async () => {
    const screen = render(OOptionList);
    await flush();
    const container = screen.container.querySelector('.o-options-container');
    expect(container).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('renderToString 不抛出错误', async () => {
    await expect(renderSSR(OOptionList, {}, '')).resolves.toEqual(expect.any(String));
  });

  test('SSR 输出包含 o-option-list 和 o-options-container', async () => {
    const html = await renderSSR(OOptionList, {}, '');
    expect(html).toContain('o-option-list');
    expect(html).toContain('o-options-container');
  });

  test('SSR 带插槽内容 — 输出包含子内容', async () => {
    const html = await renderSSR(OOptionList, {}, 'Slot Content');
    expect(html).toContain('Slot Content');
  });
});
