/**
 * hooks/use-composition.ts 中文输入法组合事件测试。
 *
 * 验证 isComposing 状态在 compositionstart / compositionend 时的切换，
 * 以及 compositionend 后自动触发 input 事件。
 * 通过 data 属性将 isComposing 渲染到 DOM，避免依赖 render 暴露 setup 返回值。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, ref, h } from 'vue';
import { useComposition } from './use-composition';
import { flush } from '../../__tests__/_helpers/dom';

/** 创建测试宿主组件，将 isComposing 渲染到 data-composing 属性 */
function createHost(onInput?: (e: Event) => void) {
  return defineComponent({
    name: 'TestCompositionHost',
    setup() {
      const el = ref<HTMLElement>();
      const { isComposing, onCompositionStart, onCompositionEnd } = useComposition({ el });
      return { el, isComposing, onCompositionStart, onCompositionEnd };
    },
    render() {
      return h('input', {
        class: 'test-input',
        ref: (el: any) => {
          this.el = el as HTMLElement;
        },
        'data-composing': String(this.isComposing),
        onInput,
      });
    },
  });
}

describe('useComposition', () => {
  test('useComposition - 初始 isComposing 为 false', async () => {
    const screen = render(createHost());
    await flush();
    const input = screen.container.querySelector('.test-input');
    expect(input?.getAttribute('data-composing')).toBe('false');
  });

  test('useComposition - compositionstart 设置 isComposing=true', async () => {
    const screen = render(createHost());
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLElement;
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    await flush();
    expect(input.getAttribute('data-composing')).toBe('true');
  });

  test('useComposition - compositionend 设置 isComposing=false 并触发 input 事件', async () => {
    const inputSpy = vi.fn();
    const screen = render(createHost(inputSpy));
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLElement;

    // 先 start → isComposing=true
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    await flush();
    expect(input.getAttribute('data-composing')).toBe('true');

    // 然后 end → isComposing=false + 触发 input 事件
    input.dispatchEvent(new CompositionEvent('compositionend'));
    await flush();
    expect(input.getAttribute('data-composing')).toBe('false');
    expect(inputSpy).toHaveBeenCalled();
  });
});
