import { ComputedRef, InjectionKey, Ref } from 'vue';

import { TabPanePropsT } from './types';

export type TabChildData = {
  paneKey: ComputedRef<string | number>;
  props: Readonly<TabPanePropsT>;
  navRenderer?: () => any;
  /** tabNav是否被挂载了，用于更新锚点位置 */
  navMounted: Promise<void>;
  setNavMounted: () => void;
};

export const tabInjectKey: InjectionKey<{
  lazy: boolean;
  activeValue: Ref<string | number | undefined>;
  registerChild: (child: TabChildData) => void;
  handleChildMounted: (paneKey: string | number) => void;
}> = Symbol('provide-tab');
