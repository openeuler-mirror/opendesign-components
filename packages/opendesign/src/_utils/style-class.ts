import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { defaultRound } from '../_utils/global';
import type { RoundT } from './types';

/**
 * @description 由 round 配置派生圆角 class 与内联圆角变量。
 *
 * pill 时输出 `o-{name}-round-pill` class（name 以 -/_ 开头时为 `o{name}-round-pill`），
 * 圆角值由样式层的 class 规则提供；显式 round 值（如 '12px'）则以内联
 * `--{name}-radius` 变量输出，优先级高于样式表。
 *
 * 多行控件（textarea / select 多选 / cascader 多选等）高度随内容增长，
 * pill 的 100vh 会被浏览器 clamp 到半高形成巨大圆弧，因此 multiline 为真时
 * pill 不再输出内联 100vh，圆角完全交给 CSS 按 size 提供固定常数
 * （见 `_styles/round-pill.scss` 的 round-pill-multiline mixin）。
 *
 * @param props 含 round 配置的对象（可为响应式源）
 * @param name 组件名（用于拼 class 与 CSS 变量名）
 * @param multiline 是否多行控件；为真时 pill 走 CSS 常数路径，自定义值路径不受影响
 * @returns class 与 style 两个 computed，分别绑定到根元素的 class/style
 */
export function getRoundClass(props: { round?: MaybeRefOrGetter<RoundT | undefined> }, name: string, multiline?: MaybeRefOrGetter<boolean>) {
  const round = () => toValue(props.round);
  return {
    class: computed(() => {
      const r = round();
      if (r === 'pill' || (!r && defaultRound.value === 'pill')) {
        return ['-', '_'].includes(name[0]) ? `o${name}-round-pill` : `o-${name}-round-pill`;
      }
      return '';
    }),
    style: computed(() => {
      const r = round();
      if (r) {
        // 多行 pill 不内联 100vh：高盒子上 clamp 出的半高是巨大圆弧，
        // 圆角值交给 CSS 的 pill class 按 size 提供常数
        if (r === 'pill' && toValue(multiline)) {
          return {};
        }
        return {
          [`--${name}-radius`]: r === 'pill' ? '100vh' : r,
        };
      }
      return {};
    }),
  };
}
