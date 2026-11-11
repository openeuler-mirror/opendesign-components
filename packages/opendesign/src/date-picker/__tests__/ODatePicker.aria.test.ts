/**
 * ODatePicker ARIA 无障碍契约测试。
 *
 * 验证日历面板 role='grid'、日期格 role='gridcell'，以及选中态 aria-selected、
 * 今天 aria-current='date' 的状态镜像，使读无障碍树的 AI 代理与屏幕阅读器
 * 能识别日历控件与当前选中日期。
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import dayjs from 'dayjs';
import ODatePicker from '../ODatePicker.vue';
import { flush, waitFor } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-popup-content, [data-v-popper-escaped], .o-options-popup').forEach((el) => el.remove());
};

/** 渲染 ODatePicker 并聚焦打开日历面板 */
const renderAndOpen = async (modelValue?: number | string | Date) => {
  const pickerRef = ref<any>(null);
  render({
    setup() {
      return () => h(ODatePicker as any, { ref: pickerRef, modelValue });
    },
  });
  await flush();
  pickerRef.value.focus();
  await waitFor(() => document.querySelector('[role="grid"]') !== null);
};

describe('ARIA — 日历', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('日历容器设 role="grid"', async () => {
    await renderAndOpen();
    const grid = document.querySelector('[role="grid"]');
    expect(grid).not.toBeNull();
  });

  test('日期格设 role="gridcell"', async () => {
    await renderAndOpen();
    const cells = document.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(0);
  });

  test('今天设 aria-current="date"', async () => {
    await renderAndOpen();
    const today = document.querySelector('[role="gridcell"][aria-current="date"]');
    expect(today).not.toBeNull();
  });

  test('input 设 role="combobox"', async () => {
    const pickerRef = ref<any>(null);
    render({
      setup() {
        return () => h(ODatePicker as any, { ref: pickerRef, modelValue: undefined });
      },
    });
    await flush();
    const input = document.querySelector('.o_input-input') as HTMLElement;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
  });

  test('弹层面板设 role="dialog"（兑现 aria-haspopup="dialog" 的宣告）', async () => {
    await renderAndOpen();
    const dialog = document.querySelector('.o-popup[role="dialog"]');
    expect(dialog).not.toBeNull();
  });

  test('弹层面板带可访问名称（aria-label），读屏可感知用途', async () => {
    await renderAndOpen();
    const dialog = document.querySelector('.o-popup[role=dialog]');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-label')).toBeTruthy();
  });

  test('选中日期设 aria-selected="true"', async () => {
    await renderAndOpen(dayjs().startOf('day').valueOf());
    const selected = document.querySelector('[role="gridcell"][aria-selected="true"]');
    expect(selected).not.toBeNull();
  });

  test('非当月补位日期格镜像 aria-disabled="true"，当月可用格无该属性', async () => {
    await renderAndOpen();
    const cells = document.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(0);
    // 月历首尾携带相邻月补位格，其应镜像禁用态
    expect(document.querySelector('[role="gridcell"][aria-disabled="true"]')).not.toBeNull();
    // 今天属当月可用格，不携带禁用属性
    const today = document.querySelector('[role="gridcell"][aria-current="date"]');
    expect(today?.getAttribute('aria-disabled')).toBeNull();
  });

  test('点击日期后 - 选中格镜像移动到新值且 v-model 提交', async () => {
    const value = ref<number | undefined>(undefined);
    const pickerRef = ref<any>(null);
    render({
      setup() {
        return () =>
          h(ODatePicker as any, {
            ref: pickerRef,
            modelValue: value.value,
            'onUpdate:modelValue': (v: number) => {
              value.value = v;
            },
          });
      },
    });
    await flush();
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="grid"]') !== null);
    // 点击当月 15 号（非禁用、非补位格）
    const target = [...document.querySelectorAll('[role="gridcell"]')].find(
      (el) => el.textContent?.trim() === '15' && !el.hasAttribute('aria-disabled'),
    ) as HTMLElement;
    expect(target).toBeTruthy();
    target.click();
    await flush();
    // date 模式点击即提交并收起面板，重新打开后选中格镜像到 15 号
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="grid"]') !== null);
    const selected = document.querySelector('[role="gridcell"][aria-selected="true"]');
    expect(selected?.textContent?.trim()).toBe('15');
    // v-model 已提交为当月 15 号
    expect(dayjs(value.value).date()).toBe(15);
  });

  test('input 的 aria-expanded 镜像面板开合（关闭 false → 聚焦打开 true → 失焦关闭 false）', async () => {
    const pickerRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(ODatePicker as any, { ref: pickerRef, modelValue: undefined });
      },
    });
    await flush();
    const input = screen.container.querySelector('.o_input-input') as HTMLInputElement;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    pickerRef.value.focus();
    await waitFor(() => document.querySelector('[role="grid"]') !== null);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    pickerRef.value.blur();
    await waitFor(() => input.getAttribute('aria-expanded') === 'false');
  });
});
