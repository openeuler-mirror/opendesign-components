import { InjectionKey, Ref } from 'vue';

interface BreadcrumbInjectT {
  separator: Ref<string | number>;
}

export const breadcrumbInjectKey: InjectionKey<BreadcrumbInjectT> = Symbol('provide-breadcrumb');
