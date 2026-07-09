/**
 * hooks/use-element.ts 元素指令封装测试。
 *
 * 验证 useElementDirective 返回的指令在 mounted / updated / unmounted 时回调。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, withDirectives } from 'vue';
import { useElementDirective } from './use-element';
import { flush } from '../../__tests__/_helpers/dom';

describe('useElementDirective', () => {
  test('useElementDirective - mounted 时回调收到元素和类型', async () => {
    const onElementChange = vi.fn();
    const { getElementDirective } = useElementDirective(onElementChange);

    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target' }), [[getElementDirective]]);
      },
    });

    const screen = render(Host);
    await flush();

    expect(onElementChange).toHaveBeenCalledWith(expect.any(HTMLElement), 'mounted');
    const el = screen.container.querySelector('.target');
    expect(el).not.toBeNull();
  });

  test('useElementDirective - unmounted 时回调收到 null', async () => {
    const onElementChange = vi.fn();
    const { getElementDirective } = useElementDirective(onElementChange);

    const Host = defineComponent({
      data() {
        return { show: true };
      },
      render() {
        return this.show ? withDirectives(h('div', { class: 'target' }), [[getElementDirective]]) : h('div');
      },
    });

    const screen = render(Host);
    await flush();

    // 卸载组件
    screen.unmount();
    await flush();

    // unmounted 应该收到 null
    const unmountedCall = onElementChange.mock.calls.find((c) => c[1] === 'unmounted');
    expect(unmountedCall).toBeDefined();
    expect(unmountedCall![0]).toBeNull();
  });
});
