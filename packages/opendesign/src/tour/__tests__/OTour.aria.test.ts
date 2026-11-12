/**
 * OTour ARIA 无障碍契约测试。
 *
 * 覆盖：引导弹层的 dialog 契约（role + 可访问名称）与可访问名称覆盖口。
 */
import { test, expect, describe, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OTour from '../OTour.vue';
import OTourStep from '../OTourStep.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

/** 挂载引导：自定义 wrapper 收口 Teleport，注入一个带 target 的步骤。 */
const mountTour = (ariaLabel?: string) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'tour-aria-wrapper';
  document.body.appendChild(wrapper);
  const target = document.createElement('div');
  wrapper.appendChild(target);
  const screen = render(OTour, {
    props: { visible: true, wrapper, ...(ariaLabel ? { ariaLabel } : {}) },
    slots: {
      default: () => h(OTourStep, { target, title: '步骤标题', detail: '步骤详情' }),
    },
  });
  return { wrapper, screen };
};

describe('ARIA — OTour', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(() => {
    document.querySelectorAll('.tour-aria-wrapper').forEach((el) => el.remove());
  });

  test('引导弹层设 role="dialog" 并联动 aria-modal', async () => {
    const { wrapper } = mountTour();
    await flush();
    const dialog = wrapper.querySelector('.o-tour-popup[role="dialog"]') as HTMLElement;
    expect(dialog).toBeTruthy();
    // OPopup 在 role=dialog 时联动输出 aria-modal
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('未传 ariaLabel 时回退 i18n 默认词条，显式传入时覆盖', async () => {
    const bare = mountTour();
    await flush();
    const bareDialog = bare.wrapper.querySelector('.o-tour-popup[role="dialog"]') as HTMLElement;
    expect(bareDialog.getAttribute('aria-label')).toBeTruthy();

    document.querySelectorAll('.tour-aria-wrapper').forEach((el) => el.remove());
    const explicit = mountTour('新手引导');
    await flush();
    const explicitDialog = explicit.wrapper.querySelector('.o-tour-popup[role="dialog"]') as HTMLElement;
    expect(explicitDialog.getAttribute('aria-label')).toBe('新手引导');
  });
});
