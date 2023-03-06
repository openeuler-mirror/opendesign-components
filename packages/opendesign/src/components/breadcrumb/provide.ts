import { InjectionKey } from 'vue';

export interface BreadcrumbInjectT {
  separator: string | number;
}

export const breadcrumbInjectKey: InjectionKey<BreadcrumbInjectT> = Symbol('provide-breadcrumb');
