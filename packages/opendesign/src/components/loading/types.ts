import { ExtractPropTypes } from 'vue';
import { layerProps } from '../layer/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { maskClose, ...extractProps } = layerProps;

export const loadingProps = {
  ...extractProps,
};

export type LoadingPropsT = ExtractPropTypes<typeof loadingProps>;
