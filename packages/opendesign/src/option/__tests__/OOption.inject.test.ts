/**
 * OOption inject 上下文测试。
 *
 * OOption 通过 `selectOptionInjectKey` 从 OSelect 注入以下能力：
 *   - `select(option)` — 点击选项时通知父选择器
 *   - `registerOption(option)` — 挂载时注册到父选择器的 optionInfoMap
 *   - `unregisterOption(option)` — 卸载时从 optionInfoMap 清理
 *   - `selectValue` — 当前已选值数组（驱动 active 状态）
 *   - `multiple` — 是否多选（驱动复选框渲染）
 *   - `limitReached` — 多选已达上限（驱动 effectiveDisabled）
 *   - `renderLabelFn` — 自定义 label 渲染函数
 *
 * 本测试通过 provide 模拟 inject 上下文，验证上述交互契约。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, computed, provide, ref } from 'vue';
import OOption from '../OOption.vue';
import { selectOptionInjectKey } from '../../select/provide';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 创建模拟的 inject 上下文并渲染 OOption
 * @param props OOption props
 * @param overrides inject 上下文覆盖值
 * @returns 渲染结果和 mock 函数引用
 */
function renderWithInject(
  props: Record<string, unknown>,
  overrides: {
    selectValue?: (string | number)[];
    multiple?: boolean;
    limitReached?: boolean;
    select?: ReturnType<typeof vi.fn>;
    registerOption?: ReturnType<typeof vi.fn>;
    unregisterOption?: ReturnType<typeof vi.fn>;
    renderLabelFn?: (option: Record<string, unknown>, selected: boolean) => unknown;
    slots?: Record<string, () => unknown>;
  } = {},
) {
  const selectValueRef = ref(overrides.selectValue ?? []);
  const selectMock = overrides.select ?? vi.fn().mockResolvedValue(undefined);
  const registerMock = overrides.registerOption ?? vi.fn();
  const unregisterMock = overrides.unregisterOption ?? vi.fn();
  const mockInject = {
    select: selectMock,
    registerOption: registerMock,
    unregisterOption: unregisterMock,
    selectValue: selectValueRef,
    multiple: overrides.multiple ?? false,
    limitReached: computed(() => overrides.limitReached ?? false),
    renderLabelFn: computed(() => overrides.renderLabelFn),
  };

  const screen = render({
    setup() {
      provide(selectOptionInjectKey, mockInject);
      return () => h(OOption, props, overrides.slots);
    },
  });

  return { screen, selectValueRef, selectMock, registerMock, unregisterMock };
}

describe('registerOption — 挂载时注册选项', () => {
  test('挂载时调用 registerOption 传递 label + value', async () => {
    const { registerMock } = renderWithInject(
      { value: 'a', label: 'Label A' },
    );
    await flush();
    expect(registerMock).toHaveBeenCalledWith({ label: 'Label A', value: 'a' });
  });

  test('label 未传时 registerOption 用 value 字符串作 label', async () => {
    const { registerMock } = renderWithInject(
      { value: 42 },
    );
    await flush();
    expect(registerMock).toHaveBeenCalledWith({ label: '42', value: 42 });
  });

  test('label 变化时重新注册新 label', async () => {
    const { screen, registerMock } = renderWithInject(
      { value: 'a', label: 'Old' },
    );
    await flush();
    expect(registerMock).toHaveBeenCalledWith({ label: 'Old', value: 'a' });

    await screen.rerender({ value: 'a', label: 'New' });
    await flush();
    expect(registerMock).toHaveBeenCalledWith({ label: 'New', value: 'a' });
  });
});

describe('unregisterOption — 卸载时清理选项', () => {
  test('卸载时调用 unregisterOption', async () => {
    const { screen, unregisterMock } = renderWithInject(
      { value: 'a', label: 'A' },
    );
    await flush();
    expect(unregisterMock).not.toHaveBeenCalled();

    await screen.unmount();
    expect(unregisterMock).toHaveBeenCalledWith({ label: 'A', value: 'a' });
  });

  test('卸载时 label 未传则用 value 字符串作 label', async () => {
    const { screen, unregisterMock } = renderWithInject(
      { value: 'x' },
    );
    await flush();
    await screen.unmount();
    expect(unregisterMock).toHaveBeenCalledWith({ label: 'x', value: 'x' });
  });
});

describe('select — 点击通知父选择器', () => {
  test('点击选项时调用 select 传递 label + value', async () => {
    const { screen, selectMock } = renderWithInject(
      { value: 'b', label: 'B' },
    );
    await flush();
    const option = screen.container.querySelector('.o-option') as HTMLElement;
    await option.click();
    expect(selectMock).toHaveBeenCalledWith({ label: 'B', value: 'b' });
  });

  test('disabled prop 为 true 时点击不调用 select', async () => {
    const { screen, selectMock } = renderWithInject(
      { value: 'a', label: 'A', disabled: true },
    );
    await flush();
    const option = screen.container.querySelector('.o-option') as HTMLElement;
    await option.click();
    expect(selectMock).not.toHaveBeenCalled();
  });

  test('label 未传时 select 用 value 字符串作 label', async () => {
    const { screen, selectMock } = renderWithInject(
      { value: 99 },
    );
    await flush();
    const option = screen.container.querySelector('.o-option') as HTMLElement;
    await option.click();
    expect(selectMock).toHaveBeenCalledWith({ label: '99', value: 99 });
  });
});

describe('active 状态 — selectValue 驱动选中样式', () => {
  test('value 在 selectValue 中时 o-option-item 含 active 类', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: ['a', 'b'] },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('active')).toBe(true);
  });

  test('value 不在 selectValue 中时无 active 类', async () => {
    const { screen } = renderWithInject(
      { value: 'c', label: 'C' },
      { selectValue: ['a', 'b'] },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('active')).toBe(false);
  });

  test('selectValue 动态变化时 active 状态同步更新', async () => {
    const { screen, selectValueRef } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: [] },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('active')).toBe(false);

    // 模拟选中
    selectValueRef.value = ['a'];
    await flush();
    expect(item.classList.contains('active')).toBe(true);
  });

  test('active 时 aria-selected 为 true', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: ['a'] },
    );
    await flush();
    const root = screen.container.querySelector('.o-option');
    expect(root?.getAttribute('aria-selected')).toBe('true');
  });
});

describe('effectiveDisabled — limit 达上限禁用未选项', () => {
  test('limitReached 且未选中时注入 o-option-disabled 类', async () => {
    const { screen } = renderWithInject(
      { value: 'c', label: 'C' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('o-option-disabled')).toBe(true);
  });

  test('limitReached 但已选中时不注入 o-option-disabled 类', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('o-option-disabled')).toBe(false);
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

  test('limitReached 时仍允许点击（触发 exceed-limit 逻辑）', async () => {
    const { screen, selectMock } = renderWithInject(
      { value: 'c', label: 'C' },
      { selectValue: ['a'], limitReached: true },
    );
    await flush();
    const option = screen.container.querySelector('.o-option') as HTMLElement;
    await option.click();
    // limit 场景不禁止点击，由 select 回调处理
    expect(selectMock).toHaveBeenCalledWith({ label: 'C', value: 'c' });
  });

  test('disabled prop 优先于 limitReached — 禁止点击', async () => {
    const { screen, selectMock } = renderWithInject(
      { value: 'c', label: 'C', disabled: true },
      { selectValue: [], limitReached: true },
    );
    await flush();
    const option = screen.container.querySelector('.o-option') as HTMLElement;
    await option.click();
    // disabled prop 为 true 时不调用 select
    expect(selectMock).not.toHaveBeenCalled();
  });
});

describe('multiple — 多选模式渲染复选框', () => {
  test('multiple=true 时 o-option-item 含 o-option-multiple 类', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { multiple: true },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('o-option-multiple')).toBe(true);
  });

  test('multiple=false 时无 o-option-multiple 类', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { multiple: false },
    );
    await flush();
    const item = screen.container.querySelector('.o-option-item') as HTMLElement;
    expect(item.classList.contains('o-option-multiple')).toBe(false);
  });

  test('multiple=true 时渲染 OCheckbox 组件', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { multiple: true },
    );
    await flush();
    // OCheckbox 渲染为 .o-checkbox
    const checkbox = screen.container.querySelector('.o-checkbox');
    expect(checkbox).not.toBeNull();
  });

  test('multiple=false 时不渲染 OCheckbox', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      { multiple: false },
    );
    await flush();
    const checkbox = screen.container.querySelector('.o-checkbox');
    expect(checkbox).toBeNull();
  });

  test('multiple + indeterminate — OCheckbox 收到 indeterminate prop', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A', indeterminate: true },
      { multiple: true },
    );
    await flush();
    // indeterminate 在 OCheckbox 上表现为 .o-checkbox-indeterminate 类
    const checkbox = screen.container.querySelector('.o-checkbox');
    expect(checkbox).not.toBeNull();
    // OCheckbox 渲染了 indeterminate 样式
    expect(checkbox?.classList.contains('o-checkbox-indeterminate')).toBe(true);
  });
});

describe('renderLabelFn — 自定义 label 渲染', () => {
  test('renderLabelFn 存在时使用其返回值替代默认文本', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      {
        renderLabelFn: (option: Record<string, unknown>, _selected: boolean) =>
          h('span', { class: 'custom-label' }, `Custom: ${option.label}`),
      },
    );
    await flush();
    const custom = screen.container.querySelector('.custom-label');
    expect(custom).not.toBeNull();
    expect(custom?.textContent).toContain('Custom: A');
  });

  test('renderLabelFn 接收 selected 参数反映选中状态', async () => {
    let receivedSelected = null;
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      {
        selectValue: ['a'],
        renderLabelFn: (_option: Record<string, unknown>, selected: boolean) => {
          receivedSelected = selected;
          return h('span', { class: 'lbl' }, optionLabel(_option, selected));
        },
      },
    );
    await flush();
    expect(receivedSelected).toBe(true);
    const lbl = screen.container.querySelector('.lbl');
    expect(lbl).not.toBeNull();
  });

  test('raw prop 中的自定义字段透传到 renderLabelFn', async () => {
    let receivedOption: Record<string, unknown> | null = null;
    const rawData = { icon: 'home', iconColor: '#f00' };
    renderWithInject(
      { value: 'a', label: 'A', raw: rawData },
      {
        renderLabelFn: (option: Record<string, unknown>, _selected: boolean) => {
          receivedOption = option;
          return h('span', { class: 'lbl' }, String(option.label));
        },
      },
    );
    await flush();
    expect(receivedOption).not.toBeNull();
    // raw 中的自定义字段应保留
    expect(receivedOption?.icon).toBe('home');
    expect(receivedOption?.iconColor).toBe('#f00');
    // label/value/disabled 由 props 覆盖（Boolean prop 默认 false）
    expect(receivedOption?.label).toBe('A');
    expect(receivedOption?.value).toBe('a');
    expect(receivedOption?.disabled).toBe(false);
  });

  test('multiple 模式下 renderLabelFn 也能生效（在 checkbox slot 内）', async () => {
    const { screen } = renderWithInject(
      { value: 'a', label: 'A' },
      {
        multiple: true,
        renderLabelFn: (option: Record<string, unknown>, _selected: boolean) =>
          h('span', { class: 'multi-custom' }, `M: ${option.label}`),
      },
    );
    await flush();
    const custom = screen.container.querySelector('.multi-custom');
    expect(custom).not.toBeNull();
    expect(custom?.textContent).toContain('M: A');
  });
});

/**
 * 辅助函数：生成 option label 文本
 */
function optionLabel(option: Record<string, unknown>, selected: boolean): string {
  return `${option.label}${selected ? ' ✓' : ''}`;
}
