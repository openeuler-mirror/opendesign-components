/**
 * OSelect IME 组合输入契约测试。
 *
 * 验证 filterable=true 时中文/日文等 IME 组合输入期间不触发 search/过滤，
 * compositionend 后统一触发一次。
 *
 * 组织原则：
 *   1. 组合期间不触发 search
 *   2. compositionend 后触发 search（参数为最终值）
 *   3. 组合期间 innerInputValue 不更新（不触发过滤）
 *
 * 测试先行：本文件先于 IME 逻辑实现编写，预期「组合期间不触发」用例失败
 * （因为当前 onInput 没有 isComposing 检查，组合期间会触发 search）。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OSelect from '../OSelect.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

/**
 * 辅助：在 input 上模拟 IME 组合输入流程
 * @param input 目标 input 元素
 * @param composingText 组合期间的中间文本（如拼音 "zhong"）
 * @param finalText 组合结束后的最终文本（如 "中"）
 */
const simulateIME = async (input: HTMLInputElement, composingText: string, finalText: string) => {
  // 1. 开始组合输入
  input.dispatchEvent(new CompositionEvent('compositionstart'));
  // 2. 组合输入期间，模拟 input 事件（携带中间值）
  input.value = composingText;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await flush();
  // 3. 组合结束
  input.dispatchEvent(new CompositionEvent('compositionend'));
  // 4. compositionend 后触发 input 事件（携带最终值，大多数浏览器的行为）
  input.value = finalText;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await flush();
};

/**
 * 辅助：模拟 Firefox 事件顺序的 IME 组合输入
 * Firefox 中 input(final) 在 compositionend 之前触发，且 compositionend 之后无 input 事件
 * @param input 目标 input 元素
 * @param composingText 组合期间的中间文本（如拼音 "zhong"）
 * @param finalText 组合结束后的最终文本（如 "中"）
 */
const simulateIMEFirefox = async (input: HTMLInputElement, composingText: string, finalText: string) => {
  // 1. 开始组合输入
  input.dispatchEvent(new CompositionEvent('compositionstart'));
  // 2. 组合输入期间，模拟 input 事件（携带中间值）
  input.value = composingText;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await flush();
  // 3. Firefox：最终 input 事件在 compositionend 之前触发
  input.value = finalText;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await flush();
  // 4. compositionend（Firefox 中此后不再触发 input 事件）
  input.dispatchEvent(new CompositionEvent('compositionend'));
  await flush();
};

describe('IME 组合输入', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('组合输入期间不触发 search 事件', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: '中文选项', value: 'cn' },
          { label: 'English', value: 'en' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // 开始组合输入
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    // 组合期间模拟 input 事件（携带拼音中间值 "zhong"）
    input.value = 'zhong';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    // 组合期间不应触发 search
    expect(onSearch).not.toHaveBeenCalled();
  });

  test('compositionend 后触发 search，参数为最终组合值', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: '中文选项', value: 'cn' },
          { label: 'English', value: 'en' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // 模拟完整 IME 流程：compositionstart → input(中间值) → compositionend → input(最终值)
    await simulateIME(input, 'zhong', '中');

    // compositionend 后应触发 search，参数为最终值 '中'
    expect(onSearch).toHaveBeenCalled();
    expect(onSearch).toHaveBeenLastCalledWith('中');
  });

  test('组合输入期间不触发过滤（选项列表不变）', async () => {
    const screen = render(OSelect, {
      props: {
        filterable: true,
        options: [
          { label: '中文选项', value: 'cn' },
          { label: '中卫', value: 'zw' },
          { label: 'English', value: 'en' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // 初始 3 个选项
    expect(document.querySelectorAll('.o-option').length).toBe(3);

    // 开始组合输入
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    input.value = 'zhong';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    // 组合期间选项列表不应被过滤（仍为 3 个）
    expect(document.querySelectorAll('.o-option').length).toBe(3);

    // 组合结束，输入最终值 '中'
    input.dispatchEvent(new CompositionEvent('compositionend'));
    input.value = '中';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    // 组合结束后才过滤：匹配 '中文选项' 和 '中卫'（包含 '中'）
    const filtered = document.querySelectorAll('.o-option');
    expect(filtered.length).toBe(2);
  });

  test('非组合输入（直接英文输入）不受影响', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // 直接输入英文（无 composition 事件）
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    // 非组合输入应立即触发 search
    expect(onSearch).toHaveBeenCalledWith('ap');
  });

  test('Firefox 事件顺序：compositionend 后仍触发 search（无后续 input 事件）', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: '中文选项', value: 'cn' },
          { label: 'English', value: 'en' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // Firefox 事件顺序：compositionstart → input(中间值) → input(最终值) → compositionend（无后续 input）
    await simulateIMEFirefox(input, 'zhong', '中');

    // compositionend 后应触发 search，参数为最终值 '中'
    expect(onSearch).toHaveBeenCalled();
    expect(onSearch).toHaveBeenLastCalledWith('中');
  });

  test('Firefox 事件顺序：连续两次 IME 输入均触发 search', async () => {
    const onSearch = vi.fn();
    const screen = render(OSelect, {
      props: {
        filterable: true,
        onSearch,
        options: [
          { label: '苹果', value: 'pg' },
          { label: '香蕉', value: 'xj' },
        ],
      },
    });
    await flush();
    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;

    // 第一次 IME 输入：zhong → 中
    await simulateIMEFirefox(input, 'zhong', '中');
    expect(onSearch).toHaveBeenLastCalledWith('中');

    // 第二次 IME 输入：guo → 果（输入框此时值为 "中果"）
    await simulateIMEFirefox(input, '中guo', '中果');
    // 第二次 compositionend 后也应触发 search
    expect(onSearch).toHaveBeenLastCalledWith('中果');
    // search 至少被调用 2 次（每次 IME 结束各一次）
    expect(onSearch.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
