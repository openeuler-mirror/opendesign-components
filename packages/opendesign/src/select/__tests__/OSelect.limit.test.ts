/**
 * OSelect 多选数量上限测试。
 *
 * 验证 limit prop + exceed-limit 事件：
 *   1. limit=0（默认）— 无限制
 *   2. limit=N — 达到上限后未选项 disabled
 *   3. exceed-limit 事件 — 达到上限时点击未选项触发
 *   4. 非 breaking 回归：不传 limit 时行为零变化
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('limit 多选数量上限', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('limit=2 — 选中 2 项后，未选项变 disabled', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        limit: 2,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    // 展开 dropdown
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 已选 2 项，第三个选项 C 应该是 disabled
    const options = document.querySelectorAll('.o-option');
    const optionC = Array.from(options).find((o) => o.textContent?.includes('C')) as HTMLElement;
    const disabledItem = optionC.querySelector('.o-option-disabled');
    expect(disabledItem).not.toBeNull();
  });

  test('limit=2 — 点击被禁用的选项不触发 update:modelValue', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        limit: 2,
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    const options = document.querySelectorAll('.o-option');
    const optionC = Array.from(options).find((o) => o.textContent?.includes('C')) as HTMLElement;
    await optionC.click();
    await flush();
    // 超过上限，不应触发 update
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('limit=2 — 触发 exceed-limit 事件', async () => {
    const onExceedLimit = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        limit: 2,
        onExceedLimit,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    const options = document.querySelectorAll('.o-option');
    const optionC = Array.from(options).find((o) => o.textContent?.includes('C')) as HTMLElement;
    await optionC.click();
    await flush();
    expect(onExceedLimit).toHaveBeenCalledWith('c');
  });

  test('limit=3 — 选满 3 项后才禁用', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a'],
        limit: 3,
      },
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
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 选了 1 项，未达上限，所有未选项可点击
    const options = document.querySelectorAll('.o-option');
    for (const opt of options) {
      const disabled = opt.querySelector('.o-option-disabled');
      expect(disabled).toBeNull();
    }

    // 选中 B
    const optionB = Array.from(options).find((o) => o.textContent?.includes('B')) as HTMLElement;
    await optionB.click();
    await flush();

    // 选了 2 项，仍未达上限
    expect(screen.container.querySelectorAll('.o-select-tag-remove').length).toBe(2);
  });
});

describe('非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 limit — 多选无限制，exceed-limit 不触发', async () => {
    const onExceedLimit = vi.fn();
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        onExceedLimit,
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' }), h(OOption, { value: 'c', label: 'C' })],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 选中 C（已选 2 项，无 limit 限制）
    const options = document.querySelectorAll('.o-option');
    const optionC = Array.from(options).find((o) => o.textContent?.includes('C')) as HTMLElement;
    await optionC.click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    expect(onExceedLimit).not.toHaveBeenCalled();
  });
});
