/**
 * OCascaderV2 无障碍契约（ARIA）测试。
 *
 * 验证 combobox 契约：role=combobox / aria-expanded / aria-haspopup / aria-controls / aria-disabled；
 * 验证面板选项契约：级联列与 filterable 搜索结果列表的 role=listbox / role=option，
 * 以及选中项 aria-selected 与视觉选中 class 的同构镜像。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
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

  test('OCascaderV2 aria-expanded - 打开面板后镜像为 true，点击外部关闭后回到 false', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    // 在面板外部按下并释放鼠标，模拟用户点击空白区域关闭面板
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();
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

  /**
   * 在已打开的面板中按文本查找选项元素。
   *
   * @param text 选项显示文本（支持子串匹配）
   * @returns 匹配的选项 li 元素
   */
  const findOptionByText = (text: string) => {
    const option = [...document.querySelectorAll('.o-cascader-v2-panel-popup [role="option"]')].find((el) => el.textContent?.includes(text)) as
      | HTMLElement
      | undefined;
    if (!option) {
      throw new Error(`未找到文本包含「${text}」的面板选项`);
    }
    return option;
  };

  test('单选选中叶子选项后 - aria-selected=true 与视觉选中 class 同构镜像', async () => {
    // 绑定 v-model：单选收起面板后重新打开时，面板按选中路径重建各列
    const value = ref<unknown>();
    const screen = render({
      setup() {
        return () =>
          h(OCascaderV2 as any, {
            options: sampleOptions,
            modelValue: value.value,
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v;
            },
          });
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    // 点击第一级「浙江」展开子列
    findOptionByText('浙江').click();
    await flush();
    // 单选点击叶子「杭州」完成选中，面板随之关闭
    findOptionByText('杭州').click();
    await flush();
    // 重新打开面板：选中路径上的选项应镜像 aria-selected
    input.click();
    await flush();
    const options = [...document.querySelectorAll('.o-cascader-v2-panel-popup [role="option"]')];
    const ariaSelected = options.filter((el) => el.getAttribute('aria-selected') === 'true');
    const classSelected = options.filter((el) => el.classList.contains('o-cascader-v2-option-selected'));
    // 选中路径上的节点（路径父节点与叶子）均携带选中态
    expect(ariaSelected.length).toBeGreaterThan(0);
    // aria-selected 与视觉选中 class 一一同构，无障碍树与视觉状态不漂移
    expect(ariaSelected.length).toBe(classSelected.length);
    // 叶子「杭州」必须处于选中态
    const hangzhou = options.find((el) => el.textContent?.includes('杭州'));
    expect(hangzhou?.getAttribute('aria-selected')).toBe('true');
  });

  test('filterable 输入过滤词 - 搜索结果列表渲染 role=listbox 与 role=option', async () => {
    const screen = render(OCascaderV2, {
      props: { options: sampleOptions, multiple: true, filterable: true },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    // 打开面板后输入过滤词，面板切换为搜索结果视图
    input.click();
    await flush();
    input.value = '杭州';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    // 搜索结果列表兑现触发侧 aria-haspopup="listbox" 的宣告
    const listbox = document.querySelector('.o-cascader-v2-panel-popup [role="listbox"]');
    expect(listbox).not.toBeNull();
    const searchOptions = document.querySelectorAll('.o-cascader-v2-panel-popup [role="option"]');
    expect(searchOptions.length).toBeGreaterThan(0);
    // 搜索结果应命中「浙江 / 杭州」叶子节点
    const texts = [...searchOptions].map((el) => el.textContent).join('');
    expect(texts).toContain('杭州');
  });
});
