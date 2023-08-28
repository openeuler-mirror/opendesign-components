import { InjectionKey, Ref } from 'vue';

export const collapseInjectKey: InjectionKey<{
  realValue: Ref<Array<string | number>>;
  accordion: Ref<Boolean>;
  updateModelValue: (val: Array<string | number>) => void;
  onChange: (val: string | number, ev: Event) => void;
}> = Symbol('provide-collapse');
