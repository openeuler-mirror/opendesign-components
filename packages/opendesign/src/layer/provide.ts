import { InjectionKey } from 'vue';

export const layerInjectKey: InjectionKey<{
  toggle: (show?: boolean) => void;
}> = Symbol('provide-layer');
