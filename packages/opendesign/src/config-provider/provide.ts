import { InjectionKey } from 'vue';
import { LanguageT } from '../locale/types';

export const configProviderInjectKey: InjectionKey<{
  locale?: LanguageT;
}> = Symbol('provide-config-provider');
