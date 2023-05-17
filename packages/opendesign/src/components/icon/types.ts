import { ExtractPropTypes, PropType, Component } from 'vue';

export const iconProps = {
  icon: {
    type: Object as PropType<Component>,
  },
  button: {
    type: Boolean,
  },
};

export type IconPropsT = ExtractPropTypes<typeof iconProps>;
