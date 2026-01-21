import { InjectionKey } from 'vue';

export const innerComponentInjectKey: InjectionKey<{
  isInnerInput: boolean;
}> = Symbol('provide-inner-component');
