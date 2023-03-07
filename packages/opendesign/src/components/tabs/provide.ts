import { InjectionKey, Ref } from 'vue';


export const tabsInjectKey: InjectionKey<{
  lazy: boolean,
  navsRef: Ref<HTMLElement | null>,
  bodyRef: Ref<HTMLElement | null>,
  activeValue: Ref<string | number | undefined>,
  initValue: (value: string | number, navEl: HTMLElement | null) => void,
  updateValue: (value: string | number, navEl: HTMLElement | null) => void,
  onDeletePane: (value: string | number, evt: MouseEvent) => void,
}> = Symbol('provide-tabs');

