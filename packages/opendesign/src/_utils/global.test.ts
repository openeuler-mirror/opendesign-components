/**
 * _utils/global.ts 全局配置测试。
 *
 * 覆盖 defaultZIndex / initZIndex / defaultSize / initSize /
 * defaultRound / initRound / defaultPrestColorPool / initPrestColor /
 * mediaPoint / initMediaPoint。
 *
 * 所有测试通过 afterEach 恢复全局状态，确保用例间隔离。
 */
import { test, expect, describe, afterEach } from 'vitest';
import {
  defaultZIndex,
  initZIndex,
  defaultSize,
  initSize,
  defaultRound,
  initRound,
  defaultPrestColorPool,
  initPrestColor,
  mediaPoint,
  initMediaPoint,
} from './global';
import { ColorPool } from './helper';

// 初始默认值快照，afterEach 恢复用
const SNAPSHOT = {
  zIndex: defaultZIndex.value,
  size: defaultSize.value,
  round: defaultRound.value,
  mediaPoint: { ...mediaPoint.value },
  prestColors: [...defaultPrestColorPool.value.pool],
};

afterEach(() => {
  initZIndex(SNAPSHOT.zIndex);
  initSize(SNAPSHOT.size);
  initRound(SNAPSHOT.round);
  initMediaPoint(SNAPSHOT.mediaPoint);
  initPrestColor(SNAPSHOT.prestColors);
});

describe('全局 z-index 配置', () => {
  test('initZIndex - 设置默认 z-index 值', () => {
    initZIndex(2000);
    expect(defaultZIndex.value).toBe(2000);
  });

  test('defaultZIndex - 初始值为 1000', () => {
    expect(defaultZIndex.value).toBe(1000);
  });
});

describe('全局 size 配置', () => {
  test('initSize - 设置默认 size', () => {
    initSize('large');
    expect(defaultSize.value).toBe('large');
  });

  test('defaultSize - 初始值为 medium', () => {
    expect(defaultSize.value).toBe('medium');
  });
});

describe('全局 round 配置', () => {
  test('initRound - 设置默认 pill', () => {
    initRound('pill');
    expect(defaultRound.value).toBe('pill');
  });

  test('defaultRound - 默认为 undefined', () => {
    expect(defaultRound.value).toBeUndefined();
  });
});

describe('全局颜色池配置', () => {
  test('initPrestColor - 设置自定义颜色池', () => {
    const colors = ['#fff', '#000'];
    initPrestColor(colors);
    expect(defaultPrestColorPool.value).toBeInstanceOf(ColorPool);
    // 取第一个颜色
    expect(defaultPrestColorPool.value.pick(0)).toBe('#fff');
  });
});

describe('全局 mediaPoint 配置', () => {
  test('mediaPoint - 默认 phone=600 / pad=1200', () => {
    expect(mediaPoint.value.phone).toBe(600);
    expect(mediaPoint.value.pad).toBe(1200);
  });

  test('initMediaPoint - 设置自定义断点', () => {
    initMediaPoint({ phone: 500, pad: 1000 });
    expect(mediaPoint.value.phone).toBe(500);
    expect(mediaPoint.value.pad).toBe(1000);
  });
});
