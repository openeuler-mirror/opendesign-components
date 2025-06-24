import { InjectionKey, Ref } from 'vue';

export const collapseInjectKey: InjectionKey<{
  computedValue: Ref<Array<string | number>>;
  handleItemClick: (val: string | number, e: Event) => void;
}> = Symbol('provide-collapse');
