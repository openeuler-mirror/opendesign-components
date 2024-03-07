import { InjectionKey, Ref } from 'vue';

export interface BreadcrumbInjectT {
  separator: Ref<string | number| undefined>;
}

export const breadcrumbInjectKey: InjectionKey<BreadcrumbInjectT> = Symbol('provide-breadcrumb');
