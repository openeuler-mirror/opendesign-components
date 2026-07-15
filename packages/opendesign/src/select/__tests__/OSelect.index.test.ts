/**
 * OSelect 单组件契约测试。
 *
 * 本文件重点验证「插槽透传链路」——即 OSelect → SelectOption 的 filterSlots
 * 是否在 useSlots → defineSlots 重构后仍正确工作。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：click 展开 / clear 清除 / disabled 阻断
 *   3. 插槽契约：prefix / arrow / suffix / empty / default / action 透传
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OSelect 根元素 class 包含 o-select', async () => {
    const screen = render(OSelect);
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect color - 各枚举值注入 o-select-{color} 类，默认 normal', async () => {
    for (const c of ['normal', 'primary', 'success', 'warning', 'danger'] as const) {
      const screen = render(OSelect, { props: { color: c } });
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains(`o-select-${c}`)).toBe(true);
    }
    const def = render(OSelect);
    expect((def.container.querySelector('.o-select') as HTMLElement).classList.contains('o-select-normal')).toBe(true);
  });

  test('OSelect variant - 各枚举值注入 o-select-{variant} 类，默认 outline', async () => {
    for (const v of ['solid', 'outline', 'text'] as const) {
      const screen = render(OSelect, { props: { variant: v } });
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains(`o-select-${v}`)).toBe(true);
    }
    const def = render(OSelect);
    expect((def.container.querySelector('.o-select') as HTMLElement).classList.contains('o-select-outline')).toBe(true);
  });

  test('OSelect size - 各枚举值注入 o-select-{size} 类', async () => {
    for (const s of ['large', 'medium', 'small'] as const) {
      const screen = render(OSelect, { props: { size: s } });
      const el = screen.container.querySelector('.o-select') as HTMLElement;
      expect(el.classList.contains(`o-select-${s}`)).toBe(true);
    }
  });

  test('OSelect disabled - 注入 o-select-disabled 类', async () => {
    const screen = render(OSelect, { props: { disabled: true } });
    expect((screen.container.querySelector('.o-select') as HTMLElement).classList.contains('o-select-disabled')).toBe(true);
  });

  test('OSelect loading - 注入 o-select-is-loading 类', async () => {
    const screen = render(OSelect, { props: { loading: true } });
    await flush();
    expect((screen.container.querySelector('.o-select') as HTMLElement).classList.contains('o-select-is-loading')).toBe(true);
  });

  test('OSelect multiple - 有选中值时注入 is-multiple 类', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a'] },
    });
    await flush();
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expect(el.classList.contains('is-multiple')).toBe(true);
  });

  test('OSelect clearable - 有值且可清除时注入 o-select-clearable 类', async () => {
    const screen = render(OSelect, {
      props: { clearable: true, modelValue: 'test' },
    });
    await flush();
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expect(el.classList.contains('o-select-clearable')).toBe(true);
  });

  test('OSelect placeholder - 透传至 input 的 placeholder 属性', async () => {
    const screen = render(OSelect, { props: { placeholder: '请选择' } });
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.getAttribute('placeholder')).toBe('请选择');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OSelect clear - 用户点击清除按钮时 emit clear 事件', async () => {
    const screen = render(OSelect, {
      props: { clearable: true, modelValue: 'test' },
    });
    await flush();
    const onClear = vi.fn();
    screen.rerender({ onClear });
    await flush();
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    expect(clearEl).not.toBeNull();
    await clearEl.click();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  test('OSelect disabled - 禁用时不渲染下拉浮层容器', async () => {
    const screen = render(OSelect, { props: { disabled: true } });
    await flush();
    // disabled 时不挂载 OPopup（v-if="!props.disabled"）
    const popup = screen.container.querySelector('[data-v-popper-escaped]');
    expect(popup).toBeNull();
  });
});

// ============================================================================
// 插槽契约：重点验证 useSlots → defineSlots 重构后插槽渲染不受影响
//
// OSelect 提供 prefix / arrow / suffix / empty / default / action 插槽。
// 其中 action 通过 filterSlots 透传至 SelectOption。
// ============================================================================

describe('插槽契约（具名插槽）', () => {
  test('OSelect slot=prefix - 渲染 .o-select-prefix 容器及 slot 内容', async () => {
    const screen = render(OSelect, {
      slots: {
        prefix: () => h('span', { class: 'custom-prefix' }, 'P'),
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const prefixWrap = screen.container.querySelector('.o-select-prefix');
    expect(prefixWrap).not.toBeNull();
    expect(prefixWrap?.querySelector('.custom-prefix')?.textContent).toBe('P');
  });

  test('OSelect - 未传 prefix 时不渲染 .o-select-prefix 容器', async () => {
    const screen = render(OSelect);
    await flush();
    expect(screen.container.querySelector('.o-select-prefix')).toBeNull();
  });

  test('OSelect slot=arrow - 替换默认箭头，可获取 active 状态', async () => {
    const screen = render(OSelect, {
      slots: {
        arrow: (props: { active: boolean }) => h('span', { class: 'custom-arrow', 'data-active': String(props.active) }, 'A'),
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const arrow = screen.container.querySelector('.custom-arrow') as HTMLElement;
    expect(arrow).not.toBeNull();
    expect(arrow.getAttribute('data-active')).toBe('false');
  });

  test('OSelect slot=suffix - 渲染后缀 slot 内容', async () => {
    const screen = render(OSelect, {
      slots: {
        suffix: (props: { active: boolean }) => h('span', { class: 'custom-suffix', 'data-active': String(props.active) }, 'S'),
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const suffix = screen.container.querySelector('.custom-suffix') as HTMLElement;
    expect(suffix).not.toBeNull();
    expect(suffix.getAttribute('data-active')).toBe('false');
  });

  test('OSelect slot=empty - 无 default slot 时渲染 empty slot 内容', async () => {
    const screen = render(OSelect, {
      slots: {
        empty: () => h('span', { class: 'custom-empty' }, '暂无数据'),
      },
    });
    await flush();
    // empty slot 渲染在 .o-select-option-wrap 内的 .o-select-empty 中
    // 由于 teleport + ClientOnly，内容可能不在主 container 内
    // 验证 empty slot 的 class 存在于 DOM 中
    const emptyEl = document.querySelector('.custom-empty');
    expect(emptyEl).not.toBeNull();
  });

  test('OSelect slot=default - 默认插槽渲染 OOption 选项', async () => {
    const screen = render(OSelect, {
      slots: {
        default: () => h(OOption, { value: 'a', label: 'Option A' }),
      },
    });
    await flush();
    // OOption 渲染在 teleport 目标中，需在 document 范围查找
    const option = document.querySelector('.o-option');
    expect(option).not.toBeNull();
  });

  test('OSelect slot=action - action 插槽透传至 SelectOption', async () => {
    const screen = render(OSelect, {
      props: { unmountOnHide: false },
      slots: {
        action: () => h('span', { class: 'custom-action' }, 'Act'),
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    // action slot 通过 filterSlots(slots, slot.option.names) → SelectOption 透传
    // OPopup 内容在首次打开后才渲染，点击 select 展开
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const actionEl = document.querySelector('.custom-action');
    expect(actionEl).not.toBeNull();
  });
});
