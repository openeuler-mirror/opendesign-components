import { InjectionKey, Ref, Slots, SetupContext } from 'vue';

export interface TabNavData {
  value: string | number;
  label?: string;
  transition?: string,
  unmountOnHide?: boolean,
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
  slots?: Slots;
  attrs?: SetupContext['attrs'],
}


export const tabsInjectKey: InjectionKey<{
  value: Ref<string | number>,
  lazy: boolean,
  addTabItem: (key: string | number, data: TabNavData) => void,
  removeTabItem: (tabKey: string | number) => void,
}> = Symbol('provide-tabs');

