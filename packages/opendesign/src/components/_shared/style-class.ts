import { computed } from 'vue';
import { defaultRound } from '../_shared/global';

export function getRoundClass(props: any, name: string) {

  return {
    class: computed(() => {
      if (props.round === 'pill' || (!props.round && defaultRound.value === 'pill')) {
        return `o-${name}-round-pill`;
      }
      return '';
    }),
    style: computed(() => {
      if (props.round && props.round !== 'pill') {
        return {
          [`--${name}-radius`]: props.round
        };
      }
      return {};
    })
  };
}