/**
 * _utils/style-class.ts 圆角样式工具测试。
 *
 * 覆盖 getRoundClass 函数在 round='pill' / 自定义值 / 默认值下的行为。
 */
import { test, expect, describe } from 'vitest';
import { ref } from 'vue';
import { getRoundClass } from './style-class';
import { defaultRound } from './global';

describe('getRoundClass', () => {
  test('getRoundClass - round=pill 注入 round-pill 类', () => {
    const props = { round: 'pill' as const };
    const { class: classRef, style: styleRef } = getRoundClass(props, 'btn');
    expect(classRef.value).toContain('o-btn-round-pill');
  });

  test('getRoundClass - round=pill 时 style 注入 100vh 圆角', () => {
    const props = { round: 'pill' as const };
    const { style: styleRef } = getRoundClass(props, 'btn');
    expect(styleRef.value['--btn-radius']).toBe('100vh');
  });

  test('getRoundClass - round 为自定义值时注入 style 变量', () => {
    const props = { round: '12px' };
    const { class: classRef, style: styleRef } = getRoundClass(props, 'btn');
    expect(classRef.value).toBe('');
    expect(styleRef.value['--btn-radius']).toBe('12px');
  });

  test('getRoundClass - round 未设置且 defaultRound 非 pill 时返回空 class', () => {
    const savedDefault = defaultRound.value;
    defaultRound.value = undefined;
    const props = { round: undefined };
    const { class: classRef } = getRoundClass(props, 'btn');
    expect(classRef.value).toBe('');
    defaultRound.value = savedDefault;
  });

  test('getRoundClass - round 未设置但 defaultRound=pill 时注入 pill 类', () => {
    const savedDefault = defaultRound.value;
    defaultRound.value = 'pill';
    const props = { round: undefined };
    const { class: classRef } = getRoundClass(props, 'btn');
    expect(classRef.value).toContain('o-btn-round-pill');
    defaultRound.value = savedDefault;
  });

  test('getRoundClass - name 以 - 开头时类名格式正确', () => {
    const props = { round: 'pill' as const };
    const { class: classRef } = getRoundClass(props, '-box');
    expect(classRef.value).toContain('o-box-round-pill');
  });

  test('getRoundClass - name 以 _ 开头时类名格式正确', () => {
    const props = { round: 'pill' as const };
    const { class: classRef } = getRoundClass(props, '_box');
    expect(classRef.value).toContain('o_box-round-pill');
  });

  test('getRoundClass - multiline 且 round=pill 时 class 照常注入但 style 为空', () => {
    const props = { round: 'pill' as const };
    const { class: classRef, style: styleRef } = getRoundClass(props, '_box', true);
    // class 照常输出，圆角值交给 CSS 按 size 提供常数
    expect(classRef.value).toContain('o_box-round-pill');
    expect(styleRef.value).toEqual({});
  });

  test('getRoundClass - multiline 且 round 为自定义值时内联变量照常输出', () => {
    const props = { round: '12px' };
    const { class: classRef, style: styleRef } = getRoundClass(props, '_box', true);
    // multiline 只改变 pill 的值表达方式，自定义值路径不受影响
    expect(classRef.value).toBe('');
    expect(styleRef.value['--_box-radius']).toBe('12px');
  });

  test('getRoundClass - multiline 为响应式源时随值切换输出', () => {
    const props = { round: 'pill' as const };
    const isMultiline = ref(false);
    const { style: styleRef } = getRoundClass(props, '_box', isMultiline);
    expect(styleRef.value['--_box-radius']).toBe('100vh');
    isMultiline.value = true;
    expect(styleRef.value).toEqual({});
  });

  test('getRoundClass - 不传 multiline 时行为与既有一致（pill 输出 100vh）', () => {
    const props = { round: 'pill' as const };
    const { style: styleRef } = getRoundClass(props, 'btn');
    expect(styleRef.value['--btn-radius']).toBe('100vh');
  });
});
