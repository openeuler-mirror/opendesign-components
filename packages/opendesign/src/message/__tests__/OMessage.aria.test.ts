/**
 * OMessage 反馈提示 ARIA 契约测试。
 *
 * 角色分档契约：danger 语义上够得上"警报"→ role="alert"（隐式 assertive，
 * 打断播报，插入即播报，与 v-if 出现方式契合）；其余档位（info / success /
 * warning / loading）为提示性反馈 → role="status"（隐式 polite + atomic）。
 * 两种角色的隐式值均已覆盖播报语义，不再显式输出 aria-live / aria-atomic，
 * 避免显式值覆盖隐式值造成语义矛盾（见 PR #971 检视意见）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OMessage from '../OMessage.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 渲染一条可见消息并返回其根元素查询函数，便于各断言复用。 */
const renderMessage = (status: string) => {
  const screen = render(OMessage, { props: { visible: true, duration: 0, status } });
  return { screen, queryEl: () => screen.container.querySelector('.o-message') as HTMLElement };
};

describe('ARIA — OMessage', () => {
  test('OMessage status=danger - 设 role="alert"（assertive 警报）', async () => {
    const { queryEl } = renderMessage('danger');
    await flush();
    expect(queryEl().getAttribute('role')).toBe('alert');
  });

  test('OMessage status=info - 设 role="status"（polite 提示）', async () => {
    const { queryEl } = renderMessage('info');
    await flush();
    expect(queryEl().getAttribute('role')).toBe('status');
  });

  test('OMessage - 不显式输出 aria-live / aria-atomic（由角色隐式值提供）', async () => {
    const { queryEl } = renderMessage('info');
    await flush();
    const el = queryEl();
    // 显式声明会覆盖 role 的隐式语义；两种角色的隐式值已覆盖播报行为
    expect(el.getAttribute('aria-live')).toBeNull();
    expect(el.getAttribute('aria-atomic')).toBeNull();
  });
});
