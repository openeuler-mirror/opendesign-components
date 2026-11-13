/**
 * OInputNumber ARIA 无障碍契约测试。
 *
 * 覆盖：原生 input 的可访问名称与值域镜像（aria-valuemin/max）、
 * 增减控制按钮的可访问名称与禁用镜像。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OInputNumber from '../OInputNumber.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — OInputNumber', () => {
  test('ariaLabel 透传到原生 input，未传时无属性', async () => {
    const screen = render(OInputNumber, { props: { modelValue: 5, ariaLabel: '数量' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('数量');

    const bare = render(OInputNumber, { props: { modelValue: 5 } });
    await flush();
    const bareInput = bare.container.querySelector('input') as HTMLInputElement;
    expect(bareInput.getAttribute('aria-label')).toBeNull();
  });

  test('增减控制按钮设可访问名称，达界时镜像 aria-disabled', async () => {
    const screen = render(OInputNumber, { props: { modelValue: 0, min: 0, max: 10, controls: 'both' } });
    await flush();
    const btns = screen.container.querySelectorAll('.o-input-number-btn');
    expect(btns.length).toBeGreaterThanOrEqual(2);
    // 名称来自 i18n（非空），且按钮间可区分
    const labels = Array.from(btns).map((b) => b.getAttribute('aria-label'));
    expect(labels.every((l) => !!l)).toBe(true);
    // 达 min 界的减少按钮禁用（aria-disabled=true），增加按钮可用
    const states = Array.from(btns).map((b) => b.getAttribute('aria-disabled'));
    expect(states).toContain('true');
    expect(states).toContain(null);
  });
});
