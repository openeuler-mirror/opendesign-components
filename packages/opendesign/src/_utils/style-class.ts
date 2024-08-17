import { computed } from 'vue';
import { defaultRound } from '../_utils/global';

export function getRoundClass(props: any, name: string) {
  return {
    class: computed(() => {
      if (props.round === 'pill' || (!props.round && defaultRound.value === 'pill')) {
        return ['-', '_'].includes(name[0]) ? `o${name}-round-pill` : `o-${name}-round-pill`;
      }
      return '';
    }),
    style: computed(() => {
      if (props.round) {
        return {
          [`--${name}-radius`]: props.round === 'pill' ? '100vh' : props.round,
        };
      }
      return {};
    }),
  };
}
