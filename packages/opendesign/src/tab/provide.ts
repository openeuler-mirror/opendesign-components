import { ComputedRef, InjectionKey, Ref } from 'vue';

import { TabPanePropsT } from './types';

export type TabChildData = {
  paneKey: ComputedRef<string | number>;
  props: Readonly<TabPanePropsT>;
  navRenderer?: () => any;
};

export type SortedChildData = TabChildData & {
  uid: number;
  getVNode: () => any;
};

export const tabInjectKey: InjectionKey<{
  lazy: boolean;
  activeValue: Ref<string | number | undefined>;
  addChild: (child: SortedChildData) => void;
}> = Symbol('provide-tab');
