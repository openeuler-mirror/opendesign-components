import { InjectionKey } from 'vue';

export const tabsInjectKey: InjectionKey<{
  validator: (value: string | number) => boolean
}> = Symbol('provide-form-item');

