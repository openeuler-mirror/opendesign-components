import { InjectionKey } from 'vue';
import { LinkConfigT, LanguageConfigT } from './types';

export const configProviderInjectKey: InjectionKey<{
  locale?: LanguageConfigT;
  link?: LinkConfigT;
}> = Symbol('provide-config-provider');
