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
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { OOptionGroup } from '../../option';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

/**
 * 清理 Teleport 到 body 的下拉浮层残留，避免测试间 DOM 污染。
 * OPopup 的内容默认 Teleport 到 body，vitest-browser-vue 不会自动清理。
 */
const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

/**
 * 查找折叠标签（fold tag）：它是 .o-select-tag 但不含 .o-select-tag-remove 子元素。
 * OPopover 有 inheritAttrs:false，传入的 class 应用到 popover 内容 div（仅可见时渲染），
 * 而非 target 元素。因此用 class 查找 fold tag 不可靠，改用结构特征区分。
 */
const findFoldTag = (container: HTMLElement): HTMLElement | null => {
  const allTags = container.querySelectorAll('.o-select-tag');
  return (Array.from(allTags).find((tag) => !tag.querySelector('.o-select-tag-remove')) as HTMLElement | undefined) ?? null;
};

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
    const onClear = vi.fn();
    const screen = render(OSelect, {
      props: { clearable: true, modelValue: 'test', onClear },
    });
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

// ============================================================================
// 静态契约补充：值绑定（modelValue / defaultValue / round / 折叠相关 props）
//
// 现有测试只覆盖了 class 注入，未验证值绑定的核心行为：
//   - modelValue → input value / tag 渲染
//   - defaultValue 非受控模式
//   - maxTagCount 折叠
//   - foldLabel / showFoldTags 折叠自定义
//   - round 圆角类与 CSS 变量
// ============================================================================

describe('静态契约补充（值绑定与折叠）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect modelValue 单选 - 渲染对应 OOption 的 label 到 input value', async () => {
    const screen = render(OSelect, {
      props: { modelValue: 'b' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'Label A' }), h(OOption, { value: 'b', label: 'Label B' })],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Label B');
  });

  test('OSelect modelValue 多选 - 渲染多个 tag', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a', 'b'] },
      slots: {
        default: () => [
          h(OOption, { value: 'a', label: 'Label A' }),
          h(OOption, { value: 'b', label: 'Label B' }),
          h(OOption, { value: 'c', label: 'Label C' }),
        ],
      },
    });
    await flush();
    const tags = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    // valueListDisplay 渲染 2 个 tag（无 maxTagCount 时全部显示）
    // 注意：OPopover 的 target 也带 .o-select-tag class，但仅在 showFoldTags 且有折叠时才存在
    // 此处无 maxTagCount → 无折叠 popover → 只有 2 个直接 tag
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toContain('Label A');
    expect(tags[1].textContent).toContain('Label B');
  });

  test('OSelect modelValue=0 - falsy 值也能正常选中（I9H2IP 回归）', async () => {
    const screen = render(OSelect, {
      props: { modelValue: 0 },
      slots: {
        default: () => h(OOption, { value: 0, label: 'Zero' }),
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Zero');
  });

  test('OSelect defaultValue - 非受控默认值渲染对应 label', async () => {
    const screen = render(OSelect, {
      props: { defaultValue: 'a' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('A');
  });

  test('OSelect round=pill - 注入 o-select-round-pill 类与 --select-radius', async () => {
    const screen = render(OSelect, { props: { round: 'pill' } });
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expect(el.classList.contains('o-select-round-pill')).toBe(true);
    expect(el.style.getPropertyValue('--select-radius')).toBe('100vh');
  });

  test('OSelect round=12px - 注入自定义 --select-radius 内联样式', async () => {
    const screen = render(OSelect, { props: { round: '12px' } });
    const el = screen.container.querySelector('.o-select') as HTMLElement;
    expect(el.style.getPropertyValue('--select-radius')).toBe('12px');
  });

  test('OSelect maxTagCount - 超过数量时渲染折叠标签 +N...', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a', 'b', 'c', 'd'], maxTagCount: 2 },
      slots: {
        default: () => [
          h(OOption, { value: 'a', label: 'A' }),
          h(OOption, { value: 'b', label: 'B' }),
          h(OOption, { value: 'c', label: 'C' }),
          h(OOption, { value: 'd', label: 'D' }),
        ],
      },
    });
    await flush();
    // valueListDisplay 渲染 2 个 tag（带 remove 按钮）
    const displayTags = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(displayTags.length).toBe(2);
    // 折叠标签是 OPopover 的 target，无 .o-select-tag-remove 子元素，内容为 +2...
    const foldTag = findFoldTag(screen.container as unknown as HTMLElement);
    expect(foldTag).not.toBeNull();
    expect(foldTag?.textContent).toContain('+2');
  });

  test('OSelect foldLabel - 自定义折叠文本', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b', 'c'],
        maxTagCount: 1,
        foldLabel: (tags: Array<{ label: string }>) => tags.map((t) => t.label).join(','),
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const foldTag = findFoldTag(screen.container as unknown as HTMLElement);
    expect(foldTag).not.toBeNull();
    expect(foldTag?.textContent).toContain('B,C');
  });

  test('OSelect showFoldTags=false - 不渲染折叠标签', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a', 'b', 'c'], maxTagCount: 1, showFoldTags: false },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    // showFoldTags=false 时不渲染折叠 tag（无 fold tag）
    const foldTag = findFoldTag(screen.container as unknown as HTMLElement);
    expect(foldTag).toBeNull();
    // 只有 valueListDisplay 的 tag（1 个，带 remove 按钮）
    const displayTags = screen.container.querySelectorAll('.o-select-tag-remove');
    expect(displayTags.length).toBe(1);
  });
});

// ============================================================================
// 静态契约补充：下拉布局相关 props
//
// 这些 props 透传给 OPopup/ODialog/SelectOption，验证「prop 被接受且不抛错」
// 以及影响 DOM 结构的关键属性。
// ============================================================================

describe('静态契约补充（下拉布局 props）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect optionWidthMode - 各枚举值不抛错', async () => {
    for (const m of ['auto', 'min-width', 'width'] as const) {
      const screen = render(OSelect, { props: { optionWidthMode: m } });
      expect(screen.container.querySelector('.o-select')).not.toBeNull();
    }
  });

  test('OSelect optionWrapClass - 字符串/对象/数组形式均不抛错', async () => {
    const strCase = render(OSelect, { props: { optionWrapClass: 'custom-wrap' } });
    expect(strCase.container.querySelector('.o-select')).not.toBeNull();

    const objCase = render(OSelect, { props: { optionWrapClass: { 'custom-wrap': true } } });
    expect(objCase.container.querySelector('.o-select')).not.toBeNull();

    const arrCase = render(OSelect, { props: { optionWrapClass: ['custom-wrap', { extra: true }] } });
    expect(arrCase.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect trigger=hover - 作为 prop 被接受且不抛错', async () => {
    const screen = render(OSelect, { props: { trigger: 'hover' } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect optionPosition - 各枚举值不抛错', async () => {
    for (const p of ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'] as const) {
      const screen = render(OSelect, { props: { optionPosition: p } });
      expect(screen.container.querySelector('.o-select')).not.toBeNull();
    }
  });

  test('OSelect transition - 自定义过渡名不抛错', async () => {
    const screen = render(OSelect, { props: { transition: 'my-fade' } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect optionsWrapper - 自定义挂载容器不抛错', async () => {
    const screen = render(OSelect, { props: { optionsWrapper: 'body' } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect optionTitle - 设置选项标题不抛错', async () => {
    const screen = render(OSelect, { props: { optionTitle: '请选择' } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect noResponsive=true - 禁用响应式不抛错', async () => {
    const screen = render(OSelect, { props: { noResponsive: true } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });

  test('OSelect unmountOnHide=false - 不卸载选项不抛错', async () => {
    const screen = render(OSelect, { props: { unmountOnHide: false } });
    expect(screen.container.querySelector('.o-select')).not.toBeNull();
  });
});

// ============================================================================
// 动态契约补充：选项选择与事件 emit
//
// 现有动态契约只测了 clear 和 disabled，核心的选项选择逻辑完全缺失：
//   - 单选点击选项 → emit update:modelValue + change
//   - 多选 toggle
//   - tag 删除
//   - clear 完整事件链
//   - options-visible-change
//   - beforeSelect 拦截与值替换
//   - 受控模式同步
// ============================================================================

describe('动态契约补充（选项选择与事件 emit）', () => {
  beforeEach(async () => {
    // 确保 desktop 视口（>1200px），isResponding=false，多选点击选项才触发 emit
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('OSelect 单选点击选项 - emit update:modelValue + change', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        'onUpdate:modelValue': onUpdate,
        onChange,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    // 点击 select 展开下拉
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 点击选项 B
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(2);
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('b', expect.anything());
  });

  test('OSelect 单选点击相同值 - 不重复 emit change', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        'onUpdate:modelValue': onUpdate,
        onChange,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 点击当前已选中的 A（源码：valueList.value[0] !== toValue 才触发）
    const options = document.querySelectorAll('.o-option');
    const optionA = Array.from(options).find((o) => o.textContent?.includes('A')) as HTMLElement;
    await optionA.click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('OSelect 多选点击选项 - toggle 选中状态', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    // 点击 B → 添加
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'b']);
    // 点击 A → 移除
    const optionA = Array.from(options).find((o) => o.textContent?.includes('A')) as HTMLElement;
    await optionA.click();
    await flush();
    expect(onUpdate).toHaveBeenLastCalledWith(['b']);
  });

  test('OSelect 多选 tag remove - 点击删除按钮移除 tag', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        'onUpdate:modelValue': onUpdate,
        onChange,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    // 点击第一个 tag 的删除按钮
    const removeBtn = screen.container.querySelector('.o-select-tag-remove') as HTMLElement;
    expect(removeBtn).not.toBeNull();
    await removeBtn.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(['b']);
    expect(onChange).toHaveBeenCalledWith(['b'], expect.anything());
  });

  test('OSelect clear - 同时 emit clear + update:modelValue + change', async () => {
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        clearable: true,
        modelValue: 'a',
        onClear,
        'onUpdate:modelValue': onUpdate,
        onChange,
      },
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    await clearEl.click();
    await flush();
    expect(onClear).toHaveBeenCalledTimes(1);
    // 单选清空后 valueList=[]，emitChange([]) → change(undefined, [])，emitUpdateValue([]) → update(undefined)
    expect(onUpdate).toHaveBeenCalledWith(undefined);
    expect(onChange).toHaveBeenCalledWith(undefined, []);
  });

  test('OSelect options-visible-change - 展开时触发 true', async () => {
    const onVisibleChange = vi.fn();
    const screen = render(OSelect, {
      props: { onOptionsVisibleChange: onVisibleChange },
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    expect(onVisibleChange).toHaveBeenCalledWith(true);
  });

  test('OSelect beforeSelect 返回 false - 阻止选择', async () => {
    const onUpdate = vi.fn();
    const beforeSelect = () => false;
    const screen = render(OSelect, {
      props: { beforeSelect, 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('OSelect beforeSelect 返回 string - 替换实际选中值', async () => {
    const onUpdate = vi.fn();
    const beforeSelect = (value: string | number) => `prefix-${value}`;
    const screen = render(OSelect, {
      props: { beforeSelect, 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const option = document.querySelector('.o-option') as HTMLElement;
    await option.click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('prefix-a');
  });

  test('OSelect 受控模式 - 外部更新 modelValue 后内部 input 同步显示', async () => {
    const screen = render(OSelect, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('A');
    // 外部更新 modelValue
    await screen.rerender({ modelValue: 'b' });
    await flush();
    expect(input.value).toBe('B');
  });
});

// ============================================================================
// 插槽契约补充：tag-fold 插槽
// ============================================================================

describe('插槽契约补充（tag-fold）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect slot=tag-fold - 自定义折叠标签显示内容', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a', 'b', 'c'], maxTagCount: 1 },
      slots: {
        'tag-fold': () => h('span', { class: 'custom-fold' }, '更多'),
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const foldEl = screen.container.querySelector('.custom-fold');
    expect(foldEl).not.toBeNull();
    expect(foldEl?.textContent).toBe('更多');
  });
});

// ============================================================================
// Exposed 方法：selectRef / isSelecting
// ============================================================================

describe('Exposed 方法', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect exposed selectRef - 暴露根元素 ref', async () => {
    const selectInstance = ref<any>(null);
    render({
      render: () => h(OSelect, { ref: selectInstance }),
    });
    await flush();
    expect(selectInstance.value).toBeTruthy();
    expect(selectInstance.value.selectRef).toBeDefined();
    // selectRef 是 ref<HTMLElement>，取 .value 获取元素
    const rootEl = selectInstance.value.selectRef?.value ?? selectInstance.value.selectRef;
    expect(rootEl instanceof HTMLElement).toBe(true);
    expect(rootEl.classList.contains('o-select')).toBe(true);
  });

  test('OSelect exposed isSelecting - 暴露选中状态 ref，初始为 false', async () => {
    const selectInstance = ref<any>(null);
    render({
      render: () => h(OSelect, { ref: selectInstance }),
    });
    await flush();
    expect(selectInstance.value).toBeTruthy();
    expect(selectInstance.value.isSelecting).toBeDefined();
    // isSelecting 是 ref<boolean>，取 .value 获取布尔值
    const selecting = selectInstance.value.isSelecting?.value ?? selectInstance.value.isSelecting;
    expect(selecting).toBe(false);
  });
});

// ============================================================================
// 集成场景：OOption / OOptionGroup / 多选 checkbox 协作
// ============================================================================

describe('集成场景（OOption / OOptionGroup 协作）', () => {
  beforeEach(async () => {
    // 确保 desktop 视口，使用 OPopup 模式而非 ODialog
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('OSelect + OOptionGroup - 分组渲染选项与分组标题', async () => {
    const screen = render(OSelect, {
      slots: {
        default: () => [
          h(OOptionGroup, { name: 'Group 1' }, () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })]),
          h(OOptionGroup, { name: 'Group 2' }, () => [h(OOption, { value: 'c', label: 'C' })]),
        ],
      },
    });
    await flush();
    // 展开下拉
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 验证分组渲染（Teleport 到 body）
    const groups = document.querySelectorAll('.o-option-group');
    expect(groups.length).toBe(2);
    const groupNames = Array.from(groups).map((g) => g.querySelector('.o-option-group-name')?.textContent);
    expect(groupNames).toContain('Group 1');
    expect(groupNames).toContain('Group 2');
    // 验证选项渲染
    const options = document.querySelectorAll('.o-option');
    expect(options.length).toBe(3);
  });

  test('OSelect OOption disabled - 禁用选项不触发选择', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: { 'onUpdate:modelValue': onUpdate },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A', disabled: true }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const disabledOption = Array.from(options).find((o) => o.textContent?.includes('A')) as HTMLElement;
    // 禁用选项带 o-option-disabled class
    const disabledItem = disabledOption.querySelector('.o-option-disabled');
    expect(disabledItem).not.toBeNull();
    await disabledOption.click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('OSelect 多选 - OOption 渲染 checkbox（OCheckbox 集成）', async () => {
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a'] },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 多选模式下每个选项渲染 OCheckbox
    const checkboxes = document.querySelectorAll('.o-option-checkbox');
    expect(checkboxes.length).toBe(2);
  });
});
