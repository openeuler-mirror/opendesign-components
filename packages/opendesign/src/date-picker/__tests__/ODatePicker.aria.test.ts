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

  test('选中日期设 aria-selected="true"', async () => {
    await renderAndOpen(dayjs().startOf('day').valueOf());
    const selected = document.querySelector('[role="gridcell"][aria-selected="true"]');
    expect(selected).not.toBeNull();
  });
});
