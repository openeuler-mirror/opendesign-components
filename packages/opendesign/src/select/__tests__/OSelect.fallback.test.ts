/**
 * OSelect fallbackOption 测试。
 *
 * 验证值不在选项列表时的兜底显示：
 *   1. fallbackOption=false（默认）— label 为空
 *   2. fallbackOption=Function — label 从函数返回值取
 *   3. 非 breaking 回归：不传 fallbackOption 时 label 为空（与旧版一致）
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

describe('fallbackOption 兜底显示', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('fallbackOption=false（默认）— 值不在 options 时 label 为空', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'unknown',
        options: [{ label: 'Known', value: 'known' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 值不在 options 中，且默认 fallbackOption=false，label 为空
    expect(input.value).toBe('');
  });

  test('fallbackOption=Function — 值不在 options 时显示函数返回的 label', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 42,
        options: [{ label: 'Known', value: 1 }],
        fallbackOption: (value: string | number) => ({
          label: 'Item ' + value,
          value,
        }),
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Item 42');
  });

  test('fallbackOption=Function — 值在 options 中时优先用 options 的 label', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 1,
        options: [{ label: 'Known', value: 1 }],
        fallbackOption: (value: string | number) => ({
          label: 'Fallback ' + value,
          value,
        }),
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 优先用 options 的 label，不走 fallback
    expect(input.value).toBe('Known');
  });

  test('fallbackOption=Function — 多选模式下 tag 显示兜底 label', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['unknown1', 'known'],
        options: [{ label: 'Known', value: 'known' }],
        fallbackOption: (value: string | number) => ({
          label: 'FB: ' + value,
          value,
        }),
      },
    });
    await flush();
    const tags = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toContain('FB: unknown1');
    expect(tags[1].textContent).toContain('Known');
  });
});

describe('非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不传 fallbackOption — 值不在 options 时 label 为空（与旧版一致）', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'missing',
        options: [{ label: 'A', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('不传 fallbackOption — 值在 options 时 label 正常显示', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Label A', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Label A');
  });
});
