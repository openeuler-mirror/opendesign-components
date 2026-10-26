/**
 * OSelect label 同步机制重构测试。
 *
 * 验证 optionInfoMap + cachedOptionMap 双 Map 机制：
 *   1. 选项卸载时从 optionInfoMap 清理（内存泄漏修复）
 *   2. 已选值的选项卸载后，label 从 cachedOptionMap 保留
 *   3. 异步加载 options 时已选值 label 正确显示
 *   4. registerOption provide 契约不变（OOption 用法零变化）
 *   5. 非 breaking 回归：选项存在时 label 显示与旧版一致
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('已选值选项卸载后 label 保留', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('单选：已选值从 options 移除 — label 仍保留显示', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'Label A', value: 'a' },
          { label: 'Label B', value: 'b' },
        ],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Label A');

    // 移除选项 A（模拟异步卸载），只保留 B
    await screen.rerender({
      modelValue: 'a',
      options: [{ label: 'Label B', value: 'b' }],
    });
    await flush();
    // label 仍应显示 'Label A'（从 cachedOptionMap 保留）
    expect(input.value).toBe('Label A');
  });

  test('多选：已选值选项卸载 — tag label 仍保留', async () => {
    const screen = render(OSelect, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        options: [
          { label: 'Label A', value: 'a' },
          { label: 'Label B', value: 'b' },
          { label: 'Label C', value: 'c' },
        ],
      },
    });
    await flush();
    const tags = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toContain('Label A');
    expect(tags[1].textContent).toContain('Label B');

    // 移除选项 A 和 B（模拟卸载），只保留 C
    await screen.rerender({
      multiple: true,
      modelValue: ['a', 'b'],
      options: [{ label: 'Label C', value: 'c' }],
    });
    await flush();
    // tag label 仍应显示（从 cachedOptionMap 保留）
    const tagsAfter = screen.container.querySelectorAll('.o-select-tags-wrap > .o-select-tag');
    expect(tagsAfter.length).toBe(2);
    expect(tagsAfter[0].textContent).toContain('Label A');
    expect(tagsAfter[1].textContent).toContain('Label B');
  });
});

describe('异步加载 options', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('options 延迟加载 — 加载后已选值 label 正确显示', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    // 初始无 options，label 为空
    expect(input.value).toBe('');

    // 异步加载 options
    await screen.rerender({
      modelValue: 'a',
      options: [{ label: 'Async Label A', value: 'a' }],
    });
    await flush();
    expect(input.value).toBe('Async Label A');
  });

  test('加载后再次清空 — label 从缓存保留', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Loaded A', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Loaded A');

    // 清空 options（模拟卸载）
    await screen.rerender({
      modelValue: 'a',
      options: [],
    });
    await flush();
    // label 从 cachedOptionMap 保留
    expect(input.value).toBe('Loaded A');
  });
});

describe('内存泄漏修复（非已选选项不残留）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('非已选选项移除后重新添加 — 使用新 label 非旧残留', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'selected',
        options: [
          { label: 'Selected', value: 'selected' },
          { label: 'Old Label', value: 'other' },
        ],
      },
    });
    await flush();

    // 移除非已选选项 other
    await screen.rerender({
      modelValue: 'selected',
      options: [{ label: 'Selected', value: 'selected' }],
    });
    await flush();

    // 重新添加 other 但 label 变化
    await screen.rerender({
      modelValue: 'selected',
      options: [
        { label: 'Selected', value: 'selected' },
        { label: 'New Label', value: 'other' },
      ],
    });
    await flush();

    // 展开 dropdown，验证 other 选项显示新 label
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const otherOption = Array.from(options).find((o) => o.textContent?.includes('Label'));
    expect(otherOption?.textContent).toContain('New Label');
    expect(otherOption?.textContent).not.toContain('Old Label');
  });
});

describe('非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('插槽模式 OOption registerOption 正常工作', async () => {
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

  test('插槽模式点击选项 — emit + label 显示正确', async () => {
    const onUpdate = vi.fn();
    const screen = render(OSelect, {
      props: { 'onUpdate:modelValue': onUpdate },
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
    expect(onUpdate).toHaveBeenCalledWith('b');
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('B');
  });

  test('options 模式 label 显示与旧版一致', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'b',
        options: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Option B');
  });

  test('options 动态更新 label 同步', async () => {
    const screen = render(OSelect, {
      props: {
        modelValue: 'a',
        options: [{ label: 'Old', value: 'a' }],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Old');

    await screen.rerender({
      modelValue: 'a',
      options: [{ label: 'New', value: 'a' }],
    });
    await flush();
    expect(input.value).toBe('New');
  });
});

describe('清除值后 cachedOptionMap 清理', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('清除后重新选择同一值 — 显示新 label 非旧缓存', async () => {
    const optionsRef = ref([{ label: 'Original A', value: 'a' }]);
    const modelRef = ref<string | number | undefined>('a');
    const screen = render({
      components: { OSelect },
      setup() {
        return { optionsRef, modelRef };
      },
      template: '<OSelect v-model="modelRef" :options="optionsRef" clearable />',
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('Original A');

    // 清除
    const clearEl = screen.container.querySelector('.o-select-clear') as HTMLElement;
    await clearEl.click();
    await flush();
    expect(input.value).toBe('');

    // 更新 options，同一 value 但 label 变化
    optionsRef.value = [{ label: 'Updated A', value: 'a' }];
    await flush();

    // 展开，选择 'a'
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const option = document.querySelector('.o-option') as HTMLElement;
    await option.click();
    await flush();

    // 应显示新 label（非缓存的旧 label）
    expect(input.value).toBe('Updated A');
  });
});
