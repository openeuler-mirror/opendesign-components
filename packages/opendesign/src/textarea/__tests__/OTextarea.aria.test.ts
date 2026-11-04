/**
 * OTextarea 无障碍透传契约测试。
 *
 * 验证 OTextarea 消费者层对 InTextarea aria 透传 props 的接线：
 * - 调用者显式传入的 role / aria-* props 转发到内部原生 textarea；
 * - ariaInvalid 由 color="danger" 联动计算，显式传值优先于联动值；
 * - 缺省（不传）时 textarea 不渲染对应属性。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OTextarea from '../OTextarea.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 渲染 OTextarea 并返回内部原生 textarea 元素。
 *
 * @param props 传给 OTextarea 的 props
 * @returns 内部 textarea 元素
 */
async function renderTextarea(props: Record<string, unknown> = {}) {
  const screen = render(OTextarea, { props });
  await flush();
  const textarea = screen.container.querySelector<HTMLTextAreaElement>('textarea');
  expect(textarea).not.toBeNull();
  return textarea as HTMLTextAreaElement;
}

describe('OTextarea aria 透传契约', () => {
  test('缺省时不渲染任何 aria 透传属性', async () => {
    const textarea = await renderTextarea();
    expect(textarea.getAttribute('role')).toBeNull();
    expect(textarea.getAttribute('aria-label')).toBeNull();
    expect(textarea.getAttribute('aria-describedby')).toBeNull();
    expect(textarea.getAttribute('aria-invalid')).toBeNull();
    expect(textarea.getAttribute('aria-required')).toBeNull();
  });

  test('显式传 String 透传值时渲染到 textarea', async () => {
    const textarea = await renderTextarea({
      role: 'textbox',
      ariaLabel: '备注',
      ariaDescribedBy: 'remark-error',
    });
    expect(textarea.getAttribute('role')).toBe('textbox');
    expect(textarea.getAttribute('aria-label')).toBe('备注');
    expect(textarea.getAttribute('aria-describedby')).toBe('remark-error');
  });

  test('显式传 Boolean 状态值时渲染到 textarea', async () => {
    const textarea = await renderTextarea({ ariaRequired: true });
    expect(textarea.getAttribute('aria-required')).toBe('true');
  });

  test('color="danger" 时联动渲染 aria-invalid="true"', async () => {
    const textarea = await renderTextarea({ color: 'danger' });
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  test('显式传 aria-invalid 优先于 color 联动值', async () => {
    // 显式 false 表示校验已重新通过，不应被 color="danger" 的联动值覆盖
    const textarea = await renderTextarea({ color: 'danger', ariaInvalid: false });
    expect(textarea.getAttribute('aria-invalid')).toBe('false');
  });
});
