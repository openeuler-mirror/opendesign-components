import { ExtractPropTypes, PropType } from 'vue';
import { layerProps } from '../layer/types';
import { ColorT, SizeT, VariantT } from '../_shared/types';

export interface DialogActionT {
  id: string | number;
  color?: ColorT;
  variant?: VariantT;
  size?: SizeT;
  label: string;
  onClick: () => void;
}

export const dialogProps = {
  ...layerProps,
  /**
   * 是否隐藏可以关闭
   */
  hideClose: {
    type: Boolean,
  },
  actions: {
    type: Array as PropType<DialogActionT[]>,
  },
};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
