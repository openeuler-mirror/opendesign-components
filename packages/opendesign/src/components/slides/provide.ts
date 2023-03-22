import { InjectionKey, Ref } from 'vue';


export const slidesInjectKey: InjectionKey<{
  currentIndex: Ref<number>
  // Ref: Ref<HTMLElement | null>,
  // updateValue: (value: string | number, navEl: HTMLElement | null) => void,
  // onDeletePane: (value: string | number, evt: MouseEvent) => void,
}> = Symbol('provide-slides');

