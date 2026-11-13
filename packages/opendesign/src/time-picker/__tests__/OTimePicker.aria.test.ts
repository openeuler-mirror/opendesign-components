/**
 * OTimePicker ARIA 无障碍契约测试。
 *
 * 验证时间列容器 role='listbox'、时间项 role='option' 与 aria-selected
 * 状态镜像，使读无障碍树的 AI 代理与屏幕阅读器能识别滚动时间选择列表。
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OTimePicker from '../OTimePicker.vue';
import OTimeRangePicker from '../OTimeRangePicker.vue';
import { flush, waitFor } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-popup-content, [data-v-popper-escaped], .o-options-popup').forEach((el) => el.remove());
};

/** 渲染 OTimePicker 并聚焦打开时间面板 */
const renderAndOpen = async (modelValue = '08:00:00') => {
  const pickerRef = ref<any>(null);
  render({
    setup() {
      return () => h(OTimePicker as any, { ref: pickerRef, modelValue });
    },
  });
  await flush();
  pickerRef.value.focus();
  await waitFor(() => document.querySelector('[role="listbox"]') !== null);
};

/**
 * 渲染 OTimePicker 并返回 input 元素与组件实例引用（供聚焦/失焦往返验证）。
 *
 * @param modelValue 初始时间值
 * @returns input 元素与 picker 组件实例
 */
const renderWithInput = async (modelValue = '08:00:00') => {
  const pickerRef = ref<any>(null);
  const screen = render({
    setup() {
      return () => h(OTimePicker as any, { ref: pickerRef, modelValue });
    },
  });
  await flush();
  const input = screen.container.querySelector('.o_input-input') as HTMLInputElement;
  return { input, pickerRef };
};

describe('ARIA — 时间列', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('列容器设 role="listbox"', async () => {
    await renderAndOpen();
    const listbox = document.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
  });

  test('时间项设 role="option"', async () => {
    await renderAndOpen();
    const options = document.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
  });

  test('激活项设 aria-selected="true"', async () => {
    await renderAndOpen();
    const selected = document.querySelectorAll('[role="option"][aria-selected="true"]');
    expect(selected.length).toBeGreaterThan(0);
  });

  test('每列恰好一个选中项，镜像 modelValue 的时间值', async () => {
    await renderAndOpen('08:00:00');
    const columns = document.querySelectorAll('[role="listbox"]');
    expect(columns.length).toBe(3); // 时 / 分 / 秒 三列
    // 每列恰好一个 aria-selected="true"，且其镜像的值与 modelValue 对应位一致
    const [hourCol, minuteCol, secondCol] = columns;
    const selectedOf = (col: Element) => col.querySelector('[role="option"][aria-selected="true"]')?.textContent?.trim();
    expect(hourCol.querySelectorAll('[role="option"][aria-selected="true"]').length).toBe(1);
    expect(minuteCol.querySelectorAll('[role="option"][aria-selected="true"]').length).toBe(1);
    expect(secondCol.querySelectorAll('[role="option"][aria-selected="true"]').length).toBe(1);
    expect(selectedOf(hourCol)).toBe('08');
    expect(selectedOf(minuteCol)).toBe('00');
    expect(selectedOf(secondCol)).toBe('00');
  });

  test('点击时间项后 - aria-selected 镜像移动到新值且 emit 新时间', async () => {
    const value = ref('08:00:00');
    const pickerRef = ref<any>(null);
    render({
      setup() {
        return () =>
          h(OTimePicker as any, {
            ref: pickerRef,
            modelValue: value.value,
            'onUpdate:modelValue': (v: string) => {
              value.value = v;
            },
          });
      },
    });
    await flush();
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="listbox"]') !== null);
    // 点击时列「10」项（确保未被禁用）
    const hourOption = [...document.querySelectorAll('[role="option"]')].find((el) => el.textContent?.trim() === '10') as HTMLElement | undefined;
    expect(hourOption).toBeTruthy();
    hourOption.click();
    await flush();
    // 时列选中镜像移动到 10，分/秒列保持不变
    const [hourCol, minuteCol] = document.querySelectorAll('[role="listbox"]');
    const selectedOf = (col: Element) => col.querySelector('[role="option"][aria-selected="true"]')?.textContent?.trim();
    expect(selectedOf(hourCol)).toBe('10');
    expect(selectedOf(minuteCol)).toBe('00');
    // 真实提交路径：点击后滚动归位（含归位定时器）更新临时值，失焦时提交 v-model
    await new Promise((resolve) => setTimeout(resolve, 400));
    pickerRef.value.blur();
    await flush();
    expect(value.value).toBe('10:00:00');
  });

  test('disabledHours - 命中项镜像 aria-disabled="true"，未命中项无该属性', async () => {
    const pickerRef = ref<any>(null);
    render({
      setup() {
        return () =>
          h(OTimePicker as any, {
            ref: pickerRef,
            modelValue: '08:00:00',
            disabledHours: () => [9, 10],
          });
      },
    });
    await flush();
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="option"][aria-disabled="true"]') !== null);
    const [hourCol] = document.querySelectorAll('[role="listbox"]');
    const disabledItems = hourCol.querySelectorAll('[role="option"][aria-disabled="true"]');
    expect(disabledItems.length).toBe(2); // 09 / 10 两项被禁用
    const enabled = hourCol.querySelector('[role="option"]:not([aria-disabled])') as HTMLElement;
    expect(enabled.getAttribute('aria-disabled')).toBeNull();
  });

  test('input 设 role="combobox"', async () => {
    const pickerRef = ref<any>(null);
    render({
      setup() {
        return () => h(OTimePicker as any, { ref: pickerRef, modelValue: '08:00:00' });
      },
    });
    await flush();
    const input = document.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
  });

  test('input 的 aria-expanded 镜像面板开合（关闭 false → 聚焦打开 true → 失焦关闭 false）', async () => {
    const { input, pickerRef } = await renderWithInput();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="listbox"]') !== null);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    pickerRef.value.blur();
    await waitFor(() => input.getAttribute('aria-expanded') === 'false');
  });

  test('弹层面板设 role="dialog"（兑现 aria-haspopup="dialog" 的宣告）', async () => {
    await renderAndOpen();
    const dialog = document.querySelector('.o-popup[role="dialog"]');
    expect(dialog).not.toBeNull();
  });
});

describe('ARIA — 输入框可访问名称与表单状态', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('OTimePicker ariaLabel - 显式传入时 input 渲染 aria-label', async () => {
    const screen = render(OTimePicker, { props: { ariaLabel: '开始时间' } });
    await flush();
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('aria-label')).toBe('开始时间');
  });

  test('OTimePicker ariaLabel - 未传时回退 placeholder 文本', async () => {
    const screen = render(OTimePicker, { props: { placeholder: '请选择时间' } });
    await flush();
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('aria-label')).toBe('请选择时间');
  });

  test('OTimePicker ariaDescribedBy - 传入时透传 input aria-describedby，未传不渲染', async () => {
    const withId = render(OTimePicker, { props: { ariaDescribedBy: 'time-error' } });
    await flush();
    const withInput = withId.container.querySelector('.o_input-input') as HTMLElement;
    expect(withInput.getAttribute('aria-describedby')).toBe('time-error');

    const without = render(OTimePicker, {});
    await flush();
    const withoutInput = without.container.querySelector('.o_input-input') as HTMLElement;
    expect(withoutInput.getAttribute('aria-describedby')).toBeNull();
  });

  test('OTimePicker ariaRequired - 传入 true 时 input 渲染 aria-required', async () => {
    const screen = render(OTimePicker, { props: { ariaRequired: true } });
    await flush();
    const input = screen.container.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('aria-required')).toBe('true');
  });
});

describe('ARIA — OTimeRangePicker 输入框可访问名称与表单状态', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  /** 渲染 OTimeRangePicker 并返回开始/结束两个 input */
  const renderRange = async (props: Record<string, unknown> = {}) => {
    const screen = render(OTimeRangePicker as any, { props });
    await flush();
    const inputs = screen.container.querySelectorAll('.o_input-input');
    return { start: inputs[0] as HTMLElement, end: inputs[1] as HTMLElement };
  };

  test('OTimeRangePicker ariaLabel - 显式传入时开始与结束输入框共用可访问名称', async () => {
    const { start, end } = await renderRange({ ariaLabel: '服务时段' });
    expect(start.getAttribute('aria-label')).toBe('服务时段');
    expect(end.getAttribute('aria-label')).toBe('服务时段');
  });

  test('OTimeRangePicker ariaLabel - 未传时开始/结束分别回退各自占位文本', async () => {
    const { start, end } = await renderRange();
    expect(start.getAttribute('aria-label')).toBe(start.getAttribute('placeholder'));
    expect(end.getAttribute('aria-label')).toBe(end.getAttribute('placeholder'));
    expect(start.getAttribute('aria-label')).not.toBe(end.getAttribute('aria-label'));
  });

  test('OTimeRangePicker ariaDescribedBy/ariaRequired - 透传到开始与结束输入框', async () => {
    const { start, end } = await renderRange({ ariaDescribedBy: 'range-error', ariaRequired: true });
    for (const input of [start, end]) {
      expect(input.getAttribute('aria-describedby')).toBe('range-error');
      expect(input.getAttribute('aria-required')).toBe('true');
    }
  });
});
