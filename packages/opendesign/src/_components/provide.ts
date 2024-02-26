import { InjectionKey } from 'vue';

export const innerComponentInjectKey: InjectionKey<{
  isInnerInput: Boolean;
}> = Symbol('provide-inner-component');
