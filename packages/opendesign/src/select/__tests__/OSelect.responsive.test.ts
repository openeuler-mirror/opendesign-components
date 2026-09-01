/**
 * OSelect 响应式契约测试。
 *
 * 验证 OSelect 在不同视口下的渲染模式切换：
 *   - desktop（>1200px）：使用 OPopup 浮层模式
 *   - pad/phone（≤1200px）：使用 ODialog 弹窗模式（isResponding=true）
 *   - noResponsive=true：在 pad/phone 下仍使用 OPopup
 *   - pad/phone 多选模式：渲染确认/取消按钮
 *
 * 依赖 useScreen hook：isResponding = !noResponsive && isPhonePadSize
 *   - isPhonePadSize：window.innerWidth ≤ 1200（pad 断点）
 *   - 默认视口 1920×1080 → isResponding=false → OPopup 模式
 *   - 切到 pad/phone 视口 → isResponding=true → ODialog 模式
 */
import { test, expect, describe, afterEach, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport, BREAKPOINTS } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content, .o-dialog-wrap').forEach((el) => el.remove());
};

describe('响应式契约（desktop OPopup 模式）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect desktop - 使用 OPopup 而非 ODialog', async () => {
    await setViewport('desktop');
    const screen = render(OSelect, {
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // desktop 模式下应渲染 OPopup（.o-options-popup）
    const popup = document.querySelector('.o-options-popup');
    expect(popup).not.toBeNull();
    // 不应渲染 ODialog
    const dialog = document.querySelector('.o-select-dlg');
    expect(dialog).toBeNull();
  });
});

describe('响应式契约（pad_v ODialog 模式）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect pad_v - 使用 ODialog 而非 OPopup', async () => {
    await setViewport('pad_v');
    const screen = render(OSelect, {
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // pad_v 模式下应渲染 ODialog（.o-select-dlg）
    const dialog = document.querySelector('.o-select-dlg');
    expect(dialog).not.toBeNull();
    // 不应渲染 OPopup
    const popup = document.querySelector('.o-options-popup');
    expect(popup).toBeNull();
  });

  test('OSelect phone - 使用 ODialog 模式', async () => {
    await setViewport('phone');
    const screen = render(OSelect, {
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const dialog = document.querySelector('.o-select-dlg');
    expect(dialog).not.toBeNull();
  });
});

describe('响应式契约（noResponsive 禁用切换）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect noResponsive=true - pad_v 下仍使用 OPopup', async () => {
    await setViewport('pad_v');
    const screen = render(OSelect, {
      props: { noResponsive: true },
      slots: {
        default: () => h(OOption, { value: 'a', label: 'A' }),
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // noResponsive=true 时，pad_v 下仍用 OPopup
    const popup = document.querySelector('.o-options-popup');
    expect(popup).not.toBeNull();
    const dialog = document.querySelector('.o-select-dlg');
    expect(dialog).toBeNull();
  });
});

describe('响应式契约（pad/phone 多选 Dialog 确认/取消）', () => {
  afterEach(cleanupBodyPopups);

  test('OSelect pad_v multiple - 渲染确认/取消按钮', async () => {
    await setViewport('pad_v');
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
    // 多选模式下 ODialog 渲染确认/取消按钮
    const dlgButtons = document.querySelectorAll('.o-select-dlg .o-dlg-btn');
    expect(dlgButtons.length).toBe(2);
  });

  test('OSelect pad_v multiple 取消 - 不触发 change', async () => {
    await setViewport('pad_v');
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: { multiple: true, modelValue: ['a'], onChange },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    // 在 Dialog 内点击选项 B（临时选中）
    const options = document.querySelectorAll('.o-option');
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    // 点击取消按钮
    const cancelBtn = Array.from(document.querySelectorAll('.o-select-dlg .o-dlg-btn')).find((btn) => btn.textContent?.includes('取消')) as HTMLElement;
    await cancelBtn.click();
    await flush();
    // 取消不应触发 change
    expect(onChange).not.toHaveBeenCalled();
  });

  test('OSelect pad_v multiple 确认 - 触发 change 与 update:modelValue', async () => {
    await setViewport('pad_v');
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
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
    // 在 Dialog 内点击选项 B（临时选中）
    const options = document.querySelectorAll('.o-option');
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();
    // 点击确认按钮
    const okBtn = Array.from(document.querySelectorAll('.o-select-dlg .o-dlg-btn')).find((btn) => btn.textContent?.includes('确定')) as HTMLElement;
    await okBtn.click();
    await flush();
    // 确认应触发 change 与 update:modelValue
    expect(onUpdate).toHaveBeenLastCalledWith(['a', 'b']);
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'], expect.anything());
  });
});
