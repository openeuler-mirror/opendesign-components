/**
 * OCascaderV2 无障碍契约（ARIA）测试。
 *
 * 验证 combobox 契约：role=combobox / aria-expanded / aria-haspopup / aria-controls / aria-disabled；
 * 验证面板选项契约：级联列与 filterable 搜索结果列表的 role=listbox / role=option，
 * 以及选中项 aria-selected 与视觉选中 class 的同构镜像；
 * 验证 inputProps 收拢对象的透传：可访问名称（aria-label 回退 placeholder）与表单校验状态，
 * 以及组件派生的 combobox 状态不被用户 key 覆盖。
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

describe('无障碍契约（ARIA）— inputProps 透传与可访问名称', () => {
  test('inputProps.aria-label - 作为 input 的可访问名称', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions, inputProps: { 'aria-label': '所在地区' } } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('所在地区');
  });

  test('inputProps - 未传 aria-label 时回退 placeholder 文本', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions, placeholder: '请选择地区' } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('请选择地区');
  });

  test('inputProps - 表单状态 key 透传到 input，未传的 key 不渲染属性', async () => {
    const withStates = render(OCascaderV2, {
      props: { options: sampleOptions, inputProps: { 'aria-describedby': 'region-error', 'aria-required': true, 'aria-invalid': true } },
    });
    await flush();
    const input = withStates.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('region-error');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const without = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const plainInput = without.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(plainInput.getAttribute('aria-describedby')).toBeNull();
    expect(plainInput.getAttribute('aria-required')).toBeNull();
    expect(plainInput.getAttribute('aria-invalid')).toBeNull();
  });

  test('inputProps.aria-invalid - 校验重新通过传 false 时渲染 aria-invalid="false"', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions, inputProps: { 'aria-invalid': false } } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  test('inputProps - 未枚举的原生属性同样透传到 input，且不落到根元素', async () => {
    const screen = render(OCascaderV2, {
      props: { options: sampleOptions, inputProps: { title: '选择地区', 'aria-autocomplete': 'list' } },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('title')).toBe('选择地区');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    // 收拢对象的落点是内部 input，不应散落到组件根元素
    const root = screen.container.querySelector('.o-cascader-v2') as HTMLElement;
    expect(root.getAttribute('title')).toBeNull();
    expect(root.getAttribute('aria-autocomplete')).toBeNull();
  });

  test('inputProps - 不覆盖组件派生的 combobox 状态（aria-expanded / aria-activedescendant）', async () => {
    const screen = render(OCascaderV2, {
      props: { options: sampleOptions, inputProps: { 'aria-expanded': 'true', 'aria-activedescendant': 'ghost-option' } },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    // 面板未展开：展开态与高亮项由组件输出，用户 key 不生效
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  test('inputProps - 多选内联搜索框同样透传', async () => {
    const screen = render(OCascaderV2, {
      props: { options: sampleOptions, multiple: true, filterable: true, modelValue: ['hangzhou'], inputProps: { 'aria-label': '已选地区' } },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-tags-wrap .o-cascader-v2-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.getAttribute('aria-label')).toBe('已选地区');
  });
});

describe('无障碍契约（ARIA）— 多选语义与高亮项关联', () => {
  test('OCascaderV2 multiple - 面板展开的各级列设 aria-multiselectable', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions, multiple: true } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    const listbox = document.querySelector('.o-cascader-v2-panel-popup [role="listbox"]') as HTMLElement;
    expect(listbox).not.toBeNull();
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
  });

  test('OCascaderV2 单选 - 面板列不渲染 aria-multiselectable', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    const listbox = document.querySelector('.o-cascader-v2-panel-popup [role="listbox"]') as HTMLElement;
    expect(listbox.getAttribute('aria-multiselectable')).toBeNull();
  });

  test('OCascaderV2 aria-activedescendant - 无选中值且面板展开时不渲染', async () => {
    const screen = render(OCascaderV2, { props: { options: sampleOptions } });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  test('OCascaderV2 aria-activedescendant - 面板关闭时不渲染', async () => {
    const value = ref<unknown>('hangzhou');
    const screen = render({
      setup() {
        return () => h(OCascaderV2 as any, { options: sampleOptions, modelValue: value.value });
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  test('OCascaderV2 aria-activedescendant - 单选重开面板后指向选中路径末列的选中项', async () => {
    const value = ref<unknown>('hangzhou');
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
    const descendantId = input.getAttribute('aria-activedescendant');
    expect(descendantId).toBeTruthy();
    // 指向的 DOM 节点真实存在且即选中叶子「杭州」
    const activeOption = document.getElementById(descendantId!) as HTMLElement;
    expect(activeOption.getAttribute('role')).toBe('option');
    expect(activeOption.getAttribute('aria-selected')).toBe('true');
    expect(activeOption.textContent).toContain('杭州');
  });

  test('OCascaderV2 aria-activedescendant - 多选搜索框同样关联高亮项', async () => {
    const value = ref<Array<unknown>>(['hangzhou']);
    const screen = render({
      setup() {
        return () =>
          h(OCascaderV2 as any, {
            options: sampleOptions,
            multiple: true,
            filterable: true,
            modelValue: value.value,
          });
      },
    });
    await flush();
    // 多选有 tag 时 combobox 宿主是内联搜索 input
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    const descendantId = input.getAttribute('aria-activedescendant');
    expect(descendantId).toBeTruthy();
    // 指向的 DOM 节点真实存在，且为选中叶子「杭州」（多选列模式的选中态由勾选框镜像）
    const activeOption = document.getElementById(descendantId!) as HTMLElement;
    expect(activeOption.getAttribute('role')).toBe('option');
    expect(activeOption.textContent).toContain('杭州');
  });

  test('OCascaderV2 aria-activedescendant - 面板展开期间进入 loading 时不输出悬空引用', async () => {
    // 异步取数场景：面板展开期间把 loading 置 true，面板只剩加载图标、不再渲染任何选项
    const loading = ref(false);
    const value = ref<unknown>('hangzhou');
    const screen = render({
      setup() {
        return () => h(OCascaderV2 as any, { options: sampleOptions, modelValue: value.value, loading: loading.value });
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    // 展开态下高亮项指向真实存在的选中选项
    const expandedId = input.getAttribute('aria-activedescendant');
    expect(document.getElementById(expandedId!)).not.toBeNull();

    loading.value = true;
    await flush();
    // 加载态面板内没有任何 role=option，高亮项不能继续指向已消失的元素
    expect(document.querySelectorAll('.o-cascader-v2-panel-popup [role="option"]').length).toBe(0);
    const loadingId = input.getAttribute('aria-activedescendant');
    // aria-activedescendant 要么不输出，要么必须指向文档中真实存在的元素
    expect(loadingId === null || document.getElementById(loadingId) !== null).toBe(true);

    // 加载结束后选项重新渲染，高亮项恢复指向选中选项
    loading.value = false;
    await flush();
    const restoredId = input.getAttribute('aria-activedescendant');
    expect(restoredId).toBeTruthy();
    expect(document.getElementById(restoredId!)).not.toBeNull();
  });

  test('OCascaderV2 aria-activedescendant - filterable 搜索结果中指向选中项', async () => {
    const value = ref<Array<unknown>>(['hangzhou']);
    const screen = render({
      setup() {
        return () =>
          h(OCascaderV2 as any, {
            options: sampleOptions,
            multiple: true,
            filterable: true,
            modelValue: value.value,
          });
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-cascader-v2-input') as HTMLInputElement;
    input.click();
    await flush();
    input.value = '杭州';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    const descendantId = input.getAttribute('aria-activedescendant');
    expect(descendantId).toBeTruthy();
    const activeOption = document.getElementById(descendantId!) as HTMLElement;
    // 搜索结果视图中的选中项即「杭州」叶子
    expect(activeOption.getAttribute('aria-selected')).toBe('true');
    expect(activeOption.textContent).toContain('杭州');
  });
});
