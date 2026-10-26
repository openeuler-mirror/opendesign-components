/**
 * OOption ARIA 无障碍契约测试（依赖 inject 上下文）。
 *
 * 验证通过 select inject 上下文驱动的 ARIA 属性变化：
 *   - aria-selected 随 selectValue 变化
 *   - aria-disabled 随 limitReached 变化
 *
 * 纯静态 ARIA 属性（role="option"、无 inject 时的默认值）见
 * `OOption.index.test.ts`。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, computed, provide, ref } from 'vue';
import OOption from '../OOption.vue';
import { selectOptionInjectKey } from '../../select/provide';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 创建模拟 inject 上下文并渲染 OOption
 * @param props OOption props
 * @param injectOverrides inject 上下文覆盖值
 * @returns 渲染结果和 selectValue ref
 */
function renderWithInject(
  props: Record<string, unknown>,
  injectOverrides: {
    selectValue?: (string | number)[];
    limitReached?: boolean;
    multiple?: boolean;
  } = {},
) {
  const selectValueRef = ref(injectOverrides.selectValue ?? []);
  const mockInject = {
    select: () => Promise.resolve(),
    registerOption: () => {},
    unregisterOption: () => {},
    selectValue: selectValueRef,
    multiple: injectOverrides.multiple ?? false,
    limitReached: computed(() => injectOverrides.limitReached ?? false),
    renderLabelFn: computed(() => undefined),
  };

  const screen = render({
    setup() {
      provide(selectOptionInjectKey, mockInject);
      return () => h(OOption, props);
    },
  });

  return { screen, selectValueRef };
}

describe('aria-selected — 反映选中状态', () => {
  test('未选中时 aria-selected 为 false', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: [] },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-selected')).toBe('false');
  });

  test('选中时 aria-selected 为 true', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: ['a'] },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-selected')).toBe('true');
  });

  test('selectValue 变化后 aria-selected 同步更新', async () => {
    const { screen, selectValueRef } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: [] },
    );
    await flush();
    const root = screen.container.querySelector('.o-option') as HTMLElement;
    expect(root.getAttribute('aria-selected')).toBe('false');

    selectValueRef.value = ['a'];
    await flush();
    expect(root.getAttribute('aria-selected')).toBe('true');
  });

  test('多选模式 — 多个值选中时 aria-selected 仍正确', async () => {
    const { screen } = renderWithInject(
      { value: 'b', label: 'B' },
      { selectValue: ['a', 'b', 'c'], multiple: true },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-selected')).toBe('true');
  });
});

describe('aria-disabled — 反映有效禁用状态', () => {
  test('disabled prop 为 true 时 aria-disabled 为 true', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A', disabled: true },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
  });

  test('disabled prop 为 false 且无 limit 时无 aria-disabled', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-disabled')).toBeNull();
  });

  test('limitReached 且未选中时 aria-disabled 为 true', async () => {
    const { screen } = renderWithInject(
      { value: 'c', label: 'C' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
  });

  test('limitReached 但已选中时无 aria-disabled', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-disabled')).toBeNull();
  });

  test('limitReached 从 true 变 false 时 aria-disabled 同步移除', async () => {
    const { screen, selectValueRef } = renderWithInject(
      { value: 'c', label: 'C' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const root = screen.container.querySelector('.o-option') as HTMLElement;
    expect(root.getAttribute('aria-disabled')).toBe('true');

    // 选中此选项后不再被 limitReached 禁用
    selectValueRef.value = ['a', 'c'];
    await flush();
    expect(root.getAttribute('aria-disabled')).toBeNull();
  });
});
