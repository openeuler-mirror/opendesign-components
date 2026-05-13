import { ComputedRef, InjectionKey, Ref } from 'vue';

import { TabPanePropsT } from './types';

export type TabChildData = {
  paneKey: ComputedRef<string | number>;
  props: Readonly<TabPanePropsT>;
  navRenderer?: () => any;
};

export const tabInjectKey: InjectionKey<{
  lazy: boolean;
  activeValue: Ref<string | number | undefined>;
  registerChild: (child: TabChildData) => void;
  handleChildMounted: (paneKey: string | number) => void;
}> = Symbol('provide-tab');
