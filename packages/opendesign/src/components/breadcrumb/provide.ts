import { InjectionKey } from 'vue';

interface BreadcrumbInjectT {
  separator: string | number;
}

export const breadcrumbInjectKey: InjectionKey<BreadcrumbInjectT> = Symbol('provide-breadcrumb');
