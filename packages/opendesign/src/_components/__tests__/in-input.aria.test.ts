/**
 * _components/in-input InInput 无障碍透传 props 测试。
 *
 * 验证 role / aria-* 透传 props 的渲染契约：
 * - 缺省（不传）时 input 上不渲染对应属性，避免向无障碍树注入多余语义；
 * - 显式传值（含显式 false）时属性渲染，保留 ARIA 状态语义。
 *
 * 覆盖 APG combobox 契约的输入侧字段：
 * role / aria-label / aria-expanded / aria-haspopup / aria-controls /
 * aria-activedescendant（键盘高亮联动 listbox 选项）/
 * aria-describedby（错误提示/辅助文本关联）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import InInput from '../in-input/InInput.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 渲染 InInput 并返回内部原生 input 元素。
 *
 * @param props 传给 InInput 的 props
 * @returns 内部 input 元素
 */
async function renderInput(props: Record<string, unknown> = {}) {
  const screen = render(InInput, { props });
  await flush();
  const input = screen.container.querySelector<HTMLInputElement>('input');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
}

describe('InInput aria 透传契约', () => {
  test('缺省时不渲染任何 aria 透传属性', async () => {
    const input = await renderInput();
    // 未传 props 时不应向 input 注入 role / aria-* 属性
    // （aria-disabled 镜像 disabled，缺省同样不渲染）
    expect(input.getAttribute('role')).toBeNull();
    expect(input.getAttribute('aria-label')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBeNull();
    expect(input.getAttribute('aria-haspopup')).toBeNull();
    expect(input.getAttribute('aria-controls')).toBeNull();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-required')).toBeNull();
    expect(input.getAttribute('aria-disabled')).toBeNull();
  });

  test('显式传 String 透传值时渲染到 input', async () => {
    const input = await renderInput({
      role: 'combobox',
      ariaLabel: '搜索',
      ariaHaspopup: 'listbox',
      ariaControls: 'panel-1',
      ariaActiveDescendant: 'option-2',
      ariaDescribedBy: 'input-error',
    });
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-label')).toBe('搜索');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-controls')).toBe('panel-1');
    expect(input.getAttribute('aria-activedescendant')).toBe('option-2');
    expect(input.getAttribute('aria-describedby')).toBe('input-error');
  });

  test('显式传 aria-expanded=false 时渲染 aria-expanded="false"', async () => {
    // 显式 false 在 ARIA 语义中有意义（弹层收起），必须渲染出来
    const input = await renderInput({ ariaExpanded: false });
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  test('显式传 aria-invalid=false 时渲染 aria-invalid="false"', async () => {
    // 显式 false 表示校验已重新通过，应渲染
    const input = await renderInput({ ariaInvalid: false });
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  test('显式传 aria-required=false 时渲染 aria-required="false"', async () => {
    const input = await renderInput({ ariaRequired: false });
    expect(input.getAttribute('aria-required')).toBe('false');
  });

  test('显式传 true 时渲染 aria-expanded="true"', async () => {
    const input = await renderInput({ ariaExpanded: true });
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  test('disabled 时镜像渲染 aria-disabled="true"', async () => {
    const input = await renderInput({ disabled: true });
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });
});
