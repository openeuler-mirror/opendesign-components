import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { isClient, isFunction, isString } from '../../_utils/is';
import type { Ref } from 'vue';
import type { PosInfo } from '../types';
import type { TargetRect } from '../../popup/types';

/** 默认镂空圆角半径（px），未配置或值非法时回退 */
const DEFAULT_SPOTLIGHT_RADIUS = 4;

/**
 * @description 将 CSS 长度字符串解析为像素数值，支持 '12px'、'var(--o-radius-l)' 等任意 CSS 长度
 * @param raw - CSS 长度值字符串
 * @returns 像素数值，解析失败回退默认值
 */
function measureCssLengthPx(raw: string): number {
  // SSR 环境无 document，回退默认值
  if (!isClient) {
    return DEFAULT_SPOTLIGHT_RADIUS;
  }
  const probe = document.createElement('div');
  // inline-block 无内容时自然宽度为 0，非法值被忽略后回退 0 而非撑满容器
  probe.style.cssText = `position:absolute;left:-9999px;top:-9999px;display:inline-block;width:${raw};height:0;visibility:hidden;`;
  document.body.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(px) ? px : DEFAULT_SPOTLIGHT_RADIUS;
}

/**
 * @description 判断元素是否在视口内
 * @param element - 目标元素
 * @returns 是否在视口内
 */
function isInViewPort(element: HTMLElement): boolean {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

/** useTarget 选项参数 */
export interface UseTargetOptions {
  /** 目标元素引用 */
  target: Ref<string | HTMLElement | (() => HTMLElement | null) | null | undefined>;
  /** 是否打开 */
  open: Ref<boolean>;
  /** 间隙偏移量 */
  spotlightPadding: Ref<number>;
  /** 镂空圆角，支持 'pill' 或任意 CSS 长度字符串 */
  spotlightRadius: Ref<string | undefined>;
  /** 合并后的遮罩配置 */
  mergedMask: Ref<boolean>;
}

/**
 * @description 解析 target 并计算镂空位置信息
 * @param options - 选项参数
 */
export function useTarget(options: UseTargetOptions) {
  const { target, open, spotlightPadding, spotlightRadius, mergedMask } = options;
  const posInfo: Ref<PosInfo | null> = ref(null);

  /**
   * @description 非 pill 的 spotlightRadius 预解析为像素数值；'pill' 由 mergedPosInfo 按镂空尺寸计算
   */
  const spotlightRadiusPx = ref<number>(DEFAULT_SPOTLIGHT_RADIUS);
  watch(
    spotlightRadius,
    (raw) => {
      if (raw === undefined || raw === '' || raw === 'pill') {
        spotlightRadiusPx.value = DEFAULT_SPOTLIGHT_RADIUS;
        return;
      }
      // 非 pill 的 CSS 长度字符串解析为像素值；'pill' 由 mergedPosInfo 按镂空尺寸计算
      spotlightRadiusPx.value = measureCssLengthPx(raw);
    },
    { immediate: true },
  );

  /**
   * @description 获取目标元素
   */
  const getTargetEl = (): HTMLElement | null | undefined => {
    if (isString(target.value)) {
      return document.querySelector<HTMLElement>(target.value);
    }
    if (isFunction(target.value)) {
      return target.value();
    }
    return target.value;
  };

  /**
   * @description 仅刷新目标矩形，不做 scrollIntoView。
   * 滚动跟随场景下不得与用户滚动对抗，故与 updatePosInfo 拆分
   * @param targetEl - 目标元素
   */
  const syncPosInfo = (targetEl: HTMLElement) => {
    const { left, top, width, height } = targetEl.getBoundingClientRect();
    posInfo.value = { left, top, width, height, radius: 0 };
  };

  /**
   * @description 更新目标元素的位置信息：目标不在视口时先滚动入视口再取矩形
   */
  const updatePosInfo = () => {
    const targetEl = getTargetEl();
    if (!targetEl || !open.value) {
      posInfo.value = null;
      return;
    }
    if (!isInViewPort(targetEl)) {
      targetEl.scrollIntoView({ block: 'center' });
    }
    syncPosInfo(targetEl);
  };

  watch([open, target], () => updatePosInfo());

  /**
   * @description 页面滚动时刷新目标矩形（rAF 节流），
   * 驱动遮罩镂空与步骤弹层同步跟随（滚动跟随职责在调用方，ADR 0001）
   */
  let scrollRAF = 0;
  const onScroll = () => {
    if (scrollRAF) {
      return;
    }
    scrollRAF = requestAnimationFrame(() => {
      scrollRAF = 0;
      const targetEl = getTargetEl();
      if (targetEl && open.value) {
        syncPosInfo(targetEl);
      }
    });
  };

  onMounted(() => {
    updatePosInfo();
    window.addEventListener('resize', updatePosInfo);
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePosInfo);
    window.removeEventListener('scroll', onScroll);
    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF);
      scrollRAF = 0;
    }
  });

  const mergedPosInfo = computed(() => {
    if (!posInfo.value) return posInfo.value;
    const gap = spotlightPadding.value;
    const width = posInfo.value.width + gap * 2;
    const height = posInfo.value.height + gap * 2;
    // pill：胶囊形，圆角取短边一半，保证两侧为半圆且不超出宽高；其余用预解析像素值
    const radius = spotlightRadius.value === 'pill' ? Math.floor(Math.min(width, height) / 2) : spotlightRadiusPx.value;
    return {
      left: posInfo.value.left - gap,
      top: posInfo.value.top - gap,
      width,
      height,
      radius,
    };
  });

  /**
   * @description 定位源快照，提供给 OPopup 的 targetRect（视口坐标系纯数据，ADR 0001）。
   * 始终从 mergedPosInfo 派生以建立响应依赖（scroll/resize/步骤切换均写回 posInfo）；
   * 有遮罩时为含间隙区域，无遮罩时去除间隙贴合真实元素
   */
  const triggerTarget = computed<TargetRect | undefined>(() => {
    const pos = mergedPosInfo.value;
    if (!pos) {
      return undefined;
    }
    if (!mergedMask.value) {
      // 无遮罩：去除间隙，贴合真实元素矩形
      const gap = spotlightPadding.value;
      return {
        left: pos.left + gap,
        top: pos.top + gap,
        width: pos.width - gap * 2,
        height: pos.height - gap * 2,
      };
    }
    return { left: pos.left, top: pos.top, width: pos.width, height: pos.height };
  });

  return { mergedPosInfo, triggerTarget, getTargetEl };
}
