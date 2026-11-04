/**
 * OCascaderV2 无障碍契约（ARIA）测试。
 *
 * 验证 combobox 契约：role=combobox / aria-expanded / aria-haspopup / aria-controls / aria-disabled
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OCascaderV2 from '../OCascaderV2.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const sampleOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      { value: 'nanjing', label: '南京' },
      { value: 'suzhou', label: '苏州' },
    ],
  },
];

describe('无障碍契约（ARIA）', () => {
  test('OCascaderV2 role=combobox - 单选 input 有 role=combobox', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('combobox');
  });

  test('OCascaderV2 aria-haspopup - input 有 aria-haspopup=listbox', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
  });

  test('OCascaderV2 aria-expanded - 关闭时为 false', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  test('OCascaderV2 aria-controls - input 有 aria-controls 引用面板 id', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    const controlsId = input.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
  });

  test('OCascaderV2 aria-disabled - disabled 时 input 有 aria-disabled=true', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions, disabled: true } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  test('OCascaderV2 aria-disabled - 正常态无该属性', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-disabled')).toBeNull();
  });

  test('OCascaderV2 filterable 多选 - 搜索 input 也有 combobox 契约', async () => {
    const screen = render(OCascaderV2, {
      props: { options: sampleOptions, multiple: true, filterable: true },
    });
    await flush();
    const inputs = screen.container.querySelectorAll('.o-cascader-v2-input');
    for (const input of inputs) {
      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-haspopup')).toBe('listbox');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('aria-controls')).toBeTruthy();
    }
  });
});

describe('无障碍契约（ARIA）— 面板选项', () => {
  /**
   * 渲染并打开面板，返回 document.body 中的面板根元素。
   *
   * @returns 面板根元素
   */
  const renderAndOpenPanel = async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    const panel = document.querySelector('.o-cascader-v2-panel-popup .o-cascader-v2-panel');
    expect(panel).not.toBeNull();
    return panel as HTMLElement;
  };

  test('面板选项列设 role="listbox"（兑现 aria-haspopup="listbox" 的宣告）', async () => {
    const panel = await renderAndOpenPanel();
    const listbox = panel.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
  });

  test('面板选项设 role="option" 且选中项镜像 aria-selected', async () => {
    const panel = await renderAndOpenPanel();
    const options = panel.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    // 无选中值时不应有 aria-selected="true"
    expect(panel.querySelector('[role="option"][aria-selected="true"]')).toBeNull();
  });
});
