/**
 * OInput 无障碍透传契约测试。
 *
 * 验证 OInput 消费者层对 InInput aria 透传 props 的接线：
 * - 调用者显式传入的 role / aria-* props 转发到内部原生 input；
 * - ariaInvalid 由 color="danger" 联动计算，显式传值优先于联动值；
 * - 缺省（不传）时 input 不渲染对应属性。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OInput from '../OInput.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 渲染 OInput 并返回内部原生 input 元素。
 *
 * @param props 传给 OInput 的 props
 * @returns 内部 input 元素
 */
async function renderInput(props: Record<string, unknown> = {}) {
  const screen = render(OInput, { props });
  await flush();
  const input = screen.container.querySelector<HTMLInputElement>('input');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
}

describe('OInput aria 透传契约', () => {
  test('缺省时不渲染任何 aria 透传属性', async () => {
    const input = await renderInput();
    expect(input.getAttribute('role')).toBeNull();
    expect(input.getAttribute('aria-label')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBeNull();
    expect(input.getAttribute('aria-haspopup')).toBeNull();
    expect(input.getAttribute('aria-controls')).toBeNull();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-required')).toBeNull();
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

  test('显式传 Boolean 状态值时渲染到 input', async () => {
    const input = await renderInput({ ariaRequired: true });
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  test('color="danger" 时联动渲染 aria-invalid="true"', async () => {
    const input = await renderInput({ color: 'danger' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  test('显式传 aria-invalid 优先于 color 联动值', async () => {
    // 显式 false 表示校验已重新通过，不应被 color="danger" 的联动值覆盖
    const input = await renderInput({ color: 'danger', ariaInvalid: false });
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });
});
