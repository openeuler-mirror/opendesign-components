import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { defaultRound } from '../_utils/global';
import type { RoundT } from './types';

export function getRoundClass(props: { round?: MaybeRefOrGetter<RoundT | undefined> }, name: string) {
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
        return {
          [`--${name}-radius`]: r === 'pill' ? '100vh' : r,
        };
      }
      return {};
    }),
  };
}
