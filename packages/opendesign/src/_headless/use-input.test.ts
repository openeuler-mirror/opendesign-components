/**
 * _headless/use-input.ts 输入框 headless 逻辑测试。
 *
 * 验证 useInput 的核心行为：受控/非受控值管理、input/change 事件、
 * focus/blur 回调、clear、pressEnter、maxLength/minLength 校验。
 *
 * 关键设计：
 *   - modelValue 仅在传入时创建 ref，否则为 undefined（确保非受控模式正确工作）
 *   - 通过 ref 绑定 inputEl，使 useComposition 能正确监听
 *   - 通过 data 属性将 isFocus/isValid 渲染到 DOM，避免依赖 render 暴露 setup 返回值
 *   - 通过 clear 按钮触发 clearValue，而非直接访问内部函数
 */
import { test, expect, describe, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { useInput, type UseInputEmitsT } from './use-input';
import { flush } from '../../__tests__/_helpers/dom';

/** 创建测试宿主组件，包装 useInput composable */
function createHost(initialProps: Record<string, any> = {}) {
  const emits = vi.fn() as unknown as UseInputEmitsT;
  const emitUpdate = vi.fn();
  // 仅在传入 modelValue 时创建受控 ref，否则为 undefined（非受控模式）
  const modelValue = initialProps.modelValue !== undefined ? ref(initialProps.modelValue) : undefined;
  const maxLength = ref(initialProps.maxLength);
  const minLength = ref(initialProps.minLength);
  const onlyNumericInput = ref(initialProps.onlyNumericInput);

  const Host = defineComponent({
    name: 'TestInputHost',
    setup() {
      const options = {
        modelValue,
        defaultValue: initialProps.defaultValue,
        emits,
        emitUpdate,
        maxLength,
        minLength,
        validate: initialProps.validate,
        format: initialProps.format,
        onlyNumericInput,
      };
      const input = useInput(options);
      return { input };
    },
    render() {
      const input = (this as any).input;
      return h('div', { class: 'test-wrapper' }, [
        h('input', {
          class: 'test-input',
          ref: (el: any) => {
            input.inputEl.value = el as HTMLInputElement;
          },
          value: input.displayValue.value,
          onInput: input.handleInput,
          onFocus: input.handleFocus,
          onBlur: input.handleBlur,
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === 'Enter') input.handlePressEnter(e);
          },
          'data-focus': String(input.isFocus.value),
          'data-valid': String(input.isValid.value),
        }),
        h(
          'button',
          {
            class: 'test-clear',
            onClick: () => input.clearValue(),
          },
          'Clear',
        ),
      ]);
    },
  });

  return { Host, modelValue, emits, emitUpdate, maxLength, minLength, onlyNumericInput };
}

describe('useInput', () => {
  test('useInput - 非受控模式使用 defaultValue', async () => {
    const { Host } = createHost({ defaultValue: 'initial' });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });

  test('useInput - 受控模式使用 modelValue', async () => {
    const { Host } = createHost({ modelValue: 'controlled' });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    expect(input.value).toBe('controlled');
  });

  test('useInput - input 事件触发时上报 input 事件', async () => {
    const { Host, emits } = createHost({ defaultValue: '' });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    // handleInput 中 emits('input', e, value) 被调用
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), 'a');
  });

  test('useInput - focus 时设置 isFocus=true，blur 时设为 false', async () => {
    const { Host } = createHost({ defaultValue: '' });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    expect(input.getAttribute('data-focus')).toBe('false');

    input.focus();
    await flush();
    expect(input.getAttribute('data-focus')).toBe('true');

    input.blur();
    await flush();
    expect(input.getAttribute('data-focus')).toBe('false');
  });

  test('useInput - clear 清空值并触发 clear 事件', async () => {
    const { Host, emits } = createHost({ defaultValue: 'text' });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    expect(input.value).toBe('text');

    // 点击 clear 按钮触发 clearValue
    const clearBtn = screen.container.querySelector('.test-clear') as HTMLButtonElement;
    await userEvent.click(clearBtn);
    await flush();

    expect(input.value).toBe('');
    expect(emits).toHaveBeenCalledWith('clear');
  });

  test('useInput - maxLength 超出时截断为 maxLength 长度', async () => {
    const { Host } = createHost({ defaultValue: '', maxLength: 3 });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = 'abcd';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    // handleInput 截断为 3 个字符
    expect(input.value).toBe('abc');
  });

  test('useInput - format 函数格式化显示值', async () => {
    const { Host } = createHost({
      defaultValue: '123',
      format: (v: string) => `【${v}】`,
    });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    // 非聚焦状态下应显示格式化后的值
    expect(input.value).toBe('【123】');
  });

  test('useInput - validate 校验函数返回 false 时标记无效', async () => {
    const { Host } = createHost({
      defaultValue: '',
      validate: (v: string) => v.length <= 5,
    });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    expect(input.getAttribute('data-valid')).toBe('true');

    // 输入超过 5 个字符
    input.focus();
    await flush();
    input.value = '123456';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    // watch(computedValue) 触发 validateValue → isValid=false
    expect(input.getAttribute('data-valid')).toBe('false');
  });
});

/**
 * onlyNumericInput 行为契约：
 *   - 未开启时，普通文本输入不受 illegal 格式字符序列约束
 *   - 开启时，输入被限制为合法数字（含负号/小数点），非法字符/格式序列被回退
 */
describe('useInput onlyNumericInput 行为契约', () => {
  test('useInput onlyNumericInput=false - 输入含连续点号的普通文本保留原值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: false });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = 'a..b';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), 'a..b');
    expect(input.value).toBe('a..b');
  });

  test('useInput onlyNumericInput=false - 输入含连续短横线的普通文本保留原值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: false });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = 'a--b';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), 'a--b');
    expect(input.value).toBe('a--b');
  });

  test('useInput onlyNumericInput=false - 输入 "-.5" 类格式保留原值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: false });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = '-.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), '-.5');
    expect(input.value).toBe('-.5');
  });

  test('useInput onlyNumericInput=true - 输入字母被回退为上一次合法值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: true });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    // 字母不通过 basicValidRegex，value 回退为 displayValue.value（初始空字符串）
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), '');
    expect(input.value).toBe('');
  });

  test('useInput onlyNumericInput=true - 输入连续点号被回退', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: true });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = '..';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), '');
  });

  test('useInput onlyNumericInput=true - 输入合法数字 -1.5 保留原值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: true });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = '-1.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), '-1.5');
    expect(input.value).toBe('-1.5');
  });

  test('useInput onlyNumericInput=true - 输入 ".5" 保留原值', async () => {
    const { Host, emits } = createHost({ defaultValue: '', onlyNumericInput: true });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.test-input') as HTMLInputElement;
    input.focus();
    await flush();
    input.value = '.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(emits).toHaveBeenCalledWith('input', expect.any(Event), '.5');
  });
});
