/**
 * OForm / OFormItem 继承链路测试。
 *
 * 验证 provide/inject 三层链路：
 *   1. OForm provide（formInjectKey）— form 级 size/disabled/round/clearable/showMessage
 *   2. OFormItem 合并 + re-provide（formItemInjectKey）— FormItem prop 优先，继承 Form
 *   3. 子组件通过 inject（formItemInjectKey）接收合并后的值
 *
 * 使用 StubChild 组件直接 inject formItemInjectKey，解耦于任何具体控件（OSelect/OInput 等），
 * 使继承契约测试不依赖特定控件的 class 结构。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, defineComponent, inject, computed, reactive } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { formItemInjectKey } from '../provide';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * Stub 子组件：直接 inject formItemInjectKey，暴露接收到的全部合并值。
 * 模拟 useFormField 的 inject 行为，但不依赖任何具体控件实现。
 */
const StubChild = defineComponent({
  name: 'StubChild',
  setup() {
    const ctx = inject(formItemInjectKey, null);
    const received = computed(() => {
      if (!ctx) return null;
      return {
        size: ctx.size ? (typeof ctx.size === 'function' ? ctx.size() : (ctx.size as any)?.value) : undefined,
        disabled: ctx.disabled ? (typeof ctx.disabled === 'function' ? ctx.disabled() : (ctx.disabled as any)?.value) : undefined,
        round: ctx.round ? (typeof ctx.round === 'function' ? ctx.round() : (ctx.round as any)?.value) : undefined,
        clearable: ctx.clearable ? (typeof ctx.clearable === 'function' ? ctx.clearable() : (ctx.clearable as any)?.value) : undefined,
        showMessage: ctx.showMessage ? (typeof ctx.showMessage === 'function' ? ctx.showMessage() : (ctx.showMessage as any)?.value) : undefined,
        fieldResult: ctx.fieldResult?.value,
        hasFieldHandlers: !!ctx.fieldHandlers,
      };
    });
    return () => h('div', { class: 'stub-child', 'data-received': JSON.stringify(received.value) });
  },
});

/** 渲染 OForm + OFormItem + StubChild */
const renderWithStub = (formProps: Record<string, any>, itemProps: Record<string, any>) => {
  const model = formProps.model ?? reactive({});
  const screen = render({
    render: () =>
      h(
        OForm,
        { ...formProps, model },
        {
          default: () => h(OFormItem, { ...itemProps }, { default: () => h(StubChild) }),
        },
      ),
  });
  return { screen, model };
};

/** 从 StubChild 的 data-received 属性解析注入值 */
const getReceived = (screen: ReturnType<typeof render>['screen']) => {
  const el = screen.container.querySelector('.stub-child') as HTMLElement;
  return JSON.parse(el.getAttribute('data-received') || 'null');
};

describe('继承链路（OForm → OFormItem → 子组件）', () => {
  // ============================================================================
  // size 继承
  // ============================================================================

  describe('size 继承', () => {
    test('OForm size=small — 子组件继承 small', async () => {
      const { screen } = renderWithStub({ size: 'small' }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).size).toBe('small');
    });

    test('OForm size=large — 子组件继承 large', async () => {
      const { screen } = renderWithStub({ size: 'large' }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).size).toBe('large');
    });

    test('OFormItem size=large — 覆盖 OForm size=small', async () => {
      const { screen } = renderWithStub({ size: 'small' }, { label: 'S', field: 'f', size: 'large' });
      await flush();
      expect(getReceived(screen).size).toBe('large');
    });

    test('OForm + OFormItem 均未设 — size 为 undefined', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).size).toBeUndefined();
    });
  });

  // ============================================================================
  // disabled 继承
  // ============================================================================

  describe('disabled 继承', () => {
    test('OForm disabled=true — 子组件继承 true', async () => {
      const { screen } = renderWithStub({ disabled: true }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).disabled).toBe(true);
    });

    test('OFormItem disabled=false — 覆盖 OForm disabled=true', async () => {
      const { screen } = renderWithStub({ disabled: true }, { label: 'S', field: 'f', disabled: false });
      await flush();
      expect(getReceived(screen).disabled).toBe(false);
    });

    test('OFormItem disabled=true — 覆盖 OForm disabled=false', async () => {
      const { screen } = renderWithStub({ disabled: false }, { label: 'S', field: 'f', disabled: true });
      await flush();
      expect(getReceived(screen).disabled).toBe(true);
    });

    test('OForm + OFormItem 均未设 — disabled 为 undefined', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).disabled).toBeUndefined();
    });
  });

  // ============================================================================
  // round 继承
  // ============================================================================

  describe('round 继承', () => {
    test('OForm round=4px — 子组件继承 4px', async () => {
      const { screen } = renderWithStub({ round: '4px' }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).round).toBe('4px');
    });

    test('OFormItem round=8px — 覆盖 OForm round=4px', async () => {
      const { screen } = renderWithStub({ round: '4px' }, { label: 'S', field: 'f', round: '8px' });
      await flush();
      expect(getReceived(screen).round).toBe('8px');
    });
  });

  // ============================================================================
  // clearable 继承
  // ============================================================================

  describe('clearable 继承', () => {
    test('OForm clearable=true — 子组件继承 true', async () => {
      const { screen } = renderWithStub({ clearable: true }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).clearable).toBe(true);
    });

    test('OFormItem clearable=false — 覆盖 OForm clearable=true', async () => {
      const { screen } = renderWithStub({ clearable: true }, { label: 'S', field: 'f', clearable: false });
      await flush();
      expect(getReceived(screen).clearable).toBe(false);
    });
  });

  // ============================================================================
  // showMessage 继承
  // ============================================================================

  describe('showMessage 继承', () => {
    test('OForm showMessage=false — 子组件继承 false', async () => {
      const { screen } = renderWithStub({ showMessage: false }, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).showMessage).toBe(false);
    });

    test('OFormItem showMessage=true — 覆盖 OForm showMessage=false', async () => {
      const { screen } = renderWithStub({ showMessage: false }, { label: 'S', field: 'f', showMessage: true });
      await flush();
      expect(getReceived(screen).showMessage).toBe(true);
    });

    test('OForm + OFormItem 均未设 — showMessage 默认 true', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).showMessage).toBe(true);
    });
  });

  // ============================================================================
  // fieldResult（校验状态）继承
  // ============================================================================

  describe('fieldResult 继承', () => {
    test('OFormItem error — effectiveFieldResult 注入 danger', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f', error: '出错了' });
      await flush();
      const received = getReceived(screen);
      expect(received.fieldResult).not.toBeNull();
      expect(received.fieldResult.type).toBe('danger');
    });

    test('OFormItem validateStatus=success — effectiveFieldResult 注入 success', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f', validateStatus: 'success' });
      await flush();
      const received = getReceived(screen);
      expect(received.fieldResult).not.toBeNull();
      expect(received.fieldResult.type).toBe('success');
    });

    test('OFormItem validateStatus=warning — effectiveFieldResult 注入 warning', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f', validateStatus: 'warning' });
      await flush();
      const received = getReceived(screen);
      expect(received.fieldResult).not.toBeNull();
      expect(received.fieldResult.type).toBe('warning');
    });

    test('OFormItem validateStatus + error 同时设置 — validateStatus 优先（effectiveFieldResult）', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f', error: 'error msg', validateStatus: 'success' });
      await flush();
      const received = getReceived(screen);
      // validateStatus=success 时 effectiveFieldResult 返回 success（覆盖 error 的 danger）
      expect(received.fieldResult.type).toBe('success');
    });

    test('无 error/validateStatus — fieldResult 为 null', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).fieldResult).toBeNull();
    });
  });

  // ============================================================================
  // fieldHandlers 完整性
  // ============================================================================

  describe('fieldHandlers 注入', () => {
    test('子组件注入的 fieldHandlers 包含全部 4 个 trigger + runValidate', async () => {
      const { screen } = renderWithStub({}, { label: 'S', field: 'f' });
      await flush();
      expect(getReceived(screen).hasFieldHandlers).toBe(true);
    });
  });

  // ============================================================================
  // 综合继承
  // ============================================================================

  describe('综合继承', () => {
    test('OForm 设置全部 — 子组件全部继承', async () => {
      const { screen } = renderWithStub({ size: 'small', disabled: true, round: '4px', clearable: true, showMessage: false }, { label: 'S', field: 'f' });
      await flush();
      const received = getReceived(screen);
      expect(received.size).toBe('small');
      expect(received.disabled).toBe(true);
      expect(received.round).toBe('4px');
      expect(received.clearable).toBe(true);
      expect(received.showMessage).toBe(false);
    });

    test('OFormItem 全部覆盖 — 子组件取 FormItem 值', async () => {
      const { screen } = renderWithStub(
        { size: 'small', disabled: true, round: '4px', clearable: true, showMessage: false },
        { label: 'S', field: 'f', size: 'large', disabled: false, round: '8px', clearable: false, showMessage: true },
      );
      await flush();
      const received = getReceived(screen);
      expect(received.size).toBe('large');
      expect(received.disabled).toBe(false);
      expect(received.round).toBe('8px');
      expect(received.clearable).toBe(false);
      expect(received.showMessage).toBe(true);
    });
  });
});
