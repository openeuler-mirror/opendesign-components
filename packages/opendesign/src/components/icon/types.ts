import { ExtractPropTypes, PropType } from 'vue';

export const iconProps = {
  icon: {
    type: Object as PropType<any>,
  },
};

export type IconPropsT = ExtractPropTypes<typeof iconProps>;
