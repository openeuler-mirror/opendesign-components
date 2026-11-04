/**
 * _components/in-textarea InTextarea 无障碍透传 props 测试。
 *
 * 验证 role / aria-* 透传 props 的渲染契约：
 * - 缺省（不传）时 textarea 上不渲染对应属性，避免向无障碍树注入多余语义；
 * - 显式传值（含显式 false）时属性渲染，保留 ARIA 状态语义。
 *
 * 与 InInput 保持同构的透传集合：aria-describedby 用于关联错误提示/辅助文本。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import InTextarea from '../in-textarea/InTextarea.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 渲染 InTextarea 并返回内部原生 textarea 元素。
 *
 * @param props 传给 InTextarea 的 props
 * @returns 内部 textarea 元素
 */
async function renderTextarea(props: Record<string, unknown> = {}) {
  const screen = render(InTextarea, { props });
  await flush();
  const textarea = screen.container.querySelector<HTMLTextAreaElement>('textarea');
  expect(textarea).not.toBeNull();
  return textarea as HTMLTextAreaElement;
}

describe('InTextarea aria 透传契约', () => {
  test('缺省时不渲染任何 aria 透传属性', async () => {
    const textarea = await renderTextarea();
    // 未传 props 时不应向 textarea 注入 role / aria-* 属性
    // （aria-disabled 镜像 disabled，缺省同样不渲染）
    expect(textarea.getAttribute('role')).toBeNull();
    expect(textarea.getAttribute('aria-label')).toBeNull();
    expect(textarea.getAttribute('aria-invalid')).toBeNull();
    expect(textarea.getAttribute('aria-required')).toBeNull();
    expect(textarea.getAttribute('aria-describedby')).toBeNull();
    expect(textarea.getAttribute('aria-disabled')).toBeNull();
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

  test('显式传 aria-invalid=false 时渲染 aria-invalid="false"', async () => {
    // 显式 false 表示校验已重新通过，应渲染
    const textarea = await renderTextarea({ ariaInvalid: false });
    expect(textarea.getAttribute('aria-invalid')).toBe('false');
  });

  test('显式传 aria-required=false 时渲染 aria-required="false"', async () => {
    const textarea = await renderTextarea({ ariaRequired: false });
    expect(textarea.getAttribute('aria-required')).toBe('false');
  });

  test('显式传 true 时渲染 aria-invalid="true"', async () => {
    const textarea = await renderTextarea({ ariaInvalid: true });
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  test('disabled 时镜像渲染 aria-disabled="true"', async () => {
    const textarea = await renderTextarea({ disabled: true });
    expect(textarea.getAttribute('aria-disabled')).toBe('true');
  });
});
