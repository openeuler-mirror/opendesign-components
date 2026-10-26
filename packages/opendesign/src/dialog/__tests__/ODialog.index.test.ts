/**
 * ODialog 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
 *      - DOM 结构 / class 注入 / 默认值 / 单主题视觉语义
 *   2. 动态契约：用户操作触发的状态变化
 *      - emit（change / update:visible）
 *      - 关闭按钮点击 / exposed toggle
 *   3. 视觉契约：双主题 light / dark 下 token wiring
 *      - 主内容背景色非透明 + light≠dark
 *      - 关闭按钮 3态 color token 互不相同
 *   4. 子配置契约：DialogActionT 字段
 *      - color / variant / size / round / icon / disabled / loading / onClick
 *   5. 插槽契约：具名插槽渲染替换
 *      - header / default / footer / actions
 *
 * ODialog 基于 OLayer（Teleport to body），查询时需从 document.body 取元素。
 * 无 media.scss → 无 responsive.test.ts。
 *
 * 不归属本文件的维度：
 *   - SSR 字符串渲染 + hydration mismatch → ODialog.ssr.test.ts
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref, markRaw } from 'vue';
import ODialog from '../ODialog.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { THEMES, isTransparent } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

const OIconAdd = markRaw(OIconAddRaw);

function setTheme(el: HTMLElement, theme: string) {
  el.setAttribute('data-o-theme', theme);
}

function getDialogEl(): HTMLElement | null {
  return document.body.querySelector('.o-dialog');
}

afterEach(() => {
  document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());
});

// ============================================================================
// 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
//
// ODialog 继承 layerProps，仅对 dialogProps 新增的 prop 逐条验证。
// layerProps 的契约由 OLayer.index.test.ts 覆盖。
// ============================================================================
describe('静态契约（按 types.ts 属性）', () => {
  test('ODialog visible - 默认 false 时不渲染 DOM，true 时渲染 .o-dialog', async () => {
    render(ODialog, { props: { visible: false }, slots: { default: () => 'H' } });
    await flush();
    expect(getDialogEl()).toBeNull();

    document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());

    render(ODialog, { props: { visible: true }, slots: { default: () => 'S' } });
    await flush();
    const el = getDialogEl();
    expect(el).not.toBeNull();
    expect(el?.classList.contains('o-dialog')).toBe(true);
  });

  test('ODialog hideClose - 默认 false 渲染关闭按钮，true 时隐藏', async () => {
    render(ODialog, { props: { visible: true, hideClose: false }, slots: { default: () => 'NC' } });
    await flush();
    expect(document.body.querySelector('.o-dlg-btn-close')).not.toBeNull();

    document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());

    render(ODialog, { props: { visible: true, hideClose: true }, slots: { default: () => 'HC' } });
    await flush();
    expect(document.body.querySelector('.o-dlg-btn-close')).toBeNull();
  });

  test('ODialog size - 各枚举值注入 o-dialog-{size} 类，默认 auto', async () => {
    for (const s of ['exlarge', 'large', 'medium', 'small', 'auto'] as const) {
      render(ODialog, { props: { visible: true, size: s }, slots: { default: () => s } });
      await flush();
      const el = getDialogEl();
      expect(el?.classList.contains(`o-dialog-${s}`)).toBe(true);
      document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());
    }
    const def = render(ODialog, { props: { visible: true }, slots: { default: () => 'def' } });
    await flush();
    expect((getDialogEl() as HTMLElement).classList.contains('o-dialog-auto')).toBe(true);
  });

  test('ODialog size=auto - --dlg-max-height 为 80%', async () => {
    render(ODialog, { props: { visible: true, size: 'auto' }, slots: { default: () => 'A' } });
    await flush();
    const main = document.body.querySelector('.o-dlg-main') as HTMLElement;
    expect(main).not.toBeNull();
  });

  test('ODialog noResponsive - 默认 false 注入 o-dialog-responsive 类，true 时移除', async () => {
    render(ODialog, { props: { visible: true, noResponsive: false }, slots: { default: () => 'R' } });
    await flush();
    const el = getDialogEl() as HTMLElement;
    expect(el.classList.contains('o-dialog-responsive')).toBe(true);

    document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());

    render(ODialog, { props: { visible: true, noResponsive: true }, slots: { default: () => 'NR' } });
    await flush();
    const elNo = getDialogEl() as HTMLElement;
    expect(elNo.classList.contains('o-dialog-responsive')).toBe(false);
  });

  test('ODialog phoneHalfFull - true 时注入 o-dialog-phone-half-full 类', async () => {
    render(ODialog, { props: { visible: true, phoneHalfFull: true }, slots: { default: () => 'PHF' } });
    await flush();
    const el = getDialogEl() as HTMLElement;
    expect(el.classList.contains('o-dialog-phone-half-full')).toBe(true);
  });

  test('ODialog scrollbar - 默认 true 时 .o-dlg-body-content 含 v-scrollbar 指令', async () => {
    render(ODialog, { props: { visible: true, scrollbar: true }, slots: { default: () => 'SB' } });
    await flush();
    const bodyContent = document.body.querySelector('.o-dlg-body-content') as HTMLElement;
    expect(bodyContent).not.toBeNull();
  });

  test('ODialog actions - 渲染 .o-dlg-footer + .o-dlg-actions 内的 OButton', async () => {
    const actions = [
      { id: 'ok', label: '确定', color: 'primary' as const, variant: 'solid' as const, onClick: () => {} },
      { id: 'cancel', label: '取消', variant: 'outline' as const, onClick: () => {} },
    ];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AC' } });
    await flush();
    expect(document.body.querySelector('.o-dlg-footer')).not.toBeNull();
    expect(document.body.querySelector('.o-dlg-actions')).not.toBeNull();
    const btns = document.body.querySelectorAll('.o-dlg-btn');
    expect(btns.length).toBe(2);
  });

  test('ODialog --dlg-z-index - 可见时 z-index 为正值', async () => {
    render(ODialog, { props: { visible: true }, slots: { default: () => 'Z' } });
    await flush();
    const layer = document.body.querySelector('.o-layer') as HTMLElement;
    const z = parseInt(getComputedStyle(layer).zIndex, 10);
    expect(z).toBeGreaterThan(0);
  });
});

// ============================================================================
// 动态契约：用户操作 → 组件响应（emit + exposed 方法）
// ============================================================================
describe('动态契约（用户交互 → 组件响应）', () => {
  test('ODialog change - 可见状态变化时 emit change', async () => {
    const onChange = vi.fn();
    const visible = ref(false);
    render({
      setup() {
        return () =>
          h(
            ODialog,
            {
              visible: visible.value,
              onChange,
              'onUpdate:visible': (v: boolean) => {
                visible.value = v;
              },
            },
            { default: () => 'CH' },
          );
      },
    });
    await flush();
    visible.value = true;
    await flush();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('ODialog update:visible - 关闭按钮点击后 emit update:visible(false)', async () => {
    const onUpdateVisible = vi.fn();
    render(ODialog, { props: { visible: true, 'onUpdate:visible': onUpdateVisible }, slots: { default: () => 'CL' } });
    await flush();
    const closeBtn = document.body.querySelector('.o-dlg-btn-close') as HTMLElement;
    closeBtn.click();
    await flush();
    expect(onUpdateVisible.mock.calls[0][0]).toBe(false);
  });

  test('ODialog maskClose - 点击遮罩后 emit update:visible(false)', async () => {
    const onUpdateVisible = vi.fn();
    render(ODialog, { props: { visible: true, maskClose: true, 'onUpdate:visible': onUpdateVisible }, slots: { default: () => 'MC' } });
    await flush();
    const mask = document.body.querySelector('.o-layer-mask') as HTMLElement;
    mask.click();
    await flush();
    expect(onUpdateVisible.mock.calls[0][0]).toBe(false);
  });

  test('ODialog exposed toggle - toggle(true) 打开对话框', async () => {
    const dialogRef = ref<InstanceType<typeof ODialog> | null>(null);
    render({
      setup() {
        return () => h(ODialog, { ref: dialogRef, visible: false }, { default: () => 'EX' });
      },
    });
    await flush();
    expect(getDialogEl()).toBeNull();
    dialogRef.value?.toggle(true);
    await flush();
    expect(getDialogEl()).not.toBeNull();
  });

  test('ODialog exposed toggle - toggle(false) emit update:visible(false)', async () => {
    const onUpdateVisible = vi.fn();
    const dialogRef = ref<InstanceType<typeof ODialog> | null>(null);
    render({
      setup() {
        return () => h(ODialog, { ref: dialogRef, visible: true, 'onUpdate:visible': onUpdateVisible }, { default: () => 'TF' });
      },
    });
    await flush();
    dialogRef.value?.toggle(false);
    await flush();
    expect(onUpdateVisible.mock.calls[0][0]).toBe(false);
  });

  test('ODialog actions.onClick - 点击 action 按钮触发回调', async () => {
    const onClick = vi.fn();
    const actions = [{ id: 'ok', label: '确定', color: 'primary' as const, variant: 'solid' as const, onClick }];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AO' } });
    await flush();
    const btn = document.body.querySelector('.o-dlg-btn') as HTMLElement;
    btn.click();
    await flush();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('ODialog 嵌套 - 打开内层对话框后 z-index 高于外层', async () => {
    const innerVisible = ref(false);
    render({
      setup() {
        return () =>
          h(
            ODialog,
            { visible: true, size: 'large' },
            {
              default: () =>
                h(
                  ODialog,
                  {
                    visible: innerVisible.value,
                    size: 'medium',
                    'onUpdate:visible': (v: boolean) => {
                      innerVisible.value = v;
                    },
                  },
                  { default: () => 'Inner' },
                ),
            },
          );
      },
    });
    await flush();
    innerVisible.value = true;
    await flush();
    const layers = Array.from(document.body.querySelectorAll('.o-layer')) as HTMLElement[];
    expect(layers.length).toBeGreaterThanOrEqual(2);
    const zIndexes = layers.map((el) => parseInt(getComputedStyle(el).zIndex, 10));
    expect(zIndexes[zIndexes.length - 1]).toBeGreaterThan(zIndexes[0]);
  });
});

// ============================================================================
// 视觉契约（双主题 light / dark）
//
// ODialog 的视觉承载点：
//   - 主内容背景色非透明 + light≠dark（--dlg-bg-color）
//   - 关闭按钮 3态 color token 互不相同
// ============================================================================
describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`ODialog main @${theme} - 背景色解析为非透明色`, async () => {
      render(ODialog, { props: { visible: true }, slots: { default: () => 'VM' } });
      await flush();
      const main = document.body.querySelector('.o-dlg-main') as HTMLElement;
      setTheme(getDialogEl() as HTMLElement, theme);
      expect(isTransparent(getComputedStyle(main).backgroundColor)).toBe(false);
    });
  }

  test('ODialog main - light / dark 下 backgroundColor 解析值不同', async () => {
    render(ODialog, { props: { visible: true }, slots: { default: () => 'ML' } });
    await flush();
    const mainL = document.body.querySelector('.o-dlg-main') as HTMLElement;
    setTheme(getDialogEl() as HTMLElement, 'e.light');
    const bgL = getComputedStyle(mainL).backgroundColor;

    document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());

    render(ODialog, { props: { visible: true }, slots: { default: () => 'MD' } });
    await flush();
    const mainD = document.body.querySelector('.o-dlg-main') as HTMLElement;
    setTheme(getDialogEl() as HTMLElement, 'e.dark');
    const bgD = getComputedStyle(mainD).backgroundColor;

    expect(bgL).not.toBe(bgD);
  });

  for (const theme of THEMES) {
    test(`ODialog close @${theme} - 关闭按钮 3态 color token 互不相同`, async () => {
      render(ODialog, { props: { visible: true }, slots: { default: () => 'VC' } });
      await flush();
      const close = document.body.querySelector('.o-dlg-btn-close') as HTMLElement;
      setTheme(getDialogEl() as HTMLElement, theme);
      const cs = getComputedStyle(close);
      const tokens = new Set([
        cs.getPropertyValue('--dlg-close-color').trim(),
        cs.getPropertyValue('--dlg-close-color-hover').trim(),
        cs.getPropertyValue('--dlg-close-color-active').trim(),
      ]);
      expect(tokens.size).toBe(3);
    });
  }
});

// ============================================================================
// 子配置契约：DialogActionT 字段
//
// 验证 actions 数组中每个字段透传到 OButton 的表现
// ============================================================================
describe('子配置契约（按 DialogActionT 字段）', () => {
  test('ODialog actions.color - 透传至 OButton 的 color prop', async () => {
    const actions = [
      { id: '1', label: 'Primary', color: 'primary' as const, onClick: () => {} },
      { id: '2', label: 'Danger', color: 'danger' as const, onClick: () => {} },
    ];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AC' } });
    await flush();
    const btns = document.body.querySelectorAll('.o-dlg-btn');
    expect(btns[0].classList.contains('o-btn-primary')).toBe(true);
    expect(btns[1].classList.contains('o-btn-danger')).toBe(true);
  });

  test('ODialog actions.variant - 透传至 OButton 的 variant prop', async () => {
    const actions = [
      { id: '1', label: 'Solid', variant: 'solid' as const, onClick: () => {} },
      { id: '2', label: 'Outline', variant: 'outline' as const, onClick: () => {} },
    ];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AV' } });
    await flush();
    const btns = document.body.querySelectorAll('.o-dlg-btn');
    expect(btns[0].classList.contains('o-btn-solid')).toBe(true);
    expect(btns[1].classList.contains('o-btn-outline')).toBe(true);
  });

  test('ODialog actions.disabled - 透传至 OButton 的 disabled prop', async () => {
    const actions = [{ id: '1', label: 'Disabled', disabled: true, onClick: () => {} }];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AD' } });
    await flush();
    const btn = document.body.querySelector('.o-dlg-btn') as HTMLElement;
    expect(btn.classList.contains('o-btn-disabled')).toBe(true);
  });

  test('ODialog actions.loading - 透传至 OButton 的 loading prop', async () => {
    const actions = [{ id: '1', label: 'Loading', loading: true, onClick: () => {} }];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AL' } });
    await flush();
    const btn = document.body.querySelector('.o-dlg-btn') as HTMLElement;
    expect(btn.querySelector('.o-btn-prefix.loading')).not.toBeNull();
  });

  test('ODialog actions.icon - 透传至 OButton 的 icon prop', async () => {
    const actions = [{ id: '1', label: 'Icon', icon: OIconAdd, onClick: () => {} }];
    render(ODialog, { props: { visible: true, actions }, slots: { default: () => 'AI' } });
    await flush();
    const btn = document.body.querySelector('.o-dlg-btn') as HTMLElement;
    expect(btn.querySelector('svg')).not.toBeNull();
  });
});

// ============================================================================
// 插槽契约：ODialog 提供 header / default / footer / actions 四个具名插槽
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('ODialog slot=default - 渲染至 .o-dlg-body-content', async () => {
    render(ODialog, { props: { visible: true }, slots: { default: () => 'SlotContent' } });
    await flush();
    const body = document.body.querySelector('.o-dlg-body-content') as HTMLElement;
    expect(body?.textContent).toContain('SlotContent');
  });

  test('ODialog slot=header - 渲染 .o-dlg-header 容器，未传时不渲染', async () => {
    render(ODialog, { props: { visible: true }, slots: { default: () => 'NoHeader' } });
    await flush();
    expect(document.body.querySelector('.o-dlg-header')).toBeNull();

    document.body.querySelectorAll('.o-dialog').forEach((el) => el.remove());

    render(ODialog, { props: { visible: true }, slots: { default: () => 'B', header: () => 'HeaderTitle' } });
    await flush();
    const header = document.body.querySelector('.o-dlg-header') as HTMLElement;
    expect(header).not.toBeNull();
    expect(header?.textContent).toContain('HeaderTitle');
  });

  test('ODialog slot=footer - 渲染 .o-dlg-footer，替换 actions 默认渲染', async () => {
    render(ODialog, {
      props: { visible: true, actions: [{ id: '1', label: 'OK', onClick: () => {} }] },
      slots: {
        default: () => 'Body',
        footer: () => h('span', { class: 'custom-footer' }, 'CustomFooter'),
      },
    });
    await flush();
    expect(document.body.querySelector('.custom-footer')).not.toBeNull();
    expect(document.body.querySelector('.o-dlg-actions')).toBeNull();
  });

  test('ODialog slot=actions - 替换 actions 默认的 OButton 渲染', async () => {
    render(ODialog, {
      props: { visible: true, actions: [{ id: '1', label: 'OK', onClick: () => {} }] },
      slots: {
        default: () => 'Body',
        actions: () => h('span', { class: 'custom-actions' }, 'CustomActions'),
      },
    });
    await flush();
    expect(document.body.querySelector('.custom-actions')).not.toBeNull();
    expect(document.body.querySelector('.o-dlg-btn')).toBeNull();
  });

  test('ODialog slot=footer 与 actions 均未传时 - 不渲染 .o-dlg-footer', async () => {
    render(ODialog, { props: { visible: true }, slots: { default: () => 'NF' } });
    await flush();
    expect(document.body.querySelector('.o-dlg-footer')).toBeNull();
  });
});
