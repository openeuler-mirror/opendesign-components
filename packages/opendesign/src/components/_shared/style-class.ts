import { computed, StyleValue } from 'vue';
import { defaultRound } from '../_shared/global';

export function getRoundClass(props: any, name: string) {

  return {
    class: computed(() => {

      if (props.round) {
        if (props.round === 'pill') {
          return `o-${name}-round-pill`;
        } else {
          return `o-${name}-round-diy`;
        }
      } else {
        if (defaultRound.value) {
          return `o-${name}-round-diy`;
        }
      }
      return '';
    }),
    style: computed(() => {
      const rlt: StyleValue = {};

      const round = props.round || defaultRound.value;

      if (round) {
        if (round !== 'pill') {
          return {
            [`--${name}-radius`]: props.round
          };
        }
      }
      return rlt;
    })
  };
}