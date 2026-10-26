/**
 * _headless/use-input-password.ts 密码输入框 headless 逻辑测试。
 *
 * 验证 showPassword 状态切换、onEyeClick/onEyeMouseDown/onEyeMouseUp 事件处理。
 * 直接调用 composable（不经过 render），对返回的 ref 断言。
 */
import { test, expect, describe } from 'vitest';
import { ref } from 'vue';
import { useInputPassword } from './use-input-password';
import { flush } from '../../__tests__/_helpers/dom';

describe('useInputPassword', () => {
  test('useInputPassword - type=password 时 showPassword=false', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(false);
    const { showPassword } = useInputPassword({ type, disabled, showPasswordEvent: 'click' });
    expect(showPassword.value).toBe(false);
  });

  test('useInputPassword - type=text 时 showPassword=true', () => {
    const type = ref<'text' | 'password'>('text');
    const disabled = ref(false);
    const { showPassword } = useInputPassword({ type, disabled, showPasswordEvent: 'click' });
    expect(showPassword.value).toBe(true);
  });

  test('useInputPassword - onEyeClick 在 click 模式下切换', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(false);
    const { showPassword, onEyeClick } = useInputPassword({ type, disabled, showPasswordEvent: 'click' });
    expect(showPassword.value).toBe(false);
    onEyeClick();
    expect(showPassword.value).toBe(true);
    onEyeClick();
    expect(showPassword.value).toBe(false);
  });

  test('useInputPassword - onEyeClick 在 disabled 时不切换', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(true);
    const { showPassword, onEyeClick } = useInputPassword({ type, disabled, showPasswordEvent: 'click' });
    expect(showPassword.value).toBe(false);
    onEyeClick();
    expect(showPassword.value).toBe(false);
  });

  test('useInputPassword - onEyeMouseDown 在 pointerdown 模式下显示密码', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(false);
    const { showPassword, onEyeMouseDown } = useInputPassword({ type, disabled, showPasswordEvent: 'pointerdown' });
    expect(showPassword.value).toBe(false);
    onEyeMouseDown();
    expect(showPassword.value).toBe(true);
  });

  test('useInputPassword - onEyeMouseDown 在 disabled 时不切换', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(true);
    const { showPassword, onEyeMouseDown } = useInputPassword({ type, disabled, showPasswordEvent: 'pointerdown' });
    expect(showPassword.value).toBe(false);
    onEyeMouseDown();
    expect(showPassword.value).toBe(false);
  });

  test('useInputPassword - pointerdown 模式完整流程：mousedown 显示 → mouseup 隐藏', () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(false);
    const { showPassword, onEyeMouseDown, onEyeMouseUp } = useInputPassword({ type, disabled, showPasswordEvent: 'pointerdown' });
    expect(showPassword.value).toBe(false);
    onEyeMouseDown();
    expect(showPassword.value).toBe(true);
    onEyeMouseUp();
    expect(showPassword.value).toBe(false);
  });

  test('useInputPassword - type 变化时 showPassword 自动更新', async () => {
    const type = ref<'text' | 'password'>('password');
    const disabled = ref(false);
    const { showPassword } = useInputPassword({ type, disabled, showPasswordEvent: 'click' });
    expect(showPassword.value).toBe(false);
    type.value = 'text';
    await flush();
    expect(showPassword.value).toBe(true);
  });
});
