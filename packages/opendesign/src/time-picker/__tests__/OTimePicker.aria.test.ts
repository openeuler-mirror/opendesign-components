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

  test('弹层面板设 role="dialog"（兑现 aria-haspopup="dialog" 的宣告）', async () => {
    await renderAndOpen();
    const dialog = document.querySelector('.o-popup[role="dialog"]');
    expect(dialog).not.toBeNull();
  });
});
