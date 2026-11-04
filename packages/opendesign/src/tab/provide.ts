import { ComputedRef, InjectionKey, Ref } from 'vue';

import { TabPanePropsT } from './types';

export type TabChildData = {
  paneKey: ComputedRef<string | number>;
  /** 页签面板 DOM id，供 nav 的 aria-controls 引用；nav 的 DOM id 为 `${paneId}-nav` */
  paneId: string;
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
