import { InjectionKey, Ref } from 'vue';


export const tabsInjectKey: InjectionKey<{
  value: Ref<string | number>
  navRefs: Record<string | number, Ref<HTMLElement | undefined>>,
  addTabNav: (value: string | number) => void,
}> =
  Symbol('provide-tabs');

